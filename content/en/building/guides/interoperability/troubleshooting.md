---
title: "Troubleshooting Interoperability"
linkTitle: "Troubleshooting"
weight: 5
description: >
   Guide to troubleshooting OpenHIM, Mediators, and configurations for interoperability workflows
keywords: openmrs interoperability
relatedContent: >
  building/guides/interoperability/cht-config
  building/guides/interoperability/ltfu
  building/guides/interoperability/openhim
  building/guides/interoperability/openmrs
  building/concepts/interoperability/
---
# Troubleshooting

## Error "bind: address already in use"
Users encountering:

> Error response from daemon: Ports are not available: exposing port TCP 0.0.0.0:5000 -> 0.0.0.0:0: listen tcp 0.0.0.0:5000: bind: address already in use

when running `./startup.sh init` need to update ports to available values in the `/docker/docker-compose.yml` file, under the `ports` verb.

## Error when running mediator `curl` request
If the mediator `curl` request fails, visit [http://localhost:9000/#!/clients](http://localhost:9000/#!/clients) and click on the icon the red arrow points to in the image below.

![](bad-client-screen.png)

## Error "Preset ts-jest is invalid:" when running `npm test`
Users encountering the error below when running `npm test`: 

> Preset ts-jest is invalid:
> The "id" argument must be of type string. Received null
> TypeError [ERR_INVALID_ARG_TYPE]: The "id" argument must be of type string. Received null

need to run `npm i --save-dev ts-jest` before running `npm test`. 

## Error "unsuccessful npm install" when running `npm install`
Users encountering the error when running `npm install`:

> npm ERR! code EACCES
> npm ERR! syscall unlink
> npm ERR! path /Users/phil/interoperability/cht-config/node_modules/.package-lock.json

need to run `npm install` as root user.
