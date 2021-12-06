---
title: "CHT Localization/"
linkTitle: "cht-localization/"
weight: 2
description: >
  **Localization**: Localizing the CHT Application
keywords: localization languages translations
---

Given that CHT apps are used around the world, the Core Framework was designed with localization in mind. The Core Framework itself is available in English, French, Hindi, Nepali, Spanish, Swahili, and Indonesian. In the `app_settings.json` file the default language for the application is set, along with a separate default language for outgoing messages that are sent via SMS. 

{{% alert title="Note" color="info" %}}
Please open [an issue](https://github.com/medic/cht-core/issues/new) if you are interested in translating the app into a different language, as we can work together to make that language available to the community.
{{% /alert %}}

## Localizing CHT Elements
1. CHT Instance text - for non-admin users, this is the text that falls under **Messages**, **Tasks**, **Reports**, **People** and **Targets**.
To localize instance text, change the default system language

![configuration](change-system-language.png)

Use the instructions outlined [here](https://docs.communityhealthtoolkit.org/apps/reference/translations/) to translate forms, report field labels, target names, contact names etc.
The CHV can also choose the language of their choice when they login for the first time. A popup appears where they can choose their preferred language. 
2. Outgoing Texts - These are the SMS notifications/replies that go to CHVs and Supervisors phones in projects that incorporate SMS workflows.
To change the language of outgoing texts to a particular CHV/Supervisor to say for Example Kiswahili(Swahili), 
i). First in app settings, when configuring replies, add Swahili(sw) under `locales`. Like so:
```
"locales": [
    {
      "code": "en",
      "name": "English"
    },
    {
      "code": "es",
      "name": "Spanish"
    },
    {
      "code": "fr",
      "name": "French"
    },
    {
      "code": "ne",
      "name": "Nepali"
    },
    {
      "code": "sw",
      "name": "Swahili"
    }
``` 

ii) Set up the translation for the message. For example:
```
"messages": [
        {
          "message": [
            {
              "content": "Thank you, visit for {{patient_name}} ({{patient_id}}) has been recorded.",
              "locale": "en"
            },
            {
              "content": "Asante, kuhudhuria kwa {{patient_name}} ({{patient_id}} kumerekodiwa.",
              "locale": "sw"
            }
          ],
          "event_type": "report_accepted",
          "recipient": "reporting_unit"
        },
``` 
iii) Change the CHVs language

![configuration](change-user-language.png)
