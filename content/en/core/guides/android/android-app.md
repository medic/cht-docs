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

Follow the instructions on [Building CHT Android Flavors]({{< ref "core/guides/android/branding" >}}) to create a new brand.

### Building APKs

Use Fastlane to build and sign your APKs ready for publishing. Building can be done using CI (eg: GitHub Actions, travis ci). For reference, refer to [how Medic builds APKs using GitHub Actions](https://github.com/medic/medic-android/blob/master/.github/workflows/publish.yml).

It's important to ensure you sign your APKs using the same certificate to ensure that upgrading to a new version goes smoothly. This certificate must be encrypted and backed up so it's not lost or exposed publically. For example, Medic has encrypted a certificate and stored it in the [medic-android](https://github.com/medic/medic-android/blob/master/secrets.tar.gz.enc) git repo, which is then decrypted for use during [CI build](https://github.com/medic/medic-android/blob/master/.github/workflows/publish.yml).
