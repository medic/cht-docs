---
title: "Building CHT Android Flavors"
linkTitle: CHT Android Flavors
weight: 13
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

- Clone the [cht-android](https://github.com/medic/cht-android) repo
- add `productFlavors { <new_brand> { ... } }` in `build.gradle`
- add icons, strings etc. in `src/<new_brand>`
- to enable automated deployments, add the `new_brand` to `.github/workflows/publish.yml`

### 2. Compiling and testing the APK

- Plug in your phone. Ensure that it is detected within `adb devices`
- Execute: `make` using the SDK command line. (This will also push the app onto your phone.)
- Execute: `make branded` to build and deploy APKs for all configured brands.
- Execute: `./gradlew connected[Flavor]WebviewDebugAndroidTest` to run tests. For example, `./gradlew connectedUnbrandedWebviewDebugAndroidTest` or `./gradlew connectedMedicmobilegammaWebviewDebugAndroidTest`. At the moment we have tests only in these 2 flavors: unbranded and medicmobilegamma.
- Uninstall previous versions of the app, otherwise an `InstallException: INSTALL_FAILED_VERSION_DOWNGRADE` can cause tests to fail. Android needs to have English as the default language.

![medic-android set up on Android Studio](android-wrapper.png "Medic Android set up on Android Studio")
