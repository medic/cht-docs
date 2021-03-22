### Overview

In this post we will look at setting up an instance of the CHT server that is initially online so it can be configured, but ultimately is deployed fully offline.  We'll be using the information from the newly published [Offline CHT Server](https://docs.communityhealthtoolkit.org/apps/guides/offline/) as well as the existing guide on [how to deploy a self hosted CHT server](https://github.com/medic/cht-infrastructure/tree/master/self-hosting).

Our environment has the following setup:
  * A router with the IP `192.168.8.1`
  * A WiFi access point (AP) (using the one in the router)
  * A CHT server running on Ubuntu 20.04 with a static IP of `192.168.8.2`
  * An Android device running Android 10 
  * An unbranded install of [medic-android 0.7.3](https://github.com/medic/medic-android/releases/download/v0.7.3/medic-android-v0.7.3-unbranded-webview-arm64-v8a-release.apk)


**NOTE** - This is for development only.  It is not meant for a production environment.  Please see [this note](https://docs.communityhealthtoolkit.org/apps/guides/offline/) for more information.

### LAN & Server

1. Set up a router that has and an AP, but that has DHCP turned off.  

1. Install Ubuntu on bare metal. I chose ubuntu desktop (vs server) so the computer itself had a GUI I could interact with.

1. Assign static IP, I used `192.168.8.2` by using the GUI.
https://pimylifeup.com/ubuntu-20-04-static-ip-address/#desktopstaticip

1. install docker and docker compose on the server
https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04
https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04

1. ensure port 53 is free to bind to on the server
https://www.linuxuprising.com/2020/07/ubuntu-how-to-free-up-port-53-used-by.html

### DNS & DHCP

1. grab the pi-hole [docker compose file](https://raw.githubusercontent.com/pi-hole/docker-pi-hole/master/docker-compose.yml.example)  and save it to `pi-hole-docker-compose.yml`

1. Uncomment and set `WEBPASSWORD` to be a good password

1. Edit `pi-hole-docker-compose.yml` so that it use `host` mode by removing all ports and replace them with `network_mode: host`
per the [Pi-Hole docker docs](https://docs.pi-hole.net/docker/DHCP/#docker-pi-hole-with-host-networking-mode). The final file should look like this (it should not use `YOUR PASSWORD HERE` as the password):

```yml
version: "3"

services:
  pihole:
    container_name: pihole
    image: pihole/pihole:latest
    network_mode: host
    environment:
      TZ: 'America/Chicago'
      WEBPASSWORD: 'YOUR PASSWORD HERE'
    volumes:
      - './etc-pihole/:/etc/pihole/'
      - './etc-dnsmasq.d/:/etc/dnsmasq.d/'
    cap_add:
      - NET_ADMIN
    restart: unless-stopped
```

1. Star the Pi-Hole container: `docker-compose -f pi-hole-docker-compose.yml up --detach`. You should be able to browse to http://192.168.8.2/admin and login in to Pi_hole the the using `WEBPASSWORD` you set above.

1. go to Settings -> DHCP and turn on DHCP, ensuring range and router are set to be correct for your LAN. It was 192.168.8.100 -  192.168.8.250 and 192.168.8.1 in my case

1. go to Settings -> DNS -> Interface listening behavior and set it to "Listen on all interfaces, permit all origins"

1. go to "Local DNS" -> "DNS Records" and add two entries for your CHT instance and Pi-Hole instance. These need to match matches the CN in your certificate.

  cht.my.local-ip.co 192.168.8.2
  dns.my.local-ip.co 192.168.8.2

1. Go to "Disable" and choose "Indefinitely" as don't want any DNS filtering enabled


### CHT

1. following our CHT guide
https://github.com/medic/cht-infrastructure/tree/master/self-hosting

1. get the latest [docker-compose file]() and like we did with Pi-Hole, remove the ports section and replace them with `network_mode: host`.  (This will work around an issue we're seeing with `nginx` [failing to start](https://forum.communityhealthtoolkit.org/t/problems-cht-local-setup/1147).)  The final result should look like this:

```yml
version: '3.7'
services:
  medic-os:
    container_name: medic-os
    image: medicmobile/medic-os:cht-3.9.0-rc.2
    volumes:
      - medic-data:/srv
    working_dir: /srv
    depends_on:
      - haproxy
    network_mode: host
    environment:
      - DOCKER_NETWORK_NAME=localhost
      - DOCKER_COUCHDB_ADMIN_PASSWORD=$DOCKER_COUCHDB_ADMIN_PASSWORD
  haproxy:
    container_name: haproxy
    image: medicmobile/haproxy:rc-1.17
    volumes:
      - medic-data:/srv
    environment:
      - COUCHDB_HOST=localhost
      - HA_PASSWORD=$DOCKER_COUCHDB_ADMIN_PASSWORD
    network_mode: host
volumes:
  medic-data:
    name: medic-data
```

1. export the `DOCKER_COUCHDB_ADMIN_PASSWORD` per the instructions

1. start the CHT docker instance
  docker-compose -f docker-compose.yml up -d


### TLS

In this example we're using the free certificates offered on [local-ip.co](http://local-ip.co). We'll store them in `./tls-certs` and share this between all the containers.

For you deployment it's assumed you will provide your own certificates.

1. prepare the TLS certificates on the shared mount point:

  ```
  mkdir tls-certs
  cd tls-certs
  curl -s -o server.pem http://local-ip.co/cert/server.pem
  curl -s -o chain.pem http://local-ip.co/cert/chain.pem
  cat server.pem chain.pem > server.chained.pem
  curl -s -o server.key http://local-ip.co/cert/server.key
  ```
