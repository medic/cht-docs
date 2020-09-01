---
title: "Accessing CHT Apps"
linkTitle: "Access"
weight: 1
description: >
  Starting up your digital health apps
---

Apps built with the Core Framework runs on most modern computers with the newest versions of Google Chrome or Mozilla Firefox.

## Hardware & Software Requirements

Hardware procurement, ownership, and management is the responsibility of each implementing organization. We strongly urge all organizations to procure hardware locally to ensure ease of replacement, repair, sustainability, and hardware support when needed.


## Accessing on Desktop

On desktop devices, there is no need to download anything. Simply go to a web browser and type in your unique URL, for example:

`{{projectname}}.app.medicmobile.org`

## Accessing on Mobile

The app also runs with an app on Android phones and tablets. It works best on devices running version 5.1 or later with at least 8 GB of internal memory (16 GB for supervisors) and minimum 1 GHz RAM.

### Downloading

{{< figure src="download-app-store.png" link="download-app-store.png" class="right col-6 col-lg-3" >}}

To download your app on a mobile device, first navigate to the Google Play Store. From there, click on the search icon in the upper right, and type in the custom name of your health app or project. Make sure the app shown is the correct one and then select it. Then, click on the “Install” button to begin the download. 

### Launching

Once the download is complete, you can access your app via an app icon in your applications menu. Note that the icon, as well as the app name displayed, is customizable by the organization or project.

## Login

{{< figure src="logging-in.png" link="logging-in.png" class="right col-6 col-lg-3" >}}

When accessing your app for the very first time, a login page is displayed. Users enter a username and password that grant access to their customized app experience.

On mobile devices, the app generally stays logged in after initial setup so that CHW users don’t have to type in their credentials each day. 

On desktop devices, the user must login again if they close the app tab or browser window.

Users may log out by going to the options menu available in the top right corner of the app.

{{< see-also page="apps/concepts/navigation" >}}

## Remote Login

When creating users, the admin has the option to send a user their credentials via SMS using a link. Clicking the link generates a new, random and complex password with a 24-hour expiry. If no gateway is set up, the message may be sent via another messaging app. 

![admin-magic-link](admin-magic-link.png)

By clicking the magic link to log in, the user is able to enter their project's instance directly, bypassing the need to enter their username and password. If the app is not installed on their phone, it will open in their default browser.

![magic-link](magic-link.png)

To recover a password, the user needs to contact the admin so that they may regenerate a new magic link and repeat the workflow. 

{{% alert title="Note" %}}
The magic link workflow will not work for users who want to use multiple devices or for multiple users on one device.
{{% /alert %}}

{{< see-also page="apps/examples/training/" >}}

