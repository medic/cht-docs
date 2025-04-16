---
title: "Building CHT Android Flavors"
linkTitle: CHT Android Flavors
weight: 3
description: >
  Branding the CHT Android applications
relatedContent: >
   building/reference/app-settings/assetlinks
aliases:
   - /apps/guides/android/branding/
   - /core/guides/android/branding
   - /building/guides/android/branding/
---


This tutorial will take you through building a CHT Android Application off the existing wrapper.

The CHT Android application is a thin wrapper to load the CHT Core Framework web application in a WebView.

You will be adding a new android flavor based off the [CHT Android](https://github.com/medic/cht-android).

## Brief Overview of Key Concepts

The CHT Android is a native Android container for the Community Health Toolkit (CHT). The repository contains "flavored" configurations, where each "flavor" or "brand" is an app. All apps share the same code and features, but can be customized, hard-coding a specific CHT deployment and have a partner specific logo and display name.

## Add a new Brand

Adding a new _"brand"_ or _"flavor"_ requires the following steps:

1. Check you meet the **[Required Resources](#1-required-resources)**.

2. Add the **[New Brand](#2-new-brand)** in the source code.

3. **[Generate a new keystore](#3-generate-a-new-keystore)** if there is no one.

4. **[Test locally](#4-test-locally-the-keystore)** and create a pull request with the changes.

5. **[Release](#5-release-the-new-flavor)** the new flavor.

6. **[Publish](#6-publish-the-app)** in the Play Store or whatever channel.

Below are more instructions for each step.


### 1. Required Resources

To proceed you need to have ready the following:

- The URL of your CHT server so users don't have to type it in post install.
- The app logo and title.
- Translations for your supported languages (most flavors don't need to customize translations though).

Also be sure to have a working **[Development Environment]({{< ref "community/contributing/code/android/development-setup" >}})**.

While you should use your own branding, the [CHT logo](./CHT.logo.512.png) is available to use if so desired.

#### Play Store assets

If you are going to publish the app in the **Play Store**, Google will require to provide the following to list the app:

- A description of the app.
- A shorter description (80 characters).
- Logo 512x512px, typically a version of the partner logo e.g. square design icons.
- A background image.
- Screenshots.

Google is constantly changing the requirements to publish in the Play Store, it's a good practice to check in advance whether all the requirements are met (checkout _[Add preview assets...](https://support.google.com/googleplay/android-developer/answer/9866151)_).

##### Test data

When publishing for the first time in the Play Store, a reviewer from Google will try to check whether the permission requested by the app follows the Play Store rules. The CHT Android app has enabled by default location request permissions, and the workflow to request the permission follows the strict rules imposed by Google, but they won't be aware that your _flavored_ app is based on the CHT Android, so you have to provide Google with instructions of how to test the app, specifically how to test the location request.

To do so, give them instructions of how to login with the app (with a real username and password), and the basic steps to reach the location request, like open up a form.

Once approved you can delete the "test" user, Google conduct the tests only the first time, or when a new permission request is added to the app.


### 2. New Brand

Each branded app has an identifier (_id_) that is used to identify and configure it in different parts of the source code and when invoking some commands. In the instructions below we will use as example the id **`new_brand`**.

1. Check out the tag from the [last stable release](https://github.com/medic/cht-android/releases) in CHT Android repository and create a branch, for example, if the latest stable release is `v0.11.0` and the branch name is `v0.11.0-new-brand`, then the command is:

   ```
   git checkout v0.11.0 -b v0.11.0-new-brand
   ```

2. Add `productFlavors { <new_brand> { ... } }` in [build.gradle](https://github.com/medic/cht-android/blob/master/build.gradle), e.g.:

   ```groovy
   new_brand {
     dimension = 'brand'
     applicationId = 'org.medicmobile.webapp.mobile.new_brand'
   }
   ```

3. Add icons, strings etc. in the `src/<new_brand>` folder. It's required to place there at least the `src/new_brand/res/values/strings.xml` file with the name of the app and the URL of the CHT instance:

   ```xml
   <?xml version="1.0" encoding="utf-8"?>
   <resources>
       <string name="app_name">New Brand</string>
       <string name="app_host">new_brand.app.medicmobile.org</string>
   </resources>
   ```

4. Enable automated builds of the APKs and AABs: add the `new_brand` flavor in [.github/workflows/publish.yml](https://github.com/medic/cht-android/blob/master/.github/workflows/publish.yml). The _Unpack secrets  ..._ task unpacks and decrypts the secret file with the keystore (next section), The _Assemble ..._ task takes care of generating the `.apk` files for sideloading, and the _Bundle ..._ task is responsible of generating the `.aab` files for publishing in the Play Store (you can skip the last if you are not going to publish in the Play Store):

   ```yml
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

   The variables in the `env` sections point to a keystore and the passwords to unlock the keystore that will be generated in the following steps, but it's important to follow the name convention, in the example all the variables that are configured in Github Actions end with the suffix `_NEW_BRAND`, these variables need to be added in the CHT Android repository settings by a manager of Medic.


### 3. Generate a new keystore

Each branded app created needs its own keystore to sign the binaries for releasing.

Since the `.aab` files generated here are signed with the same key you generated, the files and key can be uploaded to the Play Store later and any file generated locally following the steps above will be compatible with any installation made from the Play Store.

The keystore files are placed into a compressed and encrypted file in the [secrets/](https://github.com/medic/cht-android/tree/master/secrets) folder. In our case the file will be `secrets/secrets-new_brand.tar.gz.enc`, and the content inside when the file is decrypted is:

   - `new_brand.keystore`: the Java keystore with a signature key inside that is always called `medicmobile`. It's used to sign the APKs and the bundles, and the one that Google will use to sign the optimized APKs that generates in the Play Store.
   - `new_brand_private_key.pepk`: a PEPK file is an encrypted file that contains inside the `medicmobile` key from the keystore above, ready to be uploaded to the Play Store the first time the app is registered in the Play Console. The file is only used there, but kept in the compressed file as a backup.

Don't worry to follow all the name conventions and how to generate these files, you can create all them in one step: the new keystore, the passwords and the PEPK file with `make org=new_brand keygen`.

Executing the command will check that you have the necessary tooling installed, and ask you the information about the certificate like the organization name, organization unit, etc. The command also takes care of picking random passwords that meet the security requirements, and then compresses the key files and finally encrypt the `.tar.gz` file into the `.enc` file. At the end of the execution, the script will also show the list of environment variables that you have to setup in CI (Github Actions) and locally in order to sign the apps with the new keystore. Below is an example of executing it to create the keystore for our "new_brand":

```
make org=new_brand keygen
Verifying the following executables are in the $PATH: java keytool openssl ...
keytool -genkey -storepass dd8668... -v -keystore new_brand.keystore -alias medicmobile -keyalg RSA -keysize 2048 -validity 9125
What is your first and last name?
 [Unknown]:
What is the name of your organizational unit?
 [Unknown]:  New Brand
What is the name of your organization?
 [Unknown]:  Medic
What is the name of your City or Locality?
 [Unknown]:  San Fran... ...
Is CN=Unknown, OU=New Brand, O=Medic, L=San Francisco, ST=CA, C=US correct?
 [no]:  y

Generating 2,048 bit RSA key pair and self-signed certificate (SHA256withRSA) with a validity of 9,125 days
   for: CN=Unknown, OU=New Brand, O=Medic, L=San Francisco, ST=CA, C=US
[Storing new_brand.keystore]
... ...

#######################################      Secrets!    #######################################
#                                                                                              #
# The following environment variables needs to be added to the CI environment                  #
# (Github Actions), and to your local environment if you also want                             #
# to sign APK or AAB files locally:                                                            #
#                                                                                              #

export ANDROID_KEYSTORE_PASSWORD_NEW_BRAND=dd8668...
export ANDROID_KEY_PASSWORD_NEW_BRAND=dd8668...
export ANDROID_SECRETS_IV_NEW_BRAND=88d9c2dea7a9...
export ANDROID_SECRETS_KEY_NEW_BRAND=2824d02d2bc221f5844b8fe1d928211dcbbc...

#
# The file secrets/secrets-new_brand.tar.gz.enc was created and has to be added to the git
# repository (don't worry, it's encrypted with some of the keys above).                        #
# NOTE: *keep the environment variables secret !!*                                             #
#                                                                                              #
###########################################  End of Secrets  ###################################
```

The _Secrets!_ section at the end is as important as the `secrets/secrets-new_brand.tar.gz.enc` file generated, because as it says above, it needs to be configured in CI.

Use a safe channel to send the environment variables to the manager in charge, like a password manager, and keep them locally at least for testing, storing in a script file that is safe in your computer.

About the file `secrets/secrets-new_brand.tar.gz.enc`, as the last paragraph in the console says: _has to be added to the git repository  (don't worry, it's encrypted with some of the keys above)_.

If you want to start over because some of the parameters were wrong, just execute `make org=new_brand keyrm-all` to clean all the files generated. Once committed the `.enc` file, you can delete the uncompressed and unencrypted version with `make org=new_brand keyrm`, it will delete the `new_brand.keystore`, `new_brand_private_key.pepk`, and the unencrypted `.tar.gz` files, that are safer kept in the `.tar.gz.enc` file.

If you encounter issues with the `make org=new_brand keygen` command repeatedly looping through questions, we recommend changing your OS language to English.

### 4. Test the keystore locally

**Want to check the keystore?** here are a few things you must test before upload to the repository:

1. To decrypt the content like CI does to sign the app, execute: `make org=new_brand keydec`, it will decrypt and decompress the files removed in the step above. Remember that the environment variables printed in the console needs to be loaded in the CLI. Note that all the variables above end with the suffix `_NEW_BRAND`, as the id of the app that we pass through the `org` argument in lowercase, but if Make found the same variables defined without the prefix, they take precedence over the suffix ones.

2. Execute `make org=new_brand keyprint` to see the certificate content, like the org name, the certificate fingerprints, etc.

3. Sign your app! You can try locally to build the app with the certificate. To create the .apk files run: `make org=new_brand flavor=New_brand assemble`. The "release" files signed should be placed in `build/outputs/apk/new_brand/release/`. To ensure the files were signed with the right signature execute `make keyprint-apk`, it will check the certificate of the first apk file under the `build/` folder:

   ```
   make keyprint-apk
   apksigner verify -v --print-certs build/outputs/apk/new_brand/release/cht-android-SNAPSHOT-new_brand-arm64-v8a-release.apk
   ... ...
   Verified using v2 scheme (APK Signature Scheme v2): true
   ... ...
   Signer #1 certificate DN: CN=Unknown, OU=New Brand, O=Medic Mobile, L=San Francisco, ST=CA, C=US
   Signer #1 certificate SHA-256 digest: 7f072b...
   ```

Also, do the same for the bundle format: build and verify, despite the AAB are not useful for local development. In our example, execute first `make org=new_brand flavor=New_brand bundle`, and then `make keyprint-bundle` to see the signature of one of the `.aab` files generated.

Because the files generated here are signed with the same key that you are going to use in CI, and the files produced in CI will be uploaded to the Play Store later, any file generated locally following the steps above will be compatible with any installation made from the Play Store, means that if a user install the app from the Play Store, and then we want to replace the installation with an alpha version generated in CI or a local version generated in dev environment, it will work without requiring the user to uninstall the app and lost the data.


### 5. Release the new flavor

Releasing a new flavor requires the following steps:

1. Make a pull request to the release branch in the CHT Android repository.
2. Once approved it's recommended to create an alpha version to do final tests.
3. Merge the pull request.
4. [Release the flavor]({{< ref "community/contributing/code/android/releasing" >}}).

### 6. Publish the app

The last step is to publish it in the Play Store, or whatever option best suit your needs. Checkout the [Publishing]({{< ref "building/guides/android/publishing" >}}) page to see all the options available and instructions.

## Android App Links verification
*Supported for CHT Core 4.7.0+ and CHT Android 1.3.0+*

Starting with Android 12, Android supports associating an app with a domain and automatically verifying this association. This allows deep links to immediately open content in the app. To get this working, you need to host a Digital Asset Links JSON file at `https://<domain.name>/.well-known/assetlinks.json` containing some information about your app to associate it with your domain. More information is available on the [official Android docs](https://developer.android.com/training/app-links/verify-android-applinks).

### Hosting `assetlinks.json` with the CHT

Since CHT Core version 4.7.0, the CHT supports serving `assetlinks.json` by adding it to your app settings.
All you have to do to make the CHT serve your assetlinks at `/.well-known/assetlinks.json` is to:
1. Ensure your flavor of cht-android [has a valid keystore]({{< ref "#3-generate-a-new-keystore" >}}).
2. Use the `keytool` utility (included with your Java SDK) to get your app's cert fingerprint:
   ```
   keytool -list -v -keystore ./path/to/release-key.keystore
   # or alternatively:
   keytool -printcert -jarfile ./path/to/project.apk
   ```
3. Set the cert fingerprint in the [`assetlinks` configuration]({{< ref "building/reference/app-settings/assetlinks" >}}) for your CHT instance and deploy it to your server with cht-conf.

#### Note for Apps Using Google Play Signing

For apps signed by Google Play, you need to use the SHA256 fingerprint provided in the Google Play Console to ensure successful domain verification.

#### Steps to Retrieve SHA256 Fingerprint from Google Play

1. **Log in to Google Play Console**.
2. **Navigate to your app**: Select your app from the list of published applications.
3. **Setup > App signing**: In the left-hand menu, under the Setup Menu, there is App Signing.
4. **Find SHA256 fingerprint**: Google Play will display the SHA256 fingerprint required for your app.
5. **Update assetlinks.json**: Use this SHA256 fingerprint in your `assetlinks.json` file. (Google Play also provides the full JSON)

Once added and pushed to the server, the deep link can be monitored from the console as well, under the **Deep Links** in the left-hand menu where the Play Console allows you to check the deep link settings and also provides hints to fix any errors (providing the right SHA256 fingerprint to add).

### Verifying it works

There are different ways to verify your setup works and we'll go through a few of them in the next steps.

#### Using Android Debug Bridge `adb`

1. To install the `adb` command, follow the instructions under the [Development Environment > Debug tool adb]({{< ref "community/contributing/code/android/development-setup#debug-tool-adb" >}}) section.
2. With the phone connected to your computer, open a command line session and write the following command: `adb shell pm get-app-links <package_name>` where `<package_name>` is your application ID.

The output of this command should look like this:
```
<package_name>:
    ID: 01234567-89ab-cdef-0123-456789abcdef
    Signatures: ["62:BF:C1:78:24:D8:4D:5C:B4:E1:8B:66:98:EA:14:16:57:6F:A4:E5:96:CD:93:81:B2:65:19:71:A7:80:EA:4D"]
    Domain verification state:
      mobile.webapp.medicmobile.org: verified
```

The domain verification state for your CHT instance's domain should show `verified`.

#### Manually testing on the device

{{< figure src="android-12-prompt.png" link="android-12-prompt.png" class="right col-6 col-md-4 col-lg-2" >}}

Another way of verifying your Android app has been properly associated to your CHT instance's domain is by opening
the Android app on a device. You can run this test on a real device or with the emulator in Android Studio.

Opening the app for the first time should take you straight to the login page __without__ prompting you to link a domain to the app as shown in the following screenshot:

Additionally, clicking a link to your CHT instance should open the app immediately instead of opening the CHT instance in the default browser.

### Use case - a single Android app for many CHT instances

For specific large deployment scenarios, you might publish a single Android app to serve multiple CHT instances.
In this case, each CHT instance's app settings will need to be configured with the same `assetlinks.json` because
they share the same Android app and hence the same `package_name` and `sha256_cert_fingerprints` properties.

When building your Android app, you will need to ensure the app's manifest has `<intent-filter android:autoverify="true">`
with each CHT instance's domain listed in it like so:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android" xmlns:tools="http://schemas.android.com/tools">
  <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" tools:node="remove" />

  <application>
    <activity android:name="AppUrlIntentActivity" android:launchMode="singleInstance" android:exported="true">
      <intent-filter android:autoVerify="true">
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />

        <data android:scheme="https" android:host="first-cht-app.org" android:pathPattern=".*"/>
        <data android:scheme="https" android:host="second-cht-app.org" android:pathPattern=".*"/>
        <data android:scheme="https" android:host="third-cht-app.org" android:pathPattern=".*"/>
      </intent-filter>
    </activity>
  </application>
</manifest>
```
