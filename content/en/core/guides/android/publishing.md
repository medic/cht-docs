---
title: "Publishing"
linkTitle: "Publishing"
weight: 4
description: >
  Instructions for Publishing Android Apps
relatedContent: >
  core/guides/android/releasing
  core/guides/android/branding
---

Once [released]({{< ref "core/guides/android/releasing" >}}) the app, there are many different ways to publish the binaries for installation.

### Google Play Store

The Play Store has the advantage of being installed on all Android phones by default. This makes it very easy for users to install your app, which makes it the approach we recommend for most applications.

One of the downsides is it can be more difficult to get your app published and it may be removed in future if it's found to not comply with future requirements.

Follow these instructions to [publish your app](https://support.google.com/googleplay/android-developer/answer/9859751?hl=en).  In the [Google Play Console](https://play.google.com/console), for each flavor to publish, create a new `Production` release:

  - Upload app bundles (from the GitHub Release) for the flavor
  - Use the new cht-android version as the Release name
  - Add a one sentence summary of the CHANGELOG entry as the Release notes.

{{% alert title="Note" %}}
Published apps are not immediately available to users on the Play Store. Confirm, via the Google Play Console, that the release is available before officially announcing it (this could take hours or days).
{{% /alert %}}

#### New App in the Play Store

Remember that when the app is created in the Play Store, it's required to choose the way the app will be signed by Google: we upload the signed AAB files, but then Google creates optimized versions of the app in .apk format. The app has to be configured to use the same signing and upload signatures by Google. Choose to upload a "Java keystore", the Play Console will require a file encrypted with a tool named PEPK, that file is `<brand>_private_key.pepk` generated when following the instructions of [New brand]({{< ref "core/guides/android/branding" >}}) (the button to upload the `.pepk` in the Play Console may say "Upload generated ZIP" although the PEPK file doesn't look like a .zip file).

{{% alert title="Note" %}}
New apps cannot longer be uploaded with the APK format in the Play Store. Apps created before Aug 1, 2021 can still be updated with `.apk` files, but new ones needs to be uploaded with the Android App Bundle format (`.aab`). Checkout the [Artifact formats]({{< ref "core/guides/android/development-setup#artifact-formats" >}}) section.
{{% /alert %}}

### Side loading

This method gives an app developer full control over installation. It is also possible to do the installation without an internet connection which makes it ideal for remote installation, or to save bandwidth when performing multiple installs.

1. In the phone settings [select the option](https://www.tech-recipes.com/rx/22616/android-allow-installation-of-non-market-apps/) to "Allow installation of non-Market applications"
2. Download the correct APK on to the phone. It's important to select the right APK for the instruction set and Android version, as documented [in this table]({{< ref "core/guides/android/development-setup#apks" >}}).  This is likely easiest done by using the phone's browser to navigate to the download page.
3. After downloading, you should be prompted to install the APK.

### F-Droid

F-Droid is a free open source application store which gives the app developer more control over the listing. As it isn't installed on Android devices by default it takes a little more effort to set up originally, but is easier than manually sideloading.

We are still investigating the viability of this distribution method, but in the meantime you can learn more on their [website](https://f-droid.org).

### Mobile Device Management

This gives the IT administrator full control over which applications are installed on the devices in the program. MDM is recommended when you want complete control over the software and configuration.

There are several providers to choose from with a range of features and prices so it is recommend to do your own research and pick the one that's right for you.
