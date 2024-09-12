---
title: "Android"
weight: 1
description: >
   Launch the Android App with a link or from another app
relatedContent: >
  building/reference/app-settings/token_login
  building/reference/app-settings/assetlinks
aliases:
   - /apps/features/integrations/android
---

The [CHT Android application](https://github.com/medic/cht-android) can be launched by clicking on a link or invoking an intent in another Android app. This is useful for enabling login by SMS, directing a user to a specific page, and integrating between Android applications.

## Sending a URL

{{< figure src="../../../guides/android/branding/android-12-prompt.png" link="../../../guides/android/branding/android-12-prompt.png" class="right col-6 col-md-4 col-lg-2" >}}
{{< figure src="android-prompt.png" link="android-prompt.png" class="right col-4 col-lg-3" >}}

When the user clicks on a link to a CHT instance from an SMS, email, WhatsApp, or any other app, Android will prompt the user to choose whether to open the URL in the Android app or the browser. If a CHT app is not installed then the URL will be opened in the browser.

The prompt may look different depending on the version of Android being used. Up to Android 11, users can choose "Always" to skip this prompt in the future. Starting with Android 12, users will be promped to associate the CHT instance's domain with the Android app. Alternatively, a CHT instance can be configured to have its links automatically verified for the associated Android App (with no user action required). See the docs on [Android App Links verification]({{< ref "building/guides/android/branding#android-app-links-verification" >}}) for more information.

## Using an intent

To have another Android application launch the CHT Android application, use an [ACTION_VIEW](https://developer.android.com/reference/android/content/Intent.html#ACTION_VIEW) intent, for example:

```java
String url = "https://myapplication.app.medicmobile.org";
Intent i = new Intent(Intent.ACTION_VIEW);
i.setData(Uri.parse(url));
startActivity(i);
```
