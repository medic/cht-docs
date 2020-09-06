---
title: "Android"
weight: 1
description: >
   Launch the Android App with a link or from another app
relatedContent: >
  apps/reference/app-settings/token_login
---

The [CHT Android application](https://github.com/medic/medic-android/) can be launched by clicking on a link or invoking an intent in another Android app. This is useful for enabling login by SMS, directing a user to a specific page, and integrating between Android applications.

## Sending a URL

When the user clicks on send the URL to your CHT instance in an SMS, email, Whatsapp, or any other app, Android will prompt the user to choose whether to open it in the Android app or the browser. If the app is not installed then the the URL will be opened in the browser.

![Android prompt](android-prompt.png "Android prompt screenshot")

Users can choose "Always" to skip this prompt in future.

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
