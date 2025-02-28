---
title: "Installation as a Progressive Web App"
linkTitle: "Progressive Web App"
weight: 2
description: >
  What it means that the CHT Core web application is a Progressive Web App
---

## What is a Progressive Web App (PWA)?

A PWA is a web application that can be used like a website in the browser, but the user can choose to "install" it. This means a shortcut is added to the home screen of the device, and when the application is run it doesn't have the usual browser address bar and tabs so it looks like a regular application.

The CHT Core webapp has been developed to be a PWA to give users more choice about how applications are installed.

## Benefits of PWA installation

Using a PWA avoids the need to build an Android application and publish it to the Play Store which can be cumbersome and slow. This also means there's no need for the user to install or update the Android application as any updates will be downloaded automatically from the CHT server.

In addition you can install PWAs on a wider range of devices, for example, desktop computers.

Deployments can use a mixture of PWA and Android applications.

## Benefits of Android applications

Installation of the PWA may be more difficult for users, for example they will need to visit the website and then follow the instructions to install it. This process is less well known than a usual Play Store installation.

Certain features are only available with an Android application, including integration with other android apps, and sending SMS from within the app.

## How to distribute a CHT app as a PWA

1. Ensure branding configuration is complete. Without this the browser won't recognize the CHT as a PWA and installation will not be possible. Specifically the app will need a `title` and `icon` as these are used for the icon on the home screen. To set this up, follow the instructions on the [branding page]({{< relref "building/branding/application-graphics#1-site-branding" >}}).
2. In Chrome or Firefox go to the application URL, log in, and wait for the webapp to finish loading completely.
3. Follow these [instructions for PWA installation](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Add_to_home_screen).

Now the application can be used offline just like a regular Android application.
