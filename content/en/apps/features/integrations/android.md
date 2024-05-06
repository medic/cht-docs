---
title: "Android"
weight: 1
description: >
   Launch the Android App with a link or from another app
relatedContent: >
  apps/reference/app-settings/token_login
---

The [CHT Android application](https://github.com/medic/cht-android) can be launched by clicking on a link or invoking an intent in another Android app. This is useful for enabling login by SMS, directing a user to a specific page, and integrating between Android applications.

## Sending a URL

{{< figure src="android-prompt.png" link="android-prompt.png" class="right col-8 col-lg-4" >}}

When the user clicks on a link to a CHT instance from an SMS, email, WhatsApp, or any other app, Android will prompt the user to choose whether to open the URL in the Android app or the browser. If a CHT app is not installed then the URL will be opened in the browser.

Users can choose "Always" to skip this prompt in future. The prompt may look different depending on the version of Android being used.

## Android App Links verification
*Supported for CHT Core 4.7.0+ and CHT Android 1.3.0+*

Starting with Android 12, Android supports associating an app with a domain and automatically verify this association
to allow deep links to immediately open the app without requiring your user to select the app.
To get this working, you need to host a Digital Asset Links JSON file at `https://<domain.name>/.well-known/assetlinks.json`
containing some information about your app to associate it with your domain.  
Starting with Android 12, Android supports associating an app with a domain and automatically verifying this association. This allows deep links to immediately open content in the app. To get this working, you need to host a Digital Asset Links JSON file at `https://<domain.name>/.well-known/assetlinks.json` containing some information about your app to associate it with your domain.  More information is available on the [official Android docs](https://developer.android.com/training/app-links/verify-android-applinks).

### Hosting `assetlinks.json` with the CHT

Since CHT Core version 4.7.0, the CHT supports serving `assetlinks.json` by adding it to your app settings.
All you have to do to make the CHT serve your assetlinks at `/.well-known/assetlinks.json` is to:
1. Define your assetlinks in either `base_settings.json` or `app_settings/assetlinks.json`
2. Compile and upload your app settings using cht-conf `cht-conf compile-app-settings upload-app-settings`

You can read more about the structure and contents of assetlinks in [the assetlinks configuration docs]({{< ref "apps/reference/app-settings/assetlinks" >}}).

### Verifying it works

There are different ways to verify your setup works and we'll go through a few of them in the next steps.

#### Using Android Debug Bridge `adb`

1. To install the `adb` command, follow the instructions under the [Development Environment > Debug tool adb]({{< ref "contribute/code/android/development-setup#debug-tool-adb" >}}) section.
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

## Using an intent

To have another Android application launch the CHT Android application, use an [ACTION_VIEW](https://developer.android.com/reference/android/content/Intent.html#ACTION_VIEW) intent, for example:

```java
String url = "https://myapplication.app.medicmobile.org";
Intent i = new Intent(Intent.ACTION_VIEW);
i.setData(Uri.parse(url));
startActivity(i);
```

## Version notes

| Feature                                          | CHT Core version |
|--------------------------------------------------|------------------|
| Released                                         | 3.10.0           |
| Added support for Android App Links verification | 4.7.0            |
