---
title: Hosting
description: Guidance for hosting on your own infrastructure.
---
## Build container image
Use the Makefile in the go-npchat repo to build the image using Docker. You must have the Docker daemon installed & running.
```zsh
# clone the repo
git clone https://github.com/npchat/go-npchat
# change directory
cd go-npchat
# build image using Makefile & Docker daemon
make build
```

## Docker
There are many advantages of running this service inside a container. If you have a Synology, this approach is a perfect fit.

```bash
docker pull druseless/go-npchat:latest
docker run -p 8000:8000 druseless/go-npchat:latest
```

## Fly.io
You can easily deploy the go-npchat Docker image on fly.io. A `fly.toml` config is included in the repository.
```bash
# install flyctl
brew install superfly/tap/flyctl
# authenticate with fly.io
flyctl auth signup
# clone repo to your local machine
git clone https://github.com/npchat/go-npchat
# change directory
cd go-npchat
# initialise & deploy the app
flyctl launch
# show hostname of deployment
flyctl info
```

## Helmsman
[npchat-helmsman](https://github.com/npchat/npchat-helmsman) is a simple load-balancer.

Each instance of the npchat server is defined in a config file. The id for each instance is the hash of it's host (domain:port). When a request is recieved, the id is compared with the id of each instance using XOR. The result of the XOR is the distance metric for each node for the current user id. The request is proxied to the node with the smallest distance metric.

This ensures that traffic is fairly evenly distributed across nodes. It also ensures that multiple requests for a single id will be routed deterministically to the same node. This means that state must not be shared across nodes.

### Configuration
An example configuration file would look like:
```json
{
	"port": 8080,
	"nodes": [
		{
			"name": "axl",
			"host": "axl.npchat.org",
			"tls": true
		},
		{
			"name":"wispy-feather-9047",
			"host": "wispy-feather-9047.fly.dev",
			"tls": true
		}
	]
}
```