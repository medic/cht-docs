---
title: "Offline CHT Server"
linkTitle: "Offline CHT"
weight: 100
description: >
 Running an instance of CHT Core server with no internet connection
---

{{% alert title="Development only" %}} This guide is not meant for a production CHT instance.  Support may be added in the future an offline CHT server in a production environment.  Please see the "Considerations" section below. {{% /alert %}}

## Introduction

The CHT is built as an offline first application. This applies to clients, either  browsers or Android applications, connecting to the CHT server.  The server itself assumes it has Internet connectivity to provide services such as DNS, software updates and general use connectivity.  This document explores what it looks like when the CHT server is offline without these services available.

Running a CHT server offline requires no modifications to the CHT itself.  Instead, supporting services normally found online are replicated locally. 

## Considerations

An offline CHT server is most appropriate for a development environment.  There are serious implications to consider before deploying an offline instance:

* Alerting - How will alerts be sent in the case of downtime or degraded service? 
* Power failures and unplanned restarts - Will the server cleanly restart such that the CHT resumes service correctly?
* Backups - What happens to the CHT data if there's a hard drive failure?  
* Disaster Recovery - What happens if there is a flood at the facility and active and backup data on site are destroyed?
* Scale - What happens when the hardware deployed needs to be upgraded to increase capacity?
* Updates - By definition TLS certificates expire and software needs to be updated - how will the deployment get these updates on a regular basis?
* Security - While the TLS certificate will protect data on the LAN, is the server hard drive encrypted in the event of property theft? 
* Privacy - The CHT inherently carries sensitive patient medical information in the database. Are there sufficient measures in place to protect this sensitive data?  

Additionally, if users are going to migrate between offline locations with the same domain name, always ensure a different login and password is used. This will prevent a client from another CHT instance trying to synchronize with a CHT instance it shouldn't synchronize with, possibly causing data corruption.


## Requirements

A CHT instance is accessible offline when you can resolve the domain to an IP address, and a TLS certificate is on the CHT server with a common name (CN) that matches the domain name:  

### Static IP

The CHT server needs to be given a static IP so that DNS will always resolve to the correct host.

### TLS Certificate

Browsers might allow you to connect to a server with an invalid TLS certificate after you [bypass the warning](https://www.ssl.com/guide/troubleshooting-ssl-tls-browser-errors-and-warnings/).  This is not so for an Android app like [Medic Android App](https://github.com/medic/medic-android/) - it requires a valid TLS certificate to work correctly.  You will need to acquire a valid TLS certificate from a certificate authority (CA) and install it on your CHT server.

It is common to use [Let's Encrypt](https://en.wikipedia.org/wiki/Let%27s_encrypt) for this as they provide free certificates. Be cautioned that Let's Encrypt certificates expire after 90 days, so the server will need to be constantly updated with a new certificate.  Other CAs provide certificates that expire after a year, so this concern will always apply.

After acquiring the certificate, if you are running a docker based CHT deployment, see [TLS instructions for Docker]({{< relref "/apps/guides/hosting/ssl-cert-install" >}}) to install the certificate. 

### Domain Name Server

In order to match the static IP of the web server to the CN in the certificate, a Domain Name Server (DNS) must be used.  This will allow any client on the LAN to easily connect to your CHT server without needing anything more than the domain name. 

Most LANs will defer to the Internet Service Provider (ISP) to provide DNS, but there is no ISP in an offline scenario.  Instead, one must be provided. This DNS server will then be configured to have an `A` record (or `AAAA` in the case of IPv6) to point to the CHT server.

### Dynamic Host Configuration Protocol 

Any new client that connects to a network will get an IP address from a Dynamic Host Configuration Protocol (DHCP) server.  It is critical that the DHCP server for the LAN the CHT is on instructs all clients to use the DNS server configured above.  

This is the final piece for any client, specifically Android clients, on the LAN to successfully connect to the CHT server and correctly use it's TLS certificate.  

### Wi-Fi AP 

Optionally, a Wi-FI Access Point (AP) may be deployed on the LAN.  This should not be a router, but a simple AP so as  not introduce a DHCP or DNS server that could conflict with the two configured above. An AP will enable a device without Ethernet, such as an Android phone, to easily connect to the CHT server.

### Expertise

Deployments that don't have staff familiar with DNS, TLS Certs, DHCP, LAN topology and Linux in general should likely not use an offline CHT server. This is a complex deployment where mistakes are easy to make unless proper training is in place. 

## Benefits Over Other Solutions

An offline deployment may consider substituting some requirements above with these other solutions.  Note that ngrok and local-ip.co require Internet connectivity, so are not an offline solution.

### ngrok

Aside from the obvious benefit of not requiring Internet connectivity, when an offline solution is deployed, traffic stays 100% local.  When using either [your own reverse proxy]({{< relref "/secure-sharing-of-developer-instance" >}}) or a third party provider like [ngrok](https://ngrok.com/), your traffic may traverse 100s or 1,000s of kilometers to ultimately reach the CHT server which is 10 meters away.

This can help even in locations with Internet, but connectivity which is very slow, very expensive per megabyte, or both.

### local-ip.co 

[local-ip.co](http://local-ip.co/) offers both the TLS certificate and private key for `*.my.local-ip.co`.  Additionally, the service has a DNS server that dynamically maps any IP you pass in the sub-sub-domain to the real world IP such that `192-168-0-1.my.local-ip.co` would resolve to `192.168.0.1`.  This can make it very handy to deploy a development instance where all HTTP traffic remains local (unlike `ngrok` above).  

As the DNS traffic still needs to leave your network and return, it is not a viable solution for a truely offline CHT deployment.

### Self-Signed Certificates

Another option you may consider is to [self-sign the certificates](https://gist.github.com/anand-k-p/851e57c3aa43e1e36df164f1c215609e) and then either bypass the warnings in browsers or install the new CA root certificate on your devices.  While this may work for a development environment with a single developer, it will be hard to scale to an environment where you'd like to easily provision many Android devices.  The work will be much more than just installing an APK form the Play Store (or the slightly harder side load process).

This may only work on certain, older version of Android as well.

### No DHCP or DNS Server

To avoid installing both the DHCP and DNS servers, using an Android app that enables custom DNS entries, like [DNS Changer](https://play.google.com/store/apps/details?id=com.burakgon.dnschanger) or [Daedalus](https://play.google.com/store/apps/details?id=org.itxtech.daedalus) could be used.  As [seen here](https://stackoverflow.com/questions/6370017/mapping-a-hostname-to-an-ip-address-on-android), on each Android device you could install this and add custom DNS entries to reach the TLS certificate on the CHT.  

Like the self-signed certificate solution, this is hard to scale and would need to be complimented by editing `/etc/hosts` files on desktop browsers.
