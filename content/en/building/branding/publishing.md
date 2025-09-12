---
title: "Publishing"
linkTitle: "Publishing"
weight: 2
description: >
  Instructions for releasing Android Apps
relatedContent: >
  building/branding/publishing
  building/branding/android
aliases: >
  /apps/guides/hosting/android-app/
  /core/guides/android/publishing
  /core/guides/android/
  /apps/guides/android/publishing/
  /building/guides/android/publishing/
  /building/guides/android/
---

## Publishing

Once the flavor is [bui````lt]({{< ref "building/branding/android" >}}) there are many different ways to publish the binaries for installation.

### Google Play Store

The Play Store has the advantage of being installed on all Android phones by default. This makes it very easy for users to install your app, which makes it the approach we recommend for most applications.

One of the downsides is it can be more difficult to get your app published and it may be removed in future if it's found to not comply with future requirements.

For this method you will need access to the organization's play store console with permission to publish the app.

In the [Google Play Console](https://play.google.com/console), for each flavor to publish:
- Create a new `Production` release
- Upload the `arm64` app bundles (from the GitHub Release) for the flavor. If you plan on uploading multiple APKs, the APKs should have different version codes. Read more: [here](https://developer.android.com/google/play/publishing/multiple-apks#Rules).
- Use the new cht-android version as the Release name
- Add a one sentence summary of the CHANGELOG entry as the Release notes.

For a more detailed explanation, follow this [doc](https://support.google.com/googleplay/android-developer/answer/9859751?hl=en).

> [!NOTE]
> Published apps are not immediately available to users on the Play Store. Confirm, via the Google Play Console, that the release is available before officially announcing it (this could take hours or days).

#### New App in the Play Store

Remember that when the app is created in the Play Store, it's required to choose the way the app will be signed by Google: we upload the signed AAB files, but then Google creates optimized versions of the app in .apk format. The app has to be configured to use the same signing and upload signatures by Google. Choose to upload a "Java keystore", the Play Console will require a file encrypted with a tool named PEPK, that file is `<brand>_private_key.pepk` generated when following the instructions of [New brand]({{< ref "building/branding/android" >}}) (the button to upload the `.pepk` in the Play Console may say "Upload generated ZIP" although the PEPK file doesn't look like a .zip file).

> [!NOTE]
> New apps cannot longer be uploaded with the APK format in the Play Store. Apps created before Aug 1, 2021 can still be updated with `.apk` files, but new ones needs to be uploaded with the Android App Bundle format (`.aab`). Checkout the [Artifact formats]({{< ref "community/contributing/code/android/development-setup#artifact-formats" >}}) section.

### Side loading

This method gives an app developer full control over installation. It is also possible to do the installation without an internet connection which makes it ideal for remote installation, or to save bandwidth when performing multiple installs.

1. In the phone settings [select the option](https://developer.android.com/distribute/marketing-tools/alternative-distribution#unknown-sources) to "opt in for installing unknown apps".
2. Download the correct APK on to the phone. It's important to select the right APK for the instruction set and Android version, as documented [in this table]({{< ref "community/contributing/code/android/development-setup#apks" >}}).  This is likely easiest done by using the phone's browser to navigate to the download page.
3. After downloading, you should be prompted to install the APK.

### F-Droid

F-Droid is a free open source application store which gives the app developer more control over the listing. As it isn't installed on Android devices by default it takes a little more effort to set up originally, but is easier than manually sideloading.

Read more about [Using F-Droid for app distribution](https://medic.org/stories/using-f-droid-for-app-distribution-a-product-experiment/).

### Mobile Device Management

Using mobile device management (MDM) software allows administrators to remotely manage mobile devices. This gives the IT administrator full control over which applications are installed on the devices, as well as having the option to delete apps and data from lost or stolen mobile devices. For this reason, using MDM software is highly recommended for deployments.

There are many commercially available MDM tools to evaluate, with a wide range of features and prices. [Google Endpoint](https://workspace.google.com/intl/en_us/products/admin/endpoint/) is available for organizations using Google Workspace (formerly G Suite), and has free plans for non-profit organizations. Check out the [Endpoint documentation overview](https://support.google.com/a/answer/1734200) for more information, including [how to enable mobile device management](https://support.google.com/a/answer/7400753), and [how to remotely wipe a device](https://support.google.com/a/answer/173390).

Other MDM providers include [Headwind MDM](https://h-mdm.com/) and [Microsoft Intune](https://docs.microsoft.com/en-us/mem/intune/). It is recommended that you research MDM options and pick the one that's right for you.

### Progressive Web App

Another alternative is to install the CHT Core webapp as a Progressive Web App. This avoids building an Android application altogether. Read more on the [PWA page]({{< relref "technical-overview/concepts/pwa" >}}).
