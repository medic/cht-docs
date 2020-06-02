---
title: "Localization"
linkTitle: "Localization"
weight: 5
description: >
  Localization of CHT applications
keywords: localization languages translations
---

Given that CHT apps are used around the world, the Core Framework was designed with localization in mind. The Core Framework itself is available in English, French, Hindi, Nepali, Spanish, Swahili, and Indonesian. In the `app_settings.json` file the default language for the application is set, along with a separate default language for outgoing messages that are sent via SMS. 

{{% alert title="Note" color="info" %}}
Please open [an issue](https://github.com/medic/cht-core/issues/new) if you are interested in translating the app into a different language, as we can work together to make that language available to the community.
{{% /alert %}}

## Translations

To modify some labels in the app add the key and modified label in a custom translations file in the `translations` folder. All the properties files use the format `messages-{language-code}.properties`, where the language code is the same 2-letter code used to identify the language in the application. For instance, for English, we would have a `translations/messages-en.properties` file. 

New elements in CHT apps, such as tasks, targets, profiles, and forms should be localized as well. These labels should be included in the same custom translations properties file. If a translation is missing for the user's language it will use that of the default language. 

Here is an example, including both a modified label, and a new one:

### `translations/messages-{language-code}.properties`

```
    [Application Text]
    contact.type.district_hospital = Community
    targets.assessments.title = Assessments Completed
```

## Forms

Translations for XForms are defined within the forms themselves. The XLSForm notation is [documented here](http://xlsform.org/en/#multiple-language-support), and would use the corresponding 2-character language codes.

## Build

Custom translations from the properties files are added to the app with the `upload-custom-translations` action.

`medic-conf --local upload-custom-translations`
    
Updated translations from forms need to be added with the actions to upload forms.

`medic-conf --local upload-contact-forms upload-app-forms`
