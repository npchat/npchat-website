---
title: Client
description: Technical information about the front-end.
---
## Serialization
Data is sent in binary form. It must therefore be serialized before transmission. We use [msgpack](https://msgpack.org/index.html) for this.

I would have preferred Protobuf, but currently it is not easy use in the browser. Plus, currently there are only a handful of data types.

## Message transport

### Outgoing
Messages must be sent with a `POST` request.
```zsh
curl "https://[NPCHAT_SERVER]/[PUBLIC_KEY_HASH]" -X POST \
--data-binary [DATA_SERIALISED_USING_MSGPACK]
```

### Incoming
Messages are received in via a WebSocket connection. See [authentication](/docs/client#authentication).

#### Public key hash
The key peice of information in this request is the URL pathname. This is the hash of the recipient's ECDSA P-256 public key.

#### Message body
The only requirement for the message body is that it must be binary data, marshalled as a msgpack buffer. It is not parsed at all by the chat server, so clients are free to impelement any kind of messaging features. For the sake of interoperability, the following fields are recommended:
```json
{
	"iv": "ECDH encryption IV",
	"m": "ECDH-encrypted message",
	"f": "Sender's publicKeyHash",
	"h": "SHA-256 of message",
	"s": "ECDSA signature of message"
}
```

### Outgoing
All messages to a reciepient (from any sender) will hit the same origin domain set by the recipient. This could be a load-balanced cluster of nodes, or a single instance.

If a Client connection ends, their session is deregistered and messages will be stored until either they are delivered, or they expire and are deleted.

## Security
### Authentication
A Client connects to the chat server & recieves messages as follows:
1. Client requests a WebSocket upgrade
2. Client signs a timestamp, and sends it to Server along with their public key
```json
{
	"time": 1643813619826,
	"sig": [],
	"publicKey": []
}
```
4. Server verifies that:
  - Hash of public key = publicKeyHash in URL pathname
	- Timestamp is within 1 second of server's current time
  - Client signature is valid
5. Server sends a message that authentication is done, along with the current WebPush VAPID key, and any stored data.
```json
{
	"message": "handshake done",
	"vapidKey": "BCTcJvQOgcL65yR4XmZoXcImc2AFsbLQZ3mL0ELmRxR4ysgjgnNdg4LMgeVJZkqDxz1nxhj99cJx0znHF-OWyEg",
	"data": [],
	"error": null
}
```
6. Server sends all messages stored (not yet expired & kicked)
7. Server forwards any message recieved immediately

With this mechanism, security depends on privacy of the privacy of the client's private key. A client application is obviously responsible for it's own secure key storage.

I know that this solution is vulnerable to a replay attack, where a man-in-the-middle can reuse an authentication message to authenticate itself. This could be solved by storing the timestamp signed until the validity threshhold has passed (1 second). Upon authentication, the server must simply check that the same timestamp has not already been used.