---
title: Getting started
description: Help for basic usage
---
## Your shareable
TL;DR Your shareable contains information that allows others to contact you. Exchange this with a friend to begin chatting.

To be precise, it is a link to the following information:
- Your display name
- Your origin URL (the address that people will send messages to)
- Your publicKeyHash (the checksum of your public auth key, your ID)
- Your public auth key (to verify the signature of your messages)
- Your public Diffie-Hellman key (to encrypt messages with a shared key derived from this plus their own private key)

### QR code
Scanning the QR code is a convenient way to quickly exchange shareables. This only works if your web-browser [supports](https://caniuse.com/registerprotocolhandler) custom protocol handlers.


## Origin
This is the server to which the app is connected. It is where other people will send you messages. You can point this to a server of your choice, self-hosted if you wish.