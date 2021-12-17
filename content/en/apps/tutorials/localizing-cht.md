---
title: "CHT Localization/"
linkTitle: "Localizing CHT"
weight: 1
description: >
 How to localize the CHT platform to Swahili
relatedContent: >
  core/overview/translations
  apps/reference/translations
---

{{% pageinfo %}}
Given that CHT apps are used around the world, the Core Framework was designed with localization in mind. The Core Framework itself is available in English, French, Hindi, Nepali, Spanish, Swahili, and Indonesian.

This tutorial will take you through localizing CHT to Swahili on CHT version 3.9.1. This includes setting up the instance text as well as outgoing texts to Swahili.

By the end of the tutorial you should be able to:

- Change the CHT instance text to Swahili.
- Change outgoing texts to Swahili.
{{% /pageinfo %}}

## Brief Overview of Key Concepts

*Localization* this is  setting up the desired language in CHT for the end user.

*Translations* this is manually setting up extra translations of instance tabs texts or outgoing SMS text. See an outline of how to do that [here]({{< ref "../reference/translations/#translations" >}}).

## Required Resources

You should have a functioning [CHT instance with `cht-conf` installed locally]({{< ref "apps/tutorials/local-setup" >}}), completed a [project folder]({{< ref "apps/tutorials/local-setup#3-create-and-upload-a-blank-project" >}}) setup, and an [messages-sw.properties]({{< ref "../reference/translations" >}}) file.

## Implementation Steps

Create a new file in the 'translations/' folder called messages-sw.properties

### 1. Localize CHT Elements to Swahili
_**CHT Instance text**_ - for non-admin users, this is the text that falls under **Messages**, **Tasks**, **Reports**, **People** and **Targets**.
To localize instance text to Swahili, change the default system language to `Swahili`.

Go to App Management > Display > Languages > Default Language(Change to Swahili)

![configuration](change-system-language.png)

Create a message-sw.properties file and use the instructions outlined [here]({{< ref "../reference/translations/#translations" >}}) to learn the structure of a message-{language-code}.properties file.

After creating a messages-sw.properties file, to upload the initial draft or after any changes, use the below command to upload to your local CHT instance:

```
cht --local upload-custom-translations
```


After changing the instance language to Swahili, the various elements will behave like this:
_**Messages**_
In Messages, the time counter text and text that shows the user how to navigate the tab changes.

See below example for Swahili localization.

![configuration](messages-tab-language.png)

_**Tasks**_
You can localize the task header by adding the appropriate translation in the `messages-sw.properties file.

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

#### 2. App Forms
To localize an app form to Swahili, open the appropriate xlsx of the form and add a `label::sw` column which has the translation for the text. This will work in the `Survey` sheet or the `choices` sheet.

![configuration](app-forms-localization.png)


_**App Management - Admin Area**_
This will still remain in English even after changing the default language to Swahili.



**Note**: The CHV can also choose the language of their choice when they login for the first time. A popup appears where they can choose their preferred language. 
### 3. Outgoing Texts

These are the SMS notifications/replies that go to CHVs and Supervisors phones in projects that incorporate SMS workflows.

To change the language of outgoing texts to a particular CHV/Supervisor to Swahili: 

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

ii) Set up the translation for the reply message. For example:
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
iii) Change the CHVs language in app management > users > [Choose CHV username e.g chv_1] > Language > Pick Swahili 

![configuration](change-user-language.png)

### Translating CHT to another language

To translate CHT to a new language (we have English, French, Hindi, Nepali, Spanish, Swahili, and Indonesian already in CHT), follow the steps outlined [here]({{< ref "core/overview/translations" >}}) for reference.