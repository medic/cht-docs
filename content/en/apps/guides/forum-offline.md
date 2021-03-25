## Overview

In this post we look at setting up an instance of the CHT server that is initially online so it can be configured, but ultimately is deployed fully offline.  We'll be using the information from the newly published [Offline CHT Server](https://docs.communityhealthtoolkit.org/apps/guides/offline/) guide in the CHT docs as well as the existing guide on [how to deploy a self-hosted CHT server](https://github.com/medic/cht-infrastructure/tree/master/self-hosting).

Our environment has the following setup:
  * A router with the IP `192.168.8.1`
  * A WiFi access point (AP) (using the one in the router)
  * A CHT server running on Ubuntu 20.04 with a static IP of `192.168.8.2`
  * An Android device running Android 10 
  * An unbranded install of [medic-android 0.7.3](https://github.com/medic/medic-android/releases/download/v0.7.3/medic-android-v0.7.3-unbranded-webview-arm64-v8a-release.apk)

Unless otherwise specified, all commands are run on the Ubuntu server as the `root` user.  All commands should be run from the same location of `/root`.  You will end up with a folder that looks like this*:
```bash
/root
   /cht-docker-compose-local-host.yml
   /etc-dnsmasq.d
   /etc-pihole
   /medic-srv
   /pi-hole-docker-compose.yml
   /tls-certs
```

_*  There will be other folders like `Documents` and `Pictures` as this is a Desktop install. These can be ignored._

**NOTE** - This is for development only.  It is not meant for a production environment.  Please see [this note](https://docs.communityhealthtoolkit.org/apps/guides/offline/) for more information.


## LAN & Server

1. Set up a router that has DHCP turned off

1. Set up an AP

1. Install Ubuntu on bare metal. I chose [Ubuntu desktop](https://ubuntu.com/download/desktop) (vs [server](https://ubuntu.com/download/server)) so the server itself had a GUI I could use to configure settings.

1. Assign static IP, I used `192.168.8.2` by using the [desktop GUI](https://pimylifeup.com/ubuntu-20-04-static-ip-address/#desktopstaticip).

1. Install [docker](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04) and [docker compose](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04) on the server

1. Ensure [port 53 is free](https://www.linuxuprising.com/2020/07/ubuntu-how-to-free-up-port-53-used-by.html) on the server so that the DNS server can bind to it below


## DNS & DHCP

1. Download the pi-hole [docker compose file](https://raw.githubusercontent.com/pi-hole/docker-pi-hole/master/docker-compose.yml.example) and save it to `pi-hole-docker-compose.yml`

1. Uncomment and set `WEBPASSWORD` to be a good password

1. Edit `pi-hole-docker-compose.yml` so that it uses `host` mode by removing all ports and replace them with `network_mode: host` per the [Pi-hole docker docs](https://docs.pi-hole.net/docker/DHCP/#docker-pi-hole-with-host-networking-mode). The relevant section should look like this (it should not use `YOUR PASSWORD HERE` as the password):
      ```yml
          network_mode: host
          environment:
            TZ: 'America/Chicago'
            WEBPASSWORD: 'YOUR PASSWORD HERE'
      ```
   
1. Start the Pi-hole container: `docker-compose -f pi-hole-docker-compose.yml up --detach`. You should be able to browse to http://192.168.8.2/admin and login in to Pi-hole the using `WEBPASSWORD` you set above.
   
1. Go to "Settings" -> "DHCP" and turn on DHCP, ensuring "range" and "router" are set to be correct for your LAN. It was 192.168.8.100 -  192.168.8.250 and 192.168.8.1 in my case
   
1. Go to "Settings" -> "DNS" -> "Interface listening behavior" and set it to "Listen on all interfaces, permit all origins"
   
1. Go to "Local DNS" -> "DNS Records" and add two entries for your CHT instance and Pi-hole instance. These need to match matches the CN in your certificate.
      ```
      cht.my.local-ip.co 192.168.8.2
      dns.my.local-ip.co 192.168.8.2
      ```
   
1. Go to "Disable" and choose "Indefinitely" so there is no DNS filtering 


## CHT Server and Data

Following the [CHT self-hosted guide](https://github.com/medic/cht-infrastructure/tree/master/self-hosting), this section provisions a docker container and then configures it to preserve your data as otherwise Docker does not keep it:

> Docker containers are [stateless](https://www.redhat.com/en/topics/cloud-native-apps/stateful-vs-stateless) by design. In order to persist your data when a container restarts you need to specify the volumes that the container can use to store data.

1. Get the latest [docker-compose file](https://raw.githubusercontent.com/medic/cht-infrastructure/master/self-hosting/main/docker-compose.yml) and save it to `cht-docker-compose-local-host.yml`. Edit it to:
   
      1. Remove the ports section and replace them with `network_mode: host` like we did above.  (This will work around an issue we're seeing with `nginx` [failing to start](https://forum.communityhealthtoolkit.org/t/problems-cht-local-setup/1147).)
      1. Change the volume `- medic-data:/srv` to be `'./medic-srv:/srv'`. Note there are two instances of this volume - be sure to change them both.
      1. Remove the shared volume declaration:
         ```yml
         volumes:
             medic-data:
                 name: medic-data
         ```
   
1. Export the `DOCKER_COUCHDB_ADMIN_PASSWORD` per [the instructions](https://github.com/medic/cht-infrastructure/tree/master/self-hosting#installing-with-a-compose-file)
   
1. Create the new shared `medic-srv` directory: `mkdir medic-srv`
   
1. Start the CHT docker instance: `docker-compose -f cht-docker-compose-local-host.yml up --detach`. This will create a number of files and folders, including the file edited in the next step.

1. As Pi-hole is running on port `80`, comment out the `server` listening on that port, so it looks like this:
      ```yaml
       #server {
       #    listen         80;
       #    server_name    _;
       #    error_log /srv/storage/medic-core/nginx/logs/error.log;
       #    location / {
       #        return 301 https://$host$request_uri;
       #    }
       #}
      ```
   Restart the `nginx` server with `docker exec -it medic-os /boot/svc-restart medic-core nginx` to ensure the changes take effect. 
   
1. CHT should be available at  `https://cht.my.local-ip.co`, but has an invalid certificate.  We'll fix this below.


## TLS

### Prepare and mount certificates

In this example we're using the free certificates offered on [local-ip.co](http://local-ip.co). We'll store them in `./tls-certs` and share this between all the containers. For your deployment it is assumed you will provide your own certificates, but local-ip's are free to test with.

1. Given our bare metal server is using upstream DNS and not the Pi-hole, you may want to add an entry in the `/etc/hosts` file to aid testing locally:
    ```bash
    192.168.8.2     dns.my.local-ip.co
    192.168.8.2     cht.my.local-ip.co
    ```
1. Prepare the TLS certificates on the shared mount point:
    ```
    mkdir tls-certs
    cd tls-certs
    curl -s -o server.pem http://local-ip.co/cert/server.pem
    curl -s -o chain.pem http://local-ip.co/cert/chain.pem
    curl -s -o server.key http://local-ip.co/cert/server.key
    cat server.key server.pem > lighttpd.key.and.pem.pem
    cat server.pem chain.pem > server.chained.pem
    ```
   
1. Add a mount point to both containers `medic-os` and `pihole` so that they can read these certs. In each `docker-compose` file in the `volumes:` section add a new entry on its own line: `- './tls-certs/:/etc/tls-certs/'`
   
1. Restart both containers:
    ```bash
    docker-compose -f cht-docker-compose-local-host.yml restart medic-os
    docker-compose -f pi-hole-docker-compose.yml restart pihole
    ```
   
1. Check that both containers can see the certificates:
    ```bash
    docker exec -it pihole ls /etc/tls-certs
    docker exec -it medic-os ls /etc/tls-certs
    ```


### TLS on Pi-hole

Pi-hole uses `lighttpd` as its front end web server. These steps add an explicit host on port `8443` using our valid certificate:

1. Enter the `pihole` container with `docker exec -it pihole /bin/bash`
   
1. `cd` into `/etc/lighttpd`
   
1. Edit the empty `external.conf` file and add this content:
    ```
    $HTTP["host"] == "dns.my.local-ip.co" {
      # Ensure the Pi-hole Block Page knows that this is not a blocked domain
      setenv.add-environment = ("fqdn" => "true")
      
      # Enable the SSL engine with a LE cert, only for this specific host
      $SERVER["socket"] == ":8443" {
        ssl.engine = "enable"
        ssl.pemfile = "/etc/tls-certs/lighttpd.key.and.pem.pem"
        ssl.ca-file =  "/etc/tls-certs/chain.pem"
        ssl.honor-cipher-order = "enable"
        ssl.cipher-list = "EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH"
        ssl.use-sslv2 = "disable"
        ssl.use-sslv3 = "disable"
      }
      
      # Redirect HTTP to HTTPS
      $HTTP["scheme"] == "http" {
        $HTTP["host"] =~ ".*" {
          url.redirect = (".*" => "https://%0:8443$0")
        }
      }
    }
    ```
   
1. Restart the web server with `sudo service lighttpd restart`
   
1. Test that you have a valid certificate on `https://dns.my.local-ip.co:8443`


### TLS on CHT

CHT uses `nginx` as its front end web server. These steps follow the [CHT Self-hosting guide](https://github.com/medic/cht-infrastructure/tree/master/self-hosting#ssl-certificate-installation) to install our valid certificate:

1. Enter the `medic-os` container with `docker exec -it medic-os /bin/bash`
   
1. `cd` into `/srv/settings/medic-core/nginx/`
   
1. Edit the `nginx.conf` file and change the two certificate lines to look like this:
      ```
      ssl_certificate             /etc/tls-certs/server.chained.pem;
      ssl_certificate_key         /etc/tls-certs/server.key;
      ```
   
1. Restart the web server with `/boot/svc-restart medic-core nginx`
   
1. Rest that you have a valid certificate on `https://cht.my.local-ip.co`


## Boot Persistence

While there are [many ways](https://docs.docker.com/config/containers/start-containers-automatically) to have Docker start at boot, we'll use the last recommendation, `systemd`, to do this.

For all three containers in the two `.yml` files, ensure they have the `restart: unless-stopped` setting.  When coupled with the `systemd` service entry, this will ensure the service stays running if it restarts.

Start by pulling down all the containers:

```
docker-compose -f cht-docker-compose-local-host.yml down
docker-compose -f pi-hole-docker-compose.yml down
```

Now proceed to create the two services below.

### Pi-hole

1. Create a file `/etc/systemd/system/pihole-docker.service` with the contents:
      
      ```
      [Unit]
      Description=Start Pi-hole in Docker
      Requires=docker.service
      After=docker.service
      
      [Service]
      Type=oneshot
      RemainAfterExit=yes
      WorkingDirectory=/root/
      ExecStart=/usr/local/bin/docker-compose -f pi-hole-docker-compose.yml up --detach
      ExecStop=/usr/local/bin/docker-compose -f pi-hole-docker-compose.yml down
      TimeoutStartSec=0
      
      [Install]
      WantedBy=multi-user.target
      ```
   
1. Reload `systemd` with `systemctl daemon-reload` and enable and start the service with `systemctl enable --now pihole-docker`
   
1. Ensure the service started by checking the status `systemctl status pihole-docker`


### CHT

1. Create a file `/etc/systemd/system/cht-docker.service` with the contents:
      
      ```
      [Unit]
      Description=Start CHT in Docker
      Requires=docker.service
      After=docker.service
      
      [Service]
      Type=oneshot
      RemainAfterExit=yes
      WorkingDirectory=/root/
      ExecStart=/usr/local/bin/docker-compose -f cht-docker-compose-local-host.yml up --detach
      ExecStop=/usr/local/bin/docker-compose -f cht-docker-compose-local-host.yml down
      TimeoutStartSec=0
      
      [Install]
      WantedBy=multi-user.target
      ```
   
1. Reload `systemd` with `systemctl daemon-reload` and enable and start the service with `systemctl enable --now cht-docker`
   
1. Ensure the service started by checking the status `systemctl status cht-docker`


### Test

Reboot the bare metal computer and ensure all service restart successfully. 

## Connecting devices

Now that your CHT instance is available via DNS, DHCP and TLS, any device on the network can connect to it.

### Android

Any APKs downloaded directly from GitHub will need to [be sideloaded](https://developer.android.com/distribute/marketing-tools/alternative-distribution). Otherwise, normally APKs downloaded from the Play Store do not have this limitation: 

1. Connect to the AP on your LAN
1. Download the [latest build](https://github.com/medic/medic-android/releases/latest), `0.7.3` as of this writing.  
1. After installing launching the APK, launch it and choose "Custom" for which CHT instance to use
1. Enter `https://cht.my.local-ip.co` 

### Desktop Browsers

1. Connect to the AP on your LAN
1. In a browser, go to [cht.my.local-ip.co](https://cht.my.local-ip.co). 

Note: The CHT does not support the Safari browser on MacOS