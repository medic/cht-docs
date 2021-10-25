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

You will be adding a new android flavor based off the [cht-android](https://github.com/medic/cht-android).

{{% /pageinfo %}}

## Brief Overview of Key Concepts

A native Android container for Community Health Toolkit (CHT), it allows the application to be hardcoded to a specific CHT deployment and have a partner specific logo and display name.

To proceed you need to have ready, the following:

- Title of the application
- Logo 512x512, typically a version of the partner logo e.g. square design icons
- URL of the CHT instance is needed in the product flavor

## Required Resources

You should have a functioning [Android SDK](https://developer.android.com/studio/releases/platform-tools) installed. You will also need an image asset studio to create the icon resources required. The [Android image asset studio](https://developer.android.com/studio/write/image-asset-studio) is easily available.

Additionally, the following command tools are required:
- Java 11+
- keytool
- apksigner
- openssl
- base16

## Implementation Steps

You need to prepare your resources (icons and application ID) then add the new application to the *src* folder and *gradle*.

### 1. Adding the new brand/application

- Clone the [cht-android](https://github.com/medic/cht-android) repo
- Add `productFlavors { <new_brand> { ... } }` in `build.gradle`
- Add icons, strings etc. in `src/<new_brand>`. The `src/new_brand/res/values/strings.xml` file is mandatory
- To enable automated deployments, add the `new_brand` to `.github/workflows/publish.yml`

### 2. Building the APK and AAB files

- Execute: `make org=new_brand keygen` to generate the `keystore`
- Execute: `make org=new_brand keyrm-all` to clean all the files generated to repeat `keystore` generation (optional) 
- Execute: `make org=new_brand keydec` to decrypt contents of the `keystore` (optional) 
- Execute: `make org=new_brand keyprint` to see the certificate content, like the org name, the certificate fingerprints, etc.
- Execute: `make org=new_brand flavor=New_brandWebview assemble` to build the Webview versions of the `.apk` files
- Execute: `make keyprint-apk` to verify the files were signed with the right signature
- Execute: `make org=new_brand flavor=New_brandWebview bundle` to build the `.aab` files
- Execute: `make keyprint-aab` to verify the files were signed with the right signature

{{% alert title="Note" %}} Since files generated here are signed with the same key you generated, the files and key can be uploaded to the Play Store later and any file generated locally following the steps above will be compatible with any installation made from the Play Store. {{% /alert %}}

### 3. Testing

- Plug in your phone. Ensure that it is detected within `adb devices`
- Execute: `make` using the SDK command line. (This will also push the app onto your phone.)
- Execute: `make test` to run unit tests (static checks are also executed).
- Uninstall previous versions of the app, otherwise an `InstallException: INSTALL_FAILED_VERSION_DOWNGRADE` can cause tests to fail. Android needs to have English as the default language.
- Execute: `make test-ui` or `make test-ui-gamma`

### 4. [Releasing]({{< ref "core/guides/android/releasing" >}})

### 5. [Publishing]({{< ref "core/guides/android/publishing" >}})
