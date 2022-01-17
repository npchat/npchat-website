---
title: Client
description: Technical information about the front-end.
---
## Transport
### Incoming
Incoming messages must be sent with a simple `POST` request. This allows clients to send messages to many recipients concurrently, without the overhead & complexity of managing multiple long-lived connections.

A message post request should look something like:
```zsh
curl "https://[NPCHAT_SERVER]/[PUBLIC_KEY_HASH]" -X POST \
--data-raw '{"t":1635605638136, \
"iv":"boTInSlEnz2CP649PevG_4EyPnikvJ0ODScGZtg1TCA", \
"m":"knSOiIT4t06W7QVpl3qQ4UZyL6tN", \
"f":"4es6LG3vF6hDs9-AIvbc-xII4d0lWmmSseMDfF2bNlY", \
"h":"ioKCJdSmvglamXV-6OdU4xoXK3_V8QwRIuE1TLXYHR0", \
"p":"iSM1biGkutj5Y4AcWViOzpU1XJl9y5wJjlNettmZXdY", \
"s":"Rg0bC5zPMcOW1UbZMdcF7NBKZMLOVlPqG_zgRRG_ztkdK7n"}'
```
#### Public key hash
The key peice of information in this request is the URL pathname. This is the hash of the recipient's ECDSA P-256 public key.

#### Message body
The only requirement for the message body, `--data-raw`, is that it must be a string. It is not parsed at all by the chat server, so clients are free to impelement any kind of messaging features. For the sake of interoperability, the following fields are recommended:
```json
{
	"iv": "ECDH encryption IV",
	"m": "ECDH-encrypted message",
	"f": "Sender's public key hash",
	"h": "SHA-256 of message",
	"p": "SHA-256 of previous message",
	"s": "ECDSA signature of message"
}
```

### Outgoing
All messages to a reciepient (from any sender) will hit the same origin domain set by the recipient. This could be a load-balanced cluster of nodes, or a single instance.

If a Client connection ends, their session is unregistered and messages will be stored until either they are delivered, or they expire and are deleted.

## Security
### Authentication
A Client connects to the chat server & recieves messages as follows:
1. Client requests a WebSocket upgrade
2. Client requests challenge from Server
```json
{
	"get": "challenge"
}
```
```json
{
	"challenge": {
		"txt":"DGcnjSfdw57ug3dswBzbOVrHeszb_xVuSHDG-lDJlLo",
		"sig":"hc8RYpZvg1Dfe8ipMzeZufcHw2mGl04LdwolQLtdHaBAj4K-cSgwYihAE_AyQgtVq2nXa3gQh5exoi66bz-Djw"
	}
}
```
3. Client signs challenge, and returns it to Server along with their public key
```json
{
	"publicKey":"BEm665Tx8GPIXMsh5OA0CDKvmWpBG-4CNmk-8PEqGuXgLOtBroYAs16G1lfO18zQhZJ_p9psQNBVCMGUz5wvxEc",
	"challenge": {
		"txt": "WiXlwryY8HTnGLWSmEIjZcRpLqb4Mtl_h6rW1VfsFok",
		"sig": "-H3kqdOFfNLAnGAj7N9u1WCrAOJxb23UdivL4786fVdqczUaACLOKSJSr8vfJAa7XEW5ty-AWvZ5OTF8bMy3PA"
	},
	"solution": "ITBpOM9jC9ALSMiUFi9Tkf1hpVl1CMC1A2HwZsu2dqOk8mICJKNT02z44LsiUD111T6-X-S9Ym-xKFnH5wNjFw"
}
```
4. Server verifies that:
  - Hash of public key = publicKeyHash in URL pathname
  - Server signature is valid
  - Client signature is valid
5. Server sends a message that authentication is done, along with the current WebPush VAPID key, and any stored data.
```json
{
	"message": "handshake done",
	"vapidKey": "BCTcJvQOgcL65yR4XmZoXcImc2AFsbLQZ3mL0ELmRxR4ysgjgnNdg4LMgeVJZkqDxz1nxhj99cJx0znHF-OWyEg",
	"data": "",
	"error": null
}
```
6. Server sends all messages stored (not yet expired & kicked)
7. Server forwards any message recieved immediately

With this mechanism, security depends on privacy of the Server's auth private key & privacy of the Client's auth private key. A client application is obviously responsible for it's own secure key storage.

Every challenge contains 32 random bytes & the signature for the random bytes.

So how do we prevent the private key being deduced by requesting enough signed challenges? This is a fundamental vulnerability if not handled carefully.

Adding a timestamp or TTL to the signed challenge would ensure that challenges do not remain valid indefinitely, but it does not prevent forged authorization when the private key is deduced by collecting enough challenges.

My answer to this question is extremly simple. After `x` challenges are served, generate a fresh key pair. If `x` is low enough that an attacker cannot get enough challenges to deduce the private key, his efforts are futile. This solution does not require any refresh period to be specified, and does not alter in behaviour with increased traffic. The default configuration is `x=100`. As generating keys incurs some computational cost, an ideal value depends on available resources & expected traffic.

If the assumptions based on a little knowledge of cryptography & bit of research are correct, then the following claims would be true:
- Messages cannot be forged or modified
- Messages can only be collected by the holder of the private key corresponding to a given public key

### Privacy
Out of the box, the chat server should provide secure & authenticated transport for messages. In reality, that has nothing to do with the content that is being transmitted. Hence, encryption of messages is handled completely & only by the client.

This approach ensures that clients are free to send any type of message they want. Currently the only constraint is that messages are `text/plain` content, normally stringified JSON. A goal is to remove this constraint to allow clients to do things such as negotiate WebRTC connections more easily.

The Webapp (npchat-web) implements ECDH P-256 to derive a shared secret from the ECDH public keys, and AES-GCM to encrypt messages with the shared secret. A more complete key derivation process is necessary here, HKDF would be good.
