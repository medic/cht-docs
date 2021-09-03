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

Additionally, the following command tools are required:
- Java 11
- keytool
- apksigner
- openssl
- base16

## Implementation Steps

You need to prepare your resources (icons and application ID) then add the new application to the *src* folder and *gradle*.

### 1. Adding the new brand/application

- Clone the [cht-android](https://github.com/medic/cht-android) repo
- add `productFlavors { <new_brand> { ... } }` in `build.gradle` e.g.
```
  new_brand {
    dimension = 'brand'
    applicationId = 'org.medicmobile.webapp.mobile.new_brand'
  }
```
- add icons, strings etc. in `src/<new_brand>`. The `src/new_brand/res/values/strings.xml` file is mandatory, e.g.
```
  <?xml version="1.0" encoding="utf-8"?>
  <resources>
    <string name="app_name">New Brand</string>
    <string name="app_host">new_brand.app.medicmobile.org</string>
  </resources>
```
- to enable automated deployments, add the `new_brand` to `.github/workflows/publish.yml`
```
  - name: Unpack secrets new_brand
    env:
      ANDROID_SECRETS_KEY: ${{ secrets.ANDROID_SECRETS_KEY_NEW_BRAND }}
      ANDROID_SECRETS_IV: ${{ secrets.ANDROID_SECRETS_IV_NEW_BRAND }}
    run: make org=new_brand keydec

  - name: Assemble new_brand
    uses: maierj/fastlane-action@v1.4.0
    with:
      lane: build
      options: '{ "flavor": "new_brand" }'
    env:
      ANDROID_KEYSTORE_PATH: new_brand.keystore
      ANDROID_KEYSTORE_PASSWORD: ${{ secrets.ANDROID_KEYSTORE_PASSWORD_NEW_BRAND }}
      ANDROID_KEY_PASSWORD: ${{ secrets.ANDROID_KEY_PASSWORD_NEW_BRAND }}

  - name: Bundle new_brand
    uses: maierj/fastlane-action@v1.4.0
    with:
      lane: bundle
      options: '{ "flavor": "new_brand" }'
    env:
      ANDROID_KEYSTORE_PATH: new_brand.keystore
      ANDROID_KEYSTORE_PASSWORD: ${{ secrets.ANDROID_KEYSTORE_PASSWORD_NEW_BRAND }}
      ANDROID_KEY_PASSWORD: ${{ secrets.ANDROID_KEY_PASSWORD_NEW_BRAND }}
```

### 2. Building the APK and AAB files

- Execute: `make org=new_brand keygen` to generate the `keystore`
- Export the six `secrets` generated to your local environment
```
  export ANDROID_KEYSTORE_PASSWORD_NEW_BRAND=dd8668...
  export ANDROID_KEY_PASSWORD_NEW_BRAND=dd8668...
  export ANDROID_SECRETS_IV_NEW_BRAND=88d9c2dea7a9...
  export ANDROID_SECRETS_KEY_NEW_BRAND=2824d02d2bc221f5844b8fe1d928211dcbbc...
  export ANDROID_KEYSTORE_PATH_NEW_BRAND=new_brand.keystore
  export ANDROID_KEY_ALIAS_NEW_BRAND=medicmobile
```
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
- Execute: `make test` to run unit tests(static checks ara also executed).
- Uninstall previous versions of the app, otherwise an `InstallException: INSTALL_FAILED_VERSION_DOWNGRADE` can cause tests to fail. Android needs to have English as the default language.
- Execute: `make test-ui` or `make test-ui-gamma`

### 4. Releasing

#### Alpha for release testing

- Ensure tests have passed and merge to `master`
- Create a git tag starting with `v` and ending with the alpha version, e.g. `v1.2.3-alpha.1` and push the tag to GitHub.
- The release-ready `APKs` are available for side-loading from GitHub Releases, along with the `AABs` required by Google Play Store.


#### Releasing in the Play Store

- [Upload your App to the Play Console](https://developer.android.com/studio/publish/upload-bundle)

{{% alert title="Note" %}} Ensure you upload the `.pepk` file so that the optimized `.apk` generated can be configured to use the same signing and upload signatures by Google. {{% /alert %}}

### 5. Updating the Play Store App

{{% alert title="Note" %}} It is mandatory that you update files using the same extension, i.e. ff the app was released as an APK instead of AAB, you must upload it as an APK file. {{% /alert %}}

- Rebuild the signed updated AAB or APK file to a new version
- Follow the steps in `4.` above


![medic-android set up on Android Studio](android-wrapper.png "Medic Android set up on Android Studio")
