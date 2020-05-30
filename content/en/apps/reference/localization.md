---
title: "Localization"
linkTitle: "Localization"
weight: 5
description: >
  Localization of CHT applications
keywords: localization languages translations
---

Given that CHT apps are used around the world, the Core Framework was designed with localization in mind. The Core Framework itself is available in English, French, Hindi, Nepali, Spanish, Swahili, and Indonesian. In the `app_settings.json` file you'll see the default language for the application, and a separate default language for outgoing messages that are sent via SMS. Please open [an issue](https://github.com/medic/cht-core/issues/new) if you are interested in translating the app into a different language, as we can work together to make that language available to the community.

If you are looking to modify some labels in the app you can do so by adding the key and modified label in a custom translations file in your `translations` folder. All the properties files use the format `messages-{language-code}.properties`, where the language code is the same 2-letter code used to identify the language in the application. For instance, for English, we would have a `translations/messages-en.properties` file. 

New elements in your app, such as tasks, targets, profiles, and forms should be localized as well. These labels should be included in the same custom translations properties file. Here is an example, including both a modified label, and a new one:

    [Application Text]
    contact.type.district_hospital = Community
    targets.assessments.title = Assessments Completed

If a translation is missing for the user's language it will use that of the default language. 