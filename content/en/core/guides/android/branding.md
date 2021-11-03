---
title: "Building CHT Android Flavors"
linkTitle: CHT Android Flavors
weight: 13
description: >
  Branding the CHT Android with "Flavors" Apps
---

{{% pageinfo %}}
This tutorial will take you through building a CHT Android Application off the existing wrapper.

The cht-android application is a thin wrapper to load the CHT Core Framework web application in a webview.

You will be adding a new android flavor based off the [CHT Android](https://github.com/medic/cht-android).
{{% /pageinfo %}}

## Brief Overview of Key Concepts

The CHT Android is a native Android container for the Community Health Toolkit (CHT). The repo contains a "flavored" configuration, where each "flavor" or "brand" is an app. All apps have the same code and features, but can be customized, hard-coding a specific CHT deployment and have a partner specific logo and display name.

## Add a new Brand

Adding a new _"brand"_ or _"flavor"_ requires to follow these steps:

1. Check you meet the [Required Resources](#1-required-resources).

2. Add the new brand in the source code.

3. Generate a new keystore if there is no one.

4. Test locally and create a pull request with the changes

5. [Release]({{< ref "core/guides/android/releasing#new-flavor-release" >}}) the new flavor.

6. [Publish]({{< ref "core/guides/android/publishing" >}}) in the Play Store or whatever channel.


### 1. Required Resources

To proceed you need to have ready the following:

- The URL of your CHT server so users don't have to type it in post install.
- The app logo and title.
- Translations for your supported languages (most flavors don't need to customize translations though).

Also be sure to have a working **[Development Environment]({{< ref "core/guides/android/devel-setup" >}})**.

#### Play Store assets

If you are going to publish the app in the **Play Store**, Google will require to provide the following to list the app:

- A description of the app.
- A shorter description (80 characters).
- Logo 512x512px, typically a version of the partner logo e.g. square design icons.
- A background image.
- Screenshots.

Google is constantly changing the requirments to publish in the Play Store, it's a good practice to check in advance whether all the requirements are met (checkout _[Add preview assets...](https://support.google.com/googleplay/android-developer/answer/9866151)_).

##### Test data

When publishing for the first time in the Play Store, a reviewer from Google will try to check whether the permission requested by the app follows the Play Store rules. The CHT Android app has enabled by default location request permissions, and the workflow to request the permission follows the strict rules imposed by Google, but they won't be aware that your _flavored_ app is based on the CHT Android, so you have to provide Google with instructions of how to test the app, specifically how to test the location request.

To do so, give them instructions of how to login with the app (with a real username and password), and the basic steps to reach the location request, like open up a form.

Once approved you can delete the "test" user, Google conduct the tests only the first time, or when a new permission request is added to the app.




### TODO


{{% alert title="Note" %}} Since files generated here are signed with the same key you generated, the files and key can be uploaded to the Play Store later and any file generated locally following the steps above will be compatible with any installation made from the Play Store. {{% /alert %}}