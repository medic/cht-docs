---
title: "Development Environment"
linkTitle: "Development Environment"
weight: 2
description: >
  Instructions for setting up the development environment
relatedContent: >
  core/guides/android/releasing
---

The following instructions allows you to setup a development environment for the **CHT Android** apps, to either contribute to the project or just add a new flavor (branded app).

Finally, you will learn how to assemble the app, run the tests, and how to choose the right artifacts when installing or publishing the apps.


## Requirements

- Java 11+ (it works with OpenJDK versions).
- Android Studio, or at least the command line tools from the [Android SDK](https://developer.android.com/studio#command-tools).
- The source code. To run all the tests in the CHT Android app you need to clone also the submodules: `git clone --recurse-submodules https://github.com/medic/cht-android.git`.
- The `make` command.
- If you are going to build a new flavor you also need to have installed `xxd` and `openssl`.

**Gradle** is also used but it's downloaded and installed in the user space the first time `make` is executed. You can also build and launch the app with [Android Studio](#android-studio).

## Flavor selection

Some `make` targets support the flavor and the rendering engine as `make flavor=[Flavor][Engine] [task]`, where `[Flavor]` is the branded version with the first letter capitalized and the `[Engine]` is either `Webview` or `Xwalk`. The `[task]` is the action to execute: `deploy`, `assemble`, `lint`, etc.

The default value for `flavor` is `UnbrandedWebview`, e.g. executing `make deploy` will assemble and install that flavor, while executing `make flavor=MedicmobilegammaXwalk deploy` will do the same for the _Medicmobilegamma_ brand and the `Xwalk` engine.

See the [Makefile](https://github.com/medic/cht-android/blob/master/Makefile) for more details.

## Build and assemble

    $ make assemble

The command above builds and assembles the _debug_ and _release_ APKs of the Unbranded Webview version of the app.

Each APK will be generated and stored in `build/outputs/apk/[flavor][Engine]/[debug|release]/`, for example after assembling the _Simprints Webview_ flavor with `make flavor=SimprintsWebview assemble`, the _release_ versions of the APKs generated are stored in `build/outputs/apk/simprintsWebview/release/`.

To assemble other flavors, use the following command: `make flavour=[Flavor][Engine] assemble`. See the [Flavor selection](#flavor-selection) section for more details about `make` commands.

To create the `.aab` bundle file, use `make bundle`, although signed versions are generated when [releasing]({{< ref "core/guides/android/releasing" >}}), and the Play Store requires the AAB to be signed with the right key.

To clean the APKs and compiled resources: `make clean`.

## Static checks

To only execute the **linter checks**, run: `make lint`. To perform the same checks for the _XView_ source code, use: `make flavor=UnbrandedXwalk lint` instead.

## Testing

To execute unit tests: `make test` (static checks ara also executed).

### Instrumentation Tests (UI Tests)

These tests run on your device.

1. Uninstall previous versions of the app, otherwise an `InstallException: INSTALL_FAILED_VERSION_DOWNGRADE` can make the tests fail.
2. Select English as default language in the device.
3. Ensure you meet all the [Requirements](#requirements).
4. Execute: `make test-ui-all`.

### Shell tests

The project has bash tests that verify the Make targets used to create and manage the keystores used to sign the apps. Use `make test-bash-keystore` to run them. In CI they are executed in Linux and MacOS VMs.

If you get an error like `make: ./src/test/bash/bats/bin/bats: Command not found`, it's because you cloned the project without the `--recurse-submodules` git argument. Execute first `git submodule update --init` to clone
the submodules within the cht-android folder.

### Connecting to the server locally

Refer to the [CHT Core Developer Guide](https://github.com/medic/cht-core/blob/master/DEVELOPMENT.md#testing-locally-with-devices).

## Android Studio

The [Android Studio](https://developer.android.com/studio) can be used to build and launch the app instead. Be sure to select the right flavor and rendering engine from the _Build Variants_ dialog (see [Build and run your app](https://developer.android.com/studio/run)). To launch the app in an emulator, you need to uncomment the code that has the strings for the `x86` or the `x86_64` architecture in the `android` / `splits` / `include` sections of the `build.gradle` file.

## Android App Bundles

The build script produces multiple AABs for publishing to the **Google Play Store**, so the generated `.aab` files need to be uploaded instead of the `.apk` files if the Play Store require so. Old apps published for the first time before Aug 1,  2021 can be updated with the APK format.

For each flavor two bundles are generated, one for each rendering engine: _Webview_ and _Xwalk_. When distributing via the Play Store using the bundle files, upload all AABs and it will automatically choose the right one for the target device.

The AABs are named as follows: `cht-android-{version}-{brand}-{rendering-engine}-release.aab`.

| Rendering engine | Android version |
|------------------|-----------------|
| `webview`        | 10+             |
| `xwalk`          | 4.4 - 9         |

## APKs

For compatibility with a wide range of devices, the build script produces multiple APKs. The two variables are the instruction set used by the device's CPU, and the supported Android version. When sideloading the application, it is essential to pick the correct APK or the application may crash.

If distributing APKs via the Play Store, upload all APKs and it will automatically choose the right one for the target device.

To help you pick which APK to install, you can find information about the version of Android and the CPU in the About section of the phone's settings menu.

The APKs are named as follows: `cht-android-{version}-{brand}-{rendering-engine}-{instruction-set}-release.apk`.

| Rendering engine | Instruction set | Android version | Notes                                                       |
|------------------|-----------------|-----------------|-------------------------------------------------------------|
| `webview`        | `arm64-v8a`     | 10+             | Preferred. Use this APK if possible.                        |
| `webview`        | `armeabi-v7a`   | 10+             | Built but not compatible with any devices. Ignore this APK. |
| `xwalk`          | `arm64-v8a`     | 4.4 - 9         |                                                             |
| `xwalk`          | `armeabi-v7a`   | 4.4 - 9         |                                                             |
