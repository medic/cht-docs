---
title: ".assetlinks"
linkTitle: ".assetlinks"
weight: 5
description: >
  **Assetlinks**: Defining the Digital Asset Links JSON file associating your domain with your Android app.
relatedContent: >
  building/features/integrations/android
  building/guides/android/branding
keywords: android assetlinks
aliases:
   - /apps/reference/app-settings/assetlinks
---

*Requires CHT Core 4.7.0+, CHT Conf 3.22.0+, and CHT Android 1.3.0+*

When using a [custom flavor of cht-android]({{< ref "building/guides/android/branding" >}}) to connect to your CHT instance, the ecosystem supports using [deep links]({{< ref "building/features/integrations/android#sending-a-url" >}}) to open specific content in the app. (E.g. [token login links]({{< ref "building/concepts/access#magic-links-for-logging-in-token-login" >}})). Security measures in Android require these deep links [be verified](https://developer.android.com/training/app-links/verify-android-applinks) either automatically or manually.  This `assetlinks` configuration enables auto-verification for your CHT links in your Android app. The provided JSON file will be served at `https://<your CHT instance>/.well-known/assetlinks.json`. If you do not provide this configuration, users will be prompted to manually associate the CHT domain with your app.

For more information, see the [docs for building a new CHT Android flavor]({{< ref "building/guides/android/branding#android-app-links-verification" >}}).

Specify your digital asset links in the `app_settings/assetlinks.json` file. The `compile-app-settings` action in the `cht-conf` will automatically include this configuration in your `app_settings.json` file. Then, running the `upload-app-settings` action will deploy it to the server.

## `app_settings.json .assetlinks[]`

| property                          | type             | description                                                                                                                                                                                                                        | required |
|-----------------------------------|------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| `relation[]`                      | `Array<string>`  | The array should contain only one element: the string `delegate_permission/common.handle_all_urls`.                                                                                                                                | yes      |
| `target`                          | `object`         | Contains fields to identify associated apps.                                                                                                                                                                                       | yes      |
| `target.namespace`                | `string`         | Must be set to `android_app`.                                                                                                                                                                                                      | yes      |
| `target.package_name`             | `string`         | The [application ID]({{< ref "building/guides/android/branding#2-new-brand" >}}) declared in the app's `build.gradle` file.                                                                                                            | yes      |
| `target.sha256_cert_fingerprints` | `Array<string>`  | The SHA256 fingerprints of your app’s signing certificate. You can get it with the Java utility `keytool`, see how exactly in our [Android guide]({{< ref "building/guides/android/branding#hosting-assetlinksjson-with-the-cht" >}}). | yes      |

## Code Sample

This sample associates the Android app `org.medicmobile.webapp.mobile` to a CHT instance and grants it link-opening rights to the Android app:

```json
[{
	"relation": ["delegate_permission/common.handle_all_urls"],
	"target": {
		"namespace": "android_app",
		"package_name": "org.medicmobile.webapp.mobile",
		"sha256_cert_fingerprints": ["62:BF:C1:78:24:D8:4D:5C:B4:E1:8B:66:98:EA:14:16:57:6F:A4:E5:96:CD:93:81:B2:65:19:71:A7:80:EA:4D"]
	}
}]
```
