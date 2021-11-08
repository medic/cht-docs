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

## Using an intent

To have another Android application launch the CHT Android application, use an [ACTION_VIEW](https://developer.android.com/reference/android/content/Intent.html#ACTION_VIEW) intent, for example:

```java
String url = "https://myapplication.app.medicmobile.org";
Intent i = new Intent(Intent.ACTION_VIEW);
i.setData(Uri.parse(url));
startActivity(i);
```

## Version notes

|Feature|CHT Core version|
|---|---|
|Released |3.10.0|
