---
title: "Building CHT Android Flavors"
linkTitle: CHT Android Flavors
weight: 12
description: >
  Building CHT Android Flavors
relatedContent: >
  core/
---

{{% pageinfo %}}
This tutorial will take you through building a CHT Android Application off the existing wrapper.

The cht-android application is a thin wrapper to load the CHT Core Framework web application in a webview.

You will be adding a new android flavor based off the [cht-android](https://github.com/medic/cht-android).

{{% /pageinfo %}}

## Brief Overview of Key Concepts

A native Android container for Community Health Toolkit (CHT), it allows the application to be hardcoded to a specific CHT deployment and have a partner specific logo and display name.

To proceed you need to have ready, the following:

- Title of the application
- Logo 512x512, typically a version of the partner logo e.g. square design icons
- URL is needed in the product flavor

## Required Resources

You should have a functioning [Android SDK](https://developer.android.com/studio/releases/platform-tools) installed. You will also need an image asset studio to create the icon resources required. The [Android image asset studio](https://developer.android.com/studio/write/image-asset-studio) is easily available.

## Implementation Steps

You need to prepare your resources (icons and application ID) then add the new application to the *src* folder and *gradle*.

### 1. Adding the new brand/application

1. Clone the [cht-android](https://github.com/medic/cht-android) repo
2. add `productFlavors { <new_brand> { ... } }` in `build.gradle`
3. add icons, strings etc. in `src/<new_brand>`
4. to enable automated deployments, add the `new_brand` to `.github/workflows/publish.yml`

### 2. Compiling and testing the APK

1. Plug in your phone. Check it's detected with `adb devices`
2. Execute: `make` (will also push app unto phone) using the `SDK command line`
3. To build and deploy APKs for all configured brands, execute: `make branded`
4. To test, execute: `./gradlew connected[Flavor]WebviewDebugAndroidTest` . Eg `./gradlew connectedUnbrandedWebviewDebugAndroidTest` or `./gradlew connectedMedicmobilegammaWebviewDebugAndroidTest`. At the moment we have tests only in these 2 flavors: unbranded and medicmobilegamma.
5. To avoid failures running the tests, previous versions of the app should be uninstalled first, otherwise an `InstallException: INSTALL_FAILED_VERSION_DOWNGRADE` can make the tests to fail, and Android needs to have English as default language.

## APKs

For compatibility with a wide range of devices the build script produces multiple APKs. To help you pick which APK to install you can find information about the version of Android and the CPU in the About section of the phone's settings menu.

The APKs are named as follows: `cht-android-{version}-{brand}-{rendering-engine}-{instruction-set}-release.apk`

| Rendering engine | Instruction set | Android version | Notes |
|------------------|-----------------|-----------------|--|
| `webview`        | `arm64-v8a`     | 10+             |  Preferred. Use this APK if possible. |
| `webview`        | `armeabi-v7a`   | 10+             | Built but not compatible with any devices. Ignore this APK. |
| `xwalk`          | `arm64-v8a`     | 4.4 - 9         |  |
| `xwalk`          | `armeabi-v7a`   | 4.4 - 9         |  |

## Publishing to the Play Store

When publishing to the Google Play Store upload all APKs and it will automatically choose the right one for the target device. However, when sideloading the application it is essential to pick the correct APK or the application may crash.

Publishing is makes your Android application available to users. It involves two main tasks:

1. You prepare the application for release.
2. You release the application to users.

Refer to these [guidelines](https://developer.android.com/studio/publish) to publish your application.

