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

The CHT Android is a native Android container for the Community Health Toolkit (CHT). The repo contains "flavored" configurations, where each "flavor" or "brand" is an app. All apps share the same code and features, but can be customized, hard-coding a specific CHT deployment and have a partner specific logo and display name.

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

Also be sure to have a working **[Development Environment]({{< ref "core/guides/android/development-setup" >}})**.

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


### 2. New Brand

Each branded app has an identifier (_id_) that is used to identify and configure it in different parts of the source code and when invoking some commands. In the instructions below we will use as example the id **`new_brand`**.

1. Add `productFlavors { <new_brand> { ... } }` in [build.gradle](https://github.com/medic/cht-android/blob/master/build.gradle), e.g.:

   ```groovy
       new_brand {
         dimension = 'brand'
         applicationId = 'org.medicmobile.webapp.mobile.new_brand'
       }
   ```

2. Add icons, strings etc. in the `src/<new_brand>` folder. It's required to place there at least the `src/new_brand/res/values/strings.xml` file with the name of the app and the URL of the CHT instance:

   ```xml
   <?xml version="1.0" encoding="utf-8"?>
   <resources>
       <string name="app_name">New Brand</string>
       <string name="app_host">new_brand.app.medicmobile.org</string>
   </resources>
   ```

3. Enable automated builds of the APKs and AABs: add the `new_brand` flavor in [.github/workflows/publish.yml](https://github.com/medic/cht-android/blob/master/.github/workflows/publish.yml). The _Unpack secrets  ..._ task unpacks and decrypts the secret file with the keystore (next section), The _Assemble ..._ task takes care of generating the `.apk` files for sideloading, and the _Bundle ..._ task is responsible of generating the `.aab` files for publishing in the Play Store (you can skip the last if your are not going to publish in the Play Store):

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

   The variables in the `env` sections point to a keystore and the passwords to unlock the keystore that will be generated in the following steps, but it's important to follow the name convention, in the example all the variables that are configured in Github Actions end with the suffix `_NEW_BRAND`, these variables need to be added in the cht-android repo settings by a manager of Medic.


### 3. Generate a new keystore

Each branded app created needs its own keystore to sign the binaries for releasing.

Since the `.aab` files generated here are signed with the same key you generated, the files and key can be uploaded to the Play Store later and any file generated locally following the steps above will be compatible with any installation made from the Play Store.

The keystore files are placed into a compressed and encrypted file in the [secrets/](https://github.com/medic/cht-android/tree/master/secrets) folder. In our case the file will be `secrets/secrets-new_brand.tar.gz.enc`, and the content inside when the file is decrypted is:

   - `new_brand.keystore`: the Java keystore with a signature key inside that is always called `medicmobile`. It's used to sign the APKs and the bundles, and the one that Google will use to sign the optimized APKs that generates in the Play Store.
   - `new_brand_private_key.pepk`: a PEPK file is an encrypted file that contains inside the `medicmobile` key from the keystore above, ready to be uploaded to the Play Store the first time the app is registered in the Play Console. The file is only used there, but kept in the compressed file as a backup.

Don't worry to follow all the name conventions and how to generate these files, you can create all them in one step: the new keystore, the passwords and the PEPK file with `make org=new_brand keygen`.

Executing the command will check that you have the necessary tooling installed, and ask you the information about the certificate like the organization name, organization unit, etc. The command also takes care of picking random passwords that meet the security requirements, and then compresses the key files and finally encrypt the `.tar.gz` file into the `.enc` file. At the end of the execution, the script will also show the list of environment variables that you have to setup in CI (Github Actions) and locally in order to sign the apps with the new keystore. Below is an example of executing it to create the keystore for our "new_brand":

```
$ make org=new_brand keygen
Verifying the following executables are in the $PATH: java keytool openssl ...
keytool -genkey -storepass dd8668... -v -keystore new_brand.keystore -alias medicmobile -keyalg RSA -keysize 2048 -validity 9125
What is your first and last name?
 [Unknown]:  
What is the name of your organizational unit?
 [Unknown]:  New Brand
What is the name of your organization?
 [Unknown]:  Medic Mobile
What is the name of your City or Locality?
 [Unknown]:  San Fran... ...
Is CN=Unknown, OU=New Brand, O=Medic Mobile, L=San Francisco, ST=CA, C=US correct?
 [no]:  y

Generating 2,048 bit RSA key pair and self-signed certificate (SHA256withRSA) with a validity of 9,125 days
   for: CN=Unknown, OU=New Brand, O=Medic Mobile, L=San Francisco, ST=CA, C=US
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
export ANDROID_KEYSTORE_PATH_NEW_BRAND=new_brand.keystore
export ANDROID_KEY_ALIAS_NEW_BRAND=medicmobile

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


### 4. Test locally the keystore

**Want to check the keystore?** here are a few things you must test before upload to the repo:

1. To decrypt the content like CI does to sign the app, execute: `make org=new_brand keydec`, it will decrypt and decompress the files removed in the step above. Remember that the environment variables printed in the console needs to be loaded in the CLI. Note that all the variables above end with the suffix `_NEW_BRAND`, as the id of the app that we pass through the `org` argument in lowercase, but if Make found the same variables defined without the prefix, they take precedence over the suffix ones.

2. Execute `make org=new_brand keyprint` to see the certificate content, like the org name, the certificate fingerprints, etc.

3. Sign your app! try locally to build the app with the certificate. To create the Webview versions of the .apk files: `make org=new_brand flavor=New_brandWebview assemble`. The "release" files signed should be placed in `build/outputs/apk/new_brandWebview/release/`. To ensure the files were signed with the right signature execute `make keyprint-apk`, it will check the certificate of the first apk file under the `build/` folder:

   ```
   $ make keyprint-apk 
   apksigner verify -v --print-certs build/outputs/apk/new_brandWebview/release/cht-android-SNAPSHOT-new_brand-webview-armeabi-v7a-release.apk
   ... ...
   Verified using v2 scheme (APK Signature Scheme v2): true
   ... ...
   Signer #1 certificate DN: CN=Unknown, OU=New Brand, O=Medic Mobile, L=San Francisco, ST=CA, C=US
   Signer #1 certificate SHA-256 digest: 7f072b...
   ```

Also do the same for the bundle format: build and verify, despite the AAB are not useful for local development. In our example, execute first `make org=new_brand flavor=New_brandWebview bundle`, and then `make keyprint-bundle` to see the signature of one of the `.aab` files generated.

Because the files generated here are signed with the same key that you are going to use in CI, and the files produced in CI will be uploaded to the Play Store later, any file generated locally following the steps above will be compatible with any installation made from the Play Store, means that if a user install the app from the Play Store, and then we want to replace the installation with an alpha version generated in CI or a local version generated in dev environment, it will work without requiring the user to uninstall the app and lost the data.


### 5. Release the new flavor

Once you have your pull request approved in the cht-android repo, it's recommended to create an alpha version before merge it to master and do the final release.

Checkout the [Release]({{< ref "core/guides/android/releasing#new-flavor-release" >}}) page, where it's explained the different stages and instructions for releasing. The last section _"New flavor release"_ has special instructions of how to release a new brand.

### 6. Publish the app

The last step is to publish it in the Play Store, or whatever option best suit your needs. Checkout the [Publishing]({{< ref "core/guides/android/publishing" >}}) page to see all the options available and instructions.