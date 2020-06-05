---
title: "Configuration"
linkTitle: "Configuration"
weight: 10
description: >
  Configuring medic-gateway
relatedContent: >
  apps/guides/gateway/troubleshooting
  apps/guides/gateway/phones
---

Medic gateway supports Android 4.1 and above. To have it up and fully working, follow the below steps.

- Install the app from the playstore from this [link](https://play.google.com/store/apps/details?id=medic.gateway.alert&hl=en) or by searching "Medic Gateway" on the Android Playstore.

- Open the app.
You will get a ```Warning:medic-gateway is not set as the default messaging app on this device``` if you are installing the app for the first time or afresh. Select ```HELP ME CHANGE``` and agree to the folloup system prompt about changing the default messaging app.

- If you're configuring medic-gateway(v1.00 and above) for use with hosted medic, with a URL of e.g. ```https://myproject.dev.medicmobile.org``` and a username of ```my_gateway_user``` and a password of ```topSecret```, fill in the settings as follows:


Instance name: `myproject [dev]`   (if ```https://myproject.app...```, select 'app')<br>
Username: `my_gateway_user`<br>
Password: `topSecret`


![configuration](gateway-config.png)

{{% alert title="Note" %}}
If you're configuring medic-gateway(v 0.62 and below - recommended if you have a non-medicmobile hosted instance) you will need to use the generic build of medic-gateway - links to download are [here](https://github.com/medic/medic-gateway/releases). Find out the value for webapp URL from your tech support then configure as below
 **WebappUrl**: ```https://my_gateway_user:topSecret@myproject.some-subdomain.mydomain.org```
{{% /alert %}}



 # Power Saving

 Care should be taken to disable all power-saving modes on the phone, as these may affect `medic-gateway`'s ability to check in with the server regularly.
 
 On different versions of Android, power saving options may be found in different places.  Sometimes they will be per-app, and sometimes phone-wide.  Some places you might find the settings:

* `WiFi > MORE > Keep WiFi on during sleep > ALWAYS (increases battery usage)`
* `Smart Manager > Battery > App Power Saving > OFF`, or
* `Smart Manager > Battery > App Power Saving > Detail > Medic Gateway > Disable`