---
title: "Android App Publishing"
linkTitle: "Android App Publishing"
weight: 
description: >
  How to building and publishing Android applications
---

## Building

### Branding

You can overwrite aspects of the generic Android app by providing your own brand. Common elements to overwrite are:

- The URL of your CHT server so users don't have to type it in post install
- The app logo and title
- Translations for your supported languages

Follow these [instructions to create a new brand](https://github.com/medic/medic-android/#adding-new-brands).

### Building APKs

Use Fastlane to build and sign your APKs ready for publishing. Building can be done using CI (eg: GitHub Actions, travis ci). For reference, refer to [how Medic builds APKs using GitHub Actions](https://github.com/medic/medic-android/blob/master/.github/workflows/publish.yml).

It's important to ensure you sign your APKs using the same certificate to ensure that upgrading to a new version goes smoothly. This certificate must be encrypted and backed up so it's not lost or exposed publically. For example, Medic has encrypted a certificate and stored it in the [medic-android](https://github.com/medic/medic-android/blob/master/secrets.tar.gz.enc) git repo, which is then decrypted for use during [CI build](https://github.com/medic/medic-android/blob/master/.github/workflows/publish.yml).

## Publishing

There are many different ways to publish APKs for installation.

### Google Play Store

The Play Store has the advantage of being installed on all Android phones by default. This makes it very easy for users to install your app, which makes it the approach we recommend for most applications.

One of the downsides is it can be more difficult to get your app published and it may be removed in future if it's found to not comply with future requirements.

Follow these instructions to [publish your app](https://support.google.com/googleplay/android-developer/answer/9859751?hl=en).

### Side loading

This method gives an app developer full control over installation. It is also possible to do the installation without an internet connection which makes it ideal for remote installation, or to save bandwidth when performing multiple installs.

1. In the phone settings select the option to "Allow installation of non-Market applications"
2. Download the correct APK on to the phone. It's important to select the right APK for the instruction set and Android version, as documented [in this table](https://github.com/medic/medic-android#apks).
3. Select to install the APK.

### F-Droid

F-Droid is a free open source application store which gives the app developer more control over the listing. As it isn't installed on Android devices by default it takes a little more effort to set up originally, but is easier than manually sideloading.

We are still investigating the viability of this distribution method, but in the meantime you can [learn more on their website](https://f-droid.org/en/).

### Mobile Device Management

This gives the IT administrator full control over which applications are installed on the devices in the program. MDM is recommended when you want complete control over the software and configuration.

There are several providers to choose from with a range of features and prices so it is recommend to do your own research and pick the one that's right for you.
