---
title: ".assetlinks"
linkTitle: ".assetlinks"
weight: 5
description: >
  **Assetlinks**: Defining the Digital Asset Links JSON file served at `https://<your CHT instance>/.well-known/assetlinks.json` to associate your domain with your Android app.
relatedContent: >
  apps/features/integrations/android
  apps/guides/android/branding
keywords: android assetlinks
---

Digital Asset Links are defined in either the `base_settings.json` or the `app_settings/assetlinks.json` file and
compiled in to the `app_settings.json` file with the `compile-app-settings` action in the `cht-conf` tool.

## `app_settings.json .assetlinks[]`

| property                          | type             | description                                                                                                                                                                                                                         | required |
|-----------------------------------|------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| `relation[]`                      | `Array<string>`  | The array should contain only one element: the string `delegate_permission/common.handle_all_urls`.                                                                                                                                 | yes      |
| `target`                          | `object`         | Contains fields to identify associated apps.                                                                                                                                                                                        | yes      |
| `target.namespace`                | `string`         | Must be set to `android_app`.                                                                                                                                                                                                       | yes      |
| `target.package_name`             | `string`         | The [application ID]({{ < ref "apps/guides/android/branding#2-new-brand" > }}) declared in the app's `build.gradle` file.                                                                                                                                                                       | yes      |
| `target.sha256_cert_fingerprints` | `Array<string>`  | The SHA256 fingerprints of your app’s signing certificate. You can get it with the Java utility `keytool`.<br>`keytool -printcert -jarfile ./path/to/project.apk` or<br>`keytool -list -v -keystore ./path/to/release-key.keystore` | yes      |

## Code Sample

This sample associates the Android app `org.medicmobile.webapp.mobile` to a CHT instance and grants it link-opening rights to the Android app:

```json
{
	"assetlinks": [{
		"relation": ["delegate_permission/common.handle_all_urls"],
		"target": {
			"namespace": "android_app",
			"package_name": "org.medicmobile.webapp.mobile",
			"sha256_cert_fingerprints": ["62:BF:C1:78:24:D8:4D:5C:B4:E1:8B:66:98:EA:14:16:57:6F:A4:E5:96:CD:93:81:B2:65:19:71:A7:80:EA:4D"]
		}
	}]
}
```
