---
title: Server
description: Guidance on usage & configuration of go-npchat.
---
## Configuration
go-npchat can be configured in the following ways. Priority goes from lowest to highest (the latter overrides the former).
### Environment variables
The following environment variables can be set:
```zsh
NPCHAT_PORT # HTTP port
NPCHAT_CERT # TLS certificate (.pem)
NPCHAT_PRIVKEY # TLS private key (.pem)
NPCHAT_MSG_TTL # time until messages are kicked (seconds)
NPCHAT_USER_TTL # time since last connection until user data is kicked (seconds)
NPCHAT_CLEAN_PERIOD # time period between kicking old values & writing to persistence file (seconds)
NPCHAT_PERSIST # persistence file written to (read on restart), define an empty string to disable this feature
```

### Args
You can also run with the following command-line arguments:
```zsh
./go-npchat --port=8000 \
--cert="your-cert.pem" \ # must include the full chain (except root)
--privkey="your-privkey.pem" \
--msgttl=60 \
--userttl=7776000 \ # default is 90 days
--cleanperiod=30
--persist="" # an empty string disables writing to a file
```
