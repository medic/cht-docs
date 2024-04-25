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

Starting with Android 12, Android supports associating an app with a domain and automatically verify this association
to allow deep links to immediately open the app without requiring your user to select the app.  
To get this working, you need to host a Digital Asset Links JSON file at `https://<domain.name>/.well-known/assetlinks.json`
containing some information about your app to associate it with your domain.

### Anatomy of `assetlinks.json`

The following example `assetlinks.json` file grants link-opening rights to the `org.medicmobile.webapp.mobile` Android app
```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "org.medicmobile.webapp.mobile",
      "sha256_cert_fingerprints": ["62:BF:C1:78:24:D8:4D:5C:B4:E1:8B:66:98:EA:14:16:57:6F:A4:E5:96:CD:93:81:B2:65:19:71:A7:80:EA:4D"]
    }
  }
]
```

TODO:
- `relation`, `target.namespace` are "hardcoded"
- `package_name` = application ID declared in `build.gradle`
- `sha256_cert_fingerprints` = apk signature, how to get:
  - `keytool -printcert -jarfile ./path/to/project.apk` or
  - `keytool -list -v -keystore ./path/to/release-key.keystore`

### Hosting it with the CHT

Since CHT Core version 4.7.0, the CHT supports serving `assetlinks.json` by configuring your app settings

TODO:
- add `app_settings/assetlinks.json` file
- run `cht-conf compile-app-settings upload-app-settings`

### Verifying it works

TODO:
- `adb shell pm get-app-links <package_name>` shows the domain as verified
- clicking a link to the app should open the app, not the browser
- opening the app shouldn't ask to manually verify domains (add screenshot of that when domain is not verified)

### One apk <> many CHT instances

TODO:
- each cht instance hosts their own `assetlinks.json`
- `package_name` and `sha256_cert_fingerprints` will be different for each
- make sure the android app manifest has the `<intent-filter android:autoverify="true">` with each cht instance's domain defined, show example like https://github.com/medic/cht-android/blob/master/src/moh_kenya_echis/AndroidManifest.xml#L36

## Using an intent

To have another Android application launch the CHT Android application, use an [ACTION_VIEW](https://developer.android.com/reference/android/content/Intent.html#ACTION_VIEW) intent, for example:

```java
String url = "https://myapplication.app.medicmobile.org";
Intent i = new Intent(Intent.ACTION_VIEW);
i.setData(Uri.parse(url));
startActivity(i);
```

## Version notes

| Feature                                                                                                                                | CHT Core version |
|----------------------------------------------------------------------------------------------------------------------------------------|------------------|
| Released                                                                                                                               | 3.10.0           |
| Added support for [Android App Links verification](https://developer.android.com/training/app-links/verify-android-applinks#web-assoc) | 4.7.0            |
