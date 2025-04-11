---
title: "Configuration"
linkTitle: "Configuration"
weight: 10
description: >
  Configuring cht-gateway
aliases:
  -    /apps/guides/messaging/gateways/gateway/configuration
relatedContent: >
  building/messaging/gateways/gateway/troubleshooting
  building/messaging/gateways/gateway/phones
---

CHT gateway supports Android 4.1 and above. To have it up and fully working, follow the 3 steps below.

1. Install the latest APK from the [releases page](https://github.com/medic/cht-gateway/releases) in the `cht-gateway` repo. This APK is not in the Play Store, you will need to side-load it [as is done with CHT Android]({{< ref "building/guides/android/publishing#side-loading" >}}).

2. Open the app.
if you are installing the app for the first time or afresh, you will get a ```Warning:medic-gateway is not set as the default messaging app on this device``` . Select ```HELP ME CHANGE``` and agree to the follow-up system prompt about changing the default messaging app.

3. Configure the app. If you're configuring cht-gateway(v1.0.0 and above) for use with hosted medic, with a URL of e.g. ```https://myproject.dev.medicmobile.org``` and a username of ```gateway``` and a password of ```topSecret```, fill in the settings as follows:


Instance name: `myproject [dev]`   (if ```https://myproject.app...```, select 'app')<br>
Username: `gateway`(_Since_ [v1.2.1](https://github.com/medic/cht-gateway/releases/tag/v1.2.1) _medic gateway versions this field is not present in the app. The user `gateway` is assumed_.)<br>
Password: `topSecret`(_This should be the password for the `gateway` username as set up in the project web instance_)


![configuration](gateway-config.png)

> [!NOTE]
> If you're configuring cht-gateway (v0.6.2 and below - recommended if you have a non-_Medic_ hosted instance) you will need to use the generic build of cht-gateway - links to download are [here](https://github.com/medic/cht-gateway/releases). Find out the value for webapp URL from your tech support then configure as below
> **WebappUrl**: ```https://gateway:topSecret@myproject.some-subdomain.mydomain.org```

 # Power Saving

 Care should be taken to disable all power-saving modes on the phone, as these may affect `cht-gateway`'s ability to check in with the server regularly.
 
 On different versions of Android, power saving options may be found in different places.  Sometimes they will be per-app, and sometimes phone-wide.  
 
 Some places you might find the power savings settings:

* `WiFi > MORE > Keep WiFi on during sleep > ALWAYS (increases battery usage)`
* `Smart Manager > Battery > App Power Saving > OFF`, or
* `Smart Manager > Battery > App Power Saving > Detail > CHT Gateway > Disable`
