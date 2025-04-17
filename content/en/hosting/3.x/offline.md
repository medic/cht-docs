---
title: "Offline Hosting of CHT 3.x Server"
linkTitle: "Offline Hosting"
weight: 100
aliases:
  - /apps/guides/hosting/3.x/offline
  - /apps/guides/hosting/offline

description: >
 Deploying and hosting CHT Core server instances without Internet connectivity
---

> [!CAUTION]
> This guide is not meant for a production CHT instance.  Support may be added in the future an offline CHT server in a production environment.  Please see the "Considerations" section below.
> Proceed only if you have staff familiar with DNS, TLS Certs, DHCP, LAN topology and Linux in general. This is a complex deployment where mistakes are easy to make unless proper training is in place. 

{{< callout >}}
  This guide only applies to CHT 3.x.
{{< /callout >}}

## Introduction

The CHT is built as an [Offline-First]({{< ref "core/overview/offline-first" >}}) application. This applies to clients, either  browsers or Android applications, connecting to the CHT server.  The server itself assumes it has Internet connectivity to provide services such as DNS, software updates and general use connectivity.  This document explores what it looks like when the CHT server is offline without these services available.

Running a CHT server offline requires no modifications to the CHT itself.  Instead, supporting services normally found online are replicated locally.

## Considerations

An offline CHT server is most appropriate for a development environment.  There are serious implications to consider before deploying an offline instance per our [existing requirements]({{< relref "requirements#considerations" >}}).

Additionally, if users are going to migrate between offline locations with the same domain name, always ensure different login and passwords are used for all users across instances. This will prevent a client from another CHT instance trying to synchronize with a CHT instance it shouldn't synchronize with, possibly causing data corruption or privacy issues through unintended data access.


## Requirements

 A CHT instance is accessible offline when you can resolve the domain to an IP address, and a TLS certificate is on the CHT server with a common name (CN) that matches the domain name. On top of the [existing requirements]({{< relref "requirements" >}}), the following aspects must also be considered.

### Static IP

The CHT server needs to be given a static IP so that DNS will always resolve to the correct host.

### TLS Certificate

Browsers might allow you to connect to a server with an invalid TLS certificate after you [bypass the warning](https://www.ssl.com/guide/troubleshooting-ssl-tls-browser-errors-and-warnings/). Android apps however, like [CHT Android App](https://github.com/medic/cht-android), require a valid TLS certificate to work correctly, therefore you would need to acquire a valid TLS certificate from a certificate authority (CA) and install it on your CHT server.

It is common to use [Let's Encrypt](https://en.wikipedia.org/wiki/Let%27s_encrypt) to acquire certificates because they provide free certificates. Let's Encrypt certificates expire after 90 days, so the server will need to be constantly updated with a new certificate.  Other CAs provide certificates that expire after a year, so this concern will always apply.

After acquiring the certificate, if you are running a Docker-based CHT deployment, see [TLS instructions for Docker]({{< relref "/hosting/3.x/ssl-cert-install" >}}) to install the certificate.

### Domain Name Server

In order to match the static IP of the web server to the CN in the certificate, a Domain Name Server (DNS) must be used.  This will allow any client on the LAN to easily connect to your CHT server without needing anything more than the domain name.

Most LANs will defer to the Internet Service Provider (ISP) to provide DNS, but there is no ISP in an offline scenario.  Instead, one must be provided. This DNS server will then be configured to have an `A` record (or `AAAA` in the case of IPv6) to point to the CHT server.

### Dynamic Host Configuration Protocol

Any new client that connects to a network will get an IP address from a Dynamic Host Configuration Protocol (DHCP) server.  It is critical that the DHCP server for the LAN the CHT is on instructs all clients to use the DNS server configured above.


### Wi-Fi AP

A Wi-FI Access Point (AP) needs to be deployed on the LAN so Android devices can connect to the CHT.  This can be an AP included with the router or a standalone AP. If the AP is standalone, check that any DHCP or DNS servers that could conflict with the one above are disabled.

## Benefits Over Other Solutions

An offline deployment may consider substituting some requirements above with these other solutions.  Note that ngrok and local-ip.co require Internet connectivity, so are not an offline solution.

### ngrok

When an offline solution is deployed, traffic stays 100% local, whereas when using either [your own reverse proxy]({{< relref "building/guides/debugging/secure-sharing-of-developer-instance" >}}) or a third party provider like [ngrok](https://ngrok.com/), traffic may traverse 100s or 1,000s of kilometers to ultimately reach the CHT server which is 10 meters away. This can help when Internet connectivity is very slow, very expensive per megabyte, or both.

### local-ip.co 

[local-ip.co](http://local-ip.co/), and [related services](https://local-ip.medicmobile.org/), offer both the TLS certificates and private keys for `*.my.local-ip.co`.  Additionally, the service has a DNS server that dynamically maps any IP you pass in the sub-sub-domain to the real world IP such that `192-168-0-1.my.local-ip.co` would resolve to `192.168.0.1`.  This can make it very handy to deploy a development instance where all HTTP traffic remains local (unlike `ngrok` above).

As the DNS traffic still needs to leave your network and return, it is not a viable solution for a truly offline CHT deployment.

### Self-Signed Certificates

Another option to consider is to [self-sign the certificates](https://gist.github.com/fntlnz/cf14feb5a46b2eda428e000157447309) and then either bypass the warnings in browsers or install the new CA root certificate on your devices.  While this may work for a development environment with a single developer, it will be hard to scale to an environment where you'd like to easily provision many Android devices.  The work will be much more than just installing an APK form the Play Store (or the slightly harder side load process).

This may only work on certain, older version of Android as well.

### No DHCP or DNS Server

To avoid installing both the DHCP and DNS servers, an Android app that enables custom DNS entries, like [DNS Changer](https://play.google.com/store/apps/details?id=com.burakgon.dnschanger) could be used.  As [seen here](https://stackoverflow.com/questions/6370017/mapping-a-hostname-to-an-ip-address-on-android), on each Android device you could install this and add custom DNS entries to reach the TLS certificate on the CHT.

Like the self-signed certificate solution, this is hard to scale and would need to be complimented by editing `/etc/hosts` files on desktop browsers.
