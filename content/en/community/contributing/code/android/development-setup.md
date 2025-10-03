---
title: "Android Dev Environment"
linkTitle: "Android Dev Environment"
weight: 1
description: >
  Instructions for setting up the development environment
relatedContent: >
  community/contributing/code/android/releasing
aliases: >
  /core/guides/android/development-setup
  /contribute/code/android/development-setup
---
 
The following instructions allows you to setup a development environment for the **[CHT Android](https://github.com/medic/cht-android)** apps, and the **[CHT Gateway](https://github.com/medic/cht-gateway)** app as well.

Finally, you will learn how to assemble the app, run the tests, and how to choose the right artifacts when installing or publishing the apps.

## Requirements

- Java 17+ (OpenJDK versions work).
- Android SDK, and optionally Android Studio.
- The `adb` command for debugging and get the logs.
- The source code. To run all the tests in the CHT Android app you need to clone also the submodules: `git clone --recurse-submodules https://github.com/medic/cht-android.git`.
- The `make` command.
- If you are going to build a new flavor (CHT Android), you also need to have installed: `head`, `xxd`, `openssl` and `apksigner`.

**Gradle** is also used but it's downloaded and installed in the user space the first time `make` is executed. You can also build and launch the app with [Android Studio](#android-studio).

Below are the instructions of how to install and setup some of the tools required.


## Install


### Java

Java 17+ needs to be installed. The `bin/` folder of the JDK must added into the `$PATH` environment variable, and it's recommended to have `$JAVA_HOME` pointing to the JDK folder as well.

To install different versions of Java and without the need to have root permissions, checkout [Sdkman!](https://sdkman.io/), if you are familiar with tools like `nvm` or `rvm`, this tool is pretty much the same for Java, and the command takes care of adding the selected JDK to the `$PATH` variable and to set the `$JAVA_HOME` variable when switching across different versions.


### Android Studio and the SDK

Android Studio is the full package: the IDE based on IntelliJ IDEA, the Android SDK and the SDK Manager with the UI to manage different packages visually, while the SDK alone only includes the command line tools like the `sdkmanager` CLI.

You don't need the IDE to build the app or to install a "debug" version in a device, or get the logs, but it's recommended if you also want to debug the app or modify the code.

- Android Studio: download from https://developer.android.com/studio
- Command line tools only: download from https://developer.android.com/studio. Scroll down to the 'Command Line Tools Only' section of the page.

If you install Android Studio it's still recommended to download and setup the command line tools separately to be able to use them without the IDE.

The binary folder of the command also need to be added to the `$PATH`, and `$ANDROID_HOME` pointing to the root of the SDK. Moreover, the SDK requires to be stored in the `$ANDROID_HOME` and inside a folder called `latest`.

Here are the steps from the command line you can follow to install the CLI tools once downloaded the zip file:

```bash
mkdir -p Android/Sdk/cmdline-tools
unzip commandlinetools-linux-7583922_latest.zip
mv cmdline-tools/ Android/Sdk/cmdline-tools/latest/
```

Then, to add the environment variables required, you can add the following to your `~/.bashrc` file:

```bash
export ANDROID_HOME="$HOME/Android/Sdk"
export PATH="$PATH:$ANDROID_HOME/cmdline-tools/latest/bin"
```

### Debug tool `adb`

Old SDK distributions used to have it pre-packaged, now you have to install it separately. Once installed SDK following the steps above, you can install the latest version of `adb` with:

```shell
sdkmanager --install platform-tools
```

If you also installed Android Studio you can use the [SDK Manager](https://developer.android.com/studio/intro/update#sdk-manager) instead.

Finally edit again the `$PATH` environment variable to add the adb path: `$ANDROID_HOME/platform-tools`.

### `apksigner`

This tool is used automatically by the Android SDK for signing APKs, and to check the certificate of a given APK, so chances are that after installing the SDK following the steps above you already have it installed, but not configured in the `$PATH` that is needed to manually check APKs signature.

The CLI is part of other CLI tolls under the `build-tools` package, and multiple build tools package can be installed, so check what versions you have under the `$ANDROID_HOME/build-tools` folder, and add the most up to date to the `$PATH` folder. E.g. if you have the version 30.0.3 installed in you computer, apksigner should be installed at `$ANDROID_HOME/build-tools/30.0.3/apksigner`, so add the `$ANDROID_HOME/build-tools/30.0.3` folder to the `$PATH` variable.

In case you don't have it installed or want to install a newer version, checkout the versions available with `sdkmanager --list`. You will see a table with a list of installed and available packages, not just the build tools.

To install the version 31.0.0: `sdkmanager --install 'build-tools;31.0.0'`. Then update or add it to the `$PATH` variable.


## Development

### Flavor selection

_Only CHT Android_

Some `make` targets support the flavor as `make flavor=[Flavor] [task]`, where `[Flavor]` is the branded version with the first letter capitalized. The `[task]` is the action to execute: `deploy`, `assemble`, `lint`, etc.

The default value for `flavor` is `Unbranded`, e.g. executing `make deploy` will assemble and install that flavor, while executing `make flavor=Medicmobilegamma deploy` will do the same for the _Medicmobilegamma_ brand.

See the [Makefile](https://github.com/medic/cht-android/blob/master/Makefile) for more details.

### Build and assemble

To build and assemble the apps within the console use:

    make assemble

The command above builds and assembles the _debug_ and _release_ APKs of the apps, and for the CHT-Android project the Unbranded flavor is built and assembled by default.

Each APK will be generated and stored in `build/outputs/apk/[flavor]/[debug|release]/`, for example after assembling the _Medicmobilegamma_ flavor with `make flavor=Medicmobilegamma assemble`, the _release_ versions of the APKs generated are stored in `build/outputs/apk/medicmobilegamma/release/`.

To assemble other flavors, use the following command: `make flavour=[Flavor] assemble`. See the [Flavor selection](#flavor-selection) section for more details about `make` commands.

To create the `.aab` bundle file, use `make bundle`, although signed versions are generated when [releasing]({{< ref "community/contributing/code/android/releasing" >}}), and the Play Store requires the AAB to be signed with the right key.

To clean the APKs and compiled resources: `make clean`.

### Testing

To execute unit tests and static analysis, run: `make test`.

To generate a unit test coverage report, run: `make test-coverage`.

Find the generated report in:
`build/reports/jacoco/makeUnbrandedDebugUnitTestCoverageReport/html/index.html`

#### Static checks

_Only CHT Android_

To only execute the **linter checks**, run: `make lint`.

#### Instrumentation Tests

_Only CHT Android_

The UI tests run on a device.

1. Uninstall previous versions of the app, otherwise an `InstallException: INSTALL_FAILED_VERSION_DOWNGRADE` can cause tests to fail.
2. Select English as default language in the device.
3. Ensure you meet all the [Requirements](#requirements).
4. Execute: `make test-ui-all`.

#### Shell tests

_Only CHT Android_

The project has bash tests that verify the Make targets used to create and manage the keystores used to sign the apps. Use `make test-bash-keystore` to run them. In CI they are executed in Linux and MacOS VMs.

If you get an error like `make: ./src/test/bash/bats/bin/bats: Command not found`, it's because you cloned the project without the `--recurse-submodules` git argument. Execute first `git submodule update --init` to clone
the submodules within the cht-android folder.

#### Connecting to the server locally

_Only CHT Android_

Refer to the [CHT Core Developer Guide](/community/contributing/code/core/dev-environment#nginx-local-ip).

#### Manually testing with older Android versions

_Only CHT Android_

Later versions of the CHT, only support [running on Chrome/Webview 90+](/releases/#dependencies). Some older versions of Android will not have a new enough Android System Webview to be able to run the CHT webapp. This is particularly true of emulated Android devices, which typically are configured to not receive updates. To test the CHT functionality on these devices you must manually upgrade the version of the Chrome/Webview apk used as the Android System Webview.

To upgrade the necessary apk on an emulated Android device:

- Start by using the `Google APIs` variant of the Android image. The base AOSP image bakes in the `com.android.webview` package, making it difficult to update.
- Depending on your version of Android, you will need to manually download a new version of the apk (make sure to get the correct variant for your architecture):
    - For Android 7-9, you should download a new version of `com.android.chrome` (e.g. from [apkMirror](https://www.apkmirror.com/apk/google-inc/chrome/)).
    - For Android 10+, you should download a new version of `com.google.android.webview` (e.g. from [apkMirror](https://www.apkmirror.com/apk/google-inc/android-system-webview/)).
- Then, you can use adb to install the apk into the device: `adb install -r *your_apk*.apk`

> [!NOTE]
> Testing using an Android 5-6 device can be more challenging. The `com.android.webview` package seems to be baked into the system partition regardless of the image variant. It is possible use a custom ROM (e.g. CyanogenMod) with an upgraded WebView version on a physical device. Another approach to testing with older versions of Android is to simply test against an older version of the CHT (e.g. CHT `3.x.` only requires Chrome/Webview 53). The functionality of cht-android can still be validated by interacting with this old CHT version.
>
> If using the docker-helper to deploy CHT instances for testing with old Android versions, be aware that the `local-ip.medicmobile.org` SSL certificates may not work with the device (because the root certificate is not recognized). On Android 5-6 you can manually install the root certificate via Settings > Security > Install from SD Card.

### Android Studio

The [Android Studio](https://developer.android.com/studio) can be used to build and launch the app instead. Be sure to select the right flavor from the _Build Variants_ dialog (see [Change the build variant](https://developer.android.com/studio/run#changing-variant)). To launch the app in an emulator, you need to uncomment the code that has the strings for the `x86` or the `x86_64` architecture in the `android` / `splits` / `include` sections of the `build.gradle` file.

### Artifact formats

When building the app there are two output formats you can use: Android App Bundle or APK.

#### Android App Bundles

_Only CHT Android_

The [publish](https://github.com/medic/cht-android/blob/master/.github/workflows/publish.yml) script in CI produces multiple AABs for publishing to the **Google Play Store**, so the generated `.aab` files need to be uploaded instead of the `.apk` files if the Play Store require so. Old apps published for the first time before Aug 1,  2021 can be updated with the APK format.
If distributing AABs via the Play Store, upload all AABs and it will automatically choose the right one for the target device. The AABs are named as follows: `cht-android-{version}-{brand}-release.aab`.

#### APKs

For compatibility with a wide range of devices, the [publish](https://github.com/medic/cht-android/blob/master/.github/workflows/publish.yml) script in CI produces multiple APKs. The two variables are the instruction set used by the device's CPU, and the supported Android version. When sideloading the application, it is essential to pick the correct APK or the application may crash.

If distributing APKs via the Play Store, upload all APKs and it will automatically choose the right one for the target device.

To help you pick which APK to install, you can find information about the version of Android and the CPU in the About section of the phone's settings menu.

The APKs are named as follows: `cht-android-{version}-{brand}-{instruction-set}-release.apk`.

| Instruction set | Android version | Notes                                                       |
|-----------------|-----------------|-------------------------------------------------------------|
| `arm64-v8a`     | 5+              | Preferred. Use this APK if possible.                        |
| `armeabi-v7a`   | 5+              | Built as support for older devices, ignore if possible.     |
