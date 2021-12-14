---
title: "CHT Localization/"
linkTitle: "cht-localization/"
weight: 1
description: >
  Setting up a local environment to build and test CHT applications
relatedContent: >
  core/guides/docker-setup
  core/guides/using-windows
  apps/guides/hosting/self-hosting
  apps/guides/hosting/ec2-setup-guide
---

{{% pageinfo %}}
Given that CHT apps are used around the world, the Core Framework was designed with localization in mind. The Core Framework itself is available in English, French, Hindi, Nepali, Spanish, Swahili, and Indonesian.

This tutorial will take you through localizing the language of CHT applications on CHT version 3.9.1. This includes setting up the instance text as well as outgoing texts to the desired language.

By the end of the tutorial you should be able to:

- Change the CHT instance text to another language; in our case: Swahili
- Change outgoing texts to another language: Swahili in our case.
{{% /pageinfo %}}





## Localizing CHT Elements
1. CHT Instance text - for non-admin users, this is the text that falls under **Messages**, **Tasks**, **Reports**, **People** and **Targets**.
To localize instance text, change the default system language

![configuration](change-system-language.png)

Use the instructions outlined [here](https://docs.communityhealthtoolkit.org/apps/reference/translations/#translations) to  change the instance language.


After changing the instance language, the various elements will behave like this:
_**Messages**_
In Messages, the time counter text and text that shows the user how to navigate the tab changes.

There are no user configurable changes that can be done to this tab.

See below example for Swahili.

![configuration](messages-tab-language.png)

_**Tasks**_
You can localize the task header by adding the appropriate translation in the `messages-{language-code}.properties file.

e.g to translate the below delivery task title to Swahili
```
{
    name: 'anc-home-visit-delivery',
    icon: 'icon-pregnancy',
    title: 'task.anc.delivery.title',
``` 

Add the below code to the messages-sw.properties file
```
task.anc.delivery.title = Kazi ya Kujifungua
```
![configuration](localize-tasks.png)

_**Reports**_
You can localize the report field names by adding the appropriate translation in the `messages-{language-code}.properties` file.

e.g to change the date of birth field to Swahili, in `messages-sw.properties` file, add this:

```
contact.type.date_of_birth = Siku ya Kuzaliwa
```
![configuration](localize-reports.png)


e.g 

_**People**_
To localize the contact labels, add the appropriate translation in `messages-{language-code}.properties` file.

e.g to change the chv name field to Swahili, in `messages-sw.properties` file, add this:

```
contact.type.district_hospital = Kituo Cha Afya
```

_**Targets**_
You can localize the names of the targets by adding the appropriate translation in the `messages-{language-code}.properties file.

e.g to change the `Number of fever cases managed` target to Swahili on the instance, adding the appropriate translation in the `messages-sw.properties` file. i.e

```
targets.fever_cases_managed.title = Idadi ya kesi za homa kusimamiwa
```

_**App Forms**_
To localize an app form to say the Kiswahili language, open the appropriate xlsx of the form and add a `label::sw` column which has the translation for the text. This will work in the `Survey` sheet or the `choices` sheet.

![configuration](app-forms-localization.png)


_**App Management - Admin Area**_
This will still remain in English even after changing the default language.



**Note**: The CHV can also choose the language of their choice when they login for the first time. A popup appears where they can choose their preferred language. 
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

### Translating CHT to another language

{{% alert title="Note" color="info" %}}
Please open [an issue](https://github.com/medic/cht-core/issues/new) if you are interested in translating the app into a different language, as we can work together to make that language available to the community.
{{% /alert %}}
