---
title: Getting started
description: Help for basic usage
---
## Your shareable
TL;DR Your shareable contains information that allows others to contact you. Exchange this with a friend to begin chatting.

To be precise, it is the following information encoded as base64:
- Your display name
- Your origin URL (the address that people will send messages to)
- Your publicKeyHash (the checksum of your public auth key)
- Your public auth key (to verify the signature of your messages)
- Your public Diffie-Hellman key (to encrypt messages with a shared key derived from this plus their own private key)

### QR code
The QR code is simply your shareable as a link (URL). Scanning it with a phone camera is a convenient way to quickly exchange shareables.


## Origin
This is the server to which your app is connected. It is where other people will send you messages. Therefore, when you change this, your shareable will also change. If you change this, you will have to give each of your contacts your new shareable.