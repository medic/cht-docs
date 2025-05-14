---
title: Localizing the CHT
linkTitle: Localizing
weight: 2
description: >
  Using the CHT in the desired language
relatedContent: >
  building/translations/managing
aliases:
   - /building/tutorials/localizing-cht
   - /apps/tutorials/localizing-cht
   - /building/translations/localizing-translations
   - /building/translations/localizing
---

This section will take you through translating the CHT to a custom language (in this guide, Swahili). This will include setting up the user interface labels as well as outgoing text messages.

> [!TIP]
> If you need to translate the whole app into an entirely new language, please consider [contributing those translations]({{< ref "community/contributing/translations" >}}) to the core project so they are available to the community.

By the end of the section you should be able to:

- Change the CHT user interface labels to a custom language.
- Change outgoing text messages to a custom language (Swahili).

## Prerequisites

- A local CHT instance [with `cht-conf` installed locally]({{< ref "building/local-setup" >}})
- A [project folder]({{< ref "building/local-setup#3-create-and-upload-a-blank-project" >}})
- CHT Swahili translations in a `messages-sw.properties` file.

## Localization Steps

Create a `translations/messages-sw.properties` file in your project folder.

Populate the `messages-sw.properties` file with the appropriate translation and upload it onto your local CHT environment using the command below.

```shell
cht --url=https://medic:password@localhost --upload-custom-translations
```

or simply:

```shell
cht --local upload-custom-translations
```

### 1. Add User Interface Label Translations

For non-admin users, CHT Instance text refers to the text that falls under **Messages**, **Tasks**, **Reports**, **People** and **Targets**. 
To localize instance text to Swahili, change the default system language to `Swahili`.

<br clear="all">

{{< figure src="change-system-language.png" link="change-system-language.png" class="right col-6 col-lg-8" >}}

Go to App Management > Display > Languages > Default Language(Change to Swahili)

<br clear="all">

{{< figure src="click-language-name.png" link="click-language-name.png" class="right col-6 col-lg-8" >}}

To find out what the language code for Swahili is, go to the list of languages as illustrated in the screenshot, click `Kiswahili (Swahili)` to show the options dropdown and click `Edit Name`. The code will be in the text box under `Language Code` on the popup. 

<br clear="all">

{{< figure src="click-language-edit-name-popup.png" link="click-language-edit-name-popup.png" class="right col-6 col-lg-8" >}}

For this example, the language code is `sw`.

<br clear="all">

After changing the CHT instance language to Swahili, the various elements will behave like this:

##### Messages

In the Messages tab, the time counter text and navigation text changes, as in the screenshots below.

<br clear="all">

{{< figure src="messages-tab-language-en.png" link="messages-tab-language-en.png" class="right col-6 col-lg-8" >}}

*In English*

<br clear="all">

{{< figure src="messages-tab-language-sw.png" link="messages-tab-language-sw.png" class="right col-6 col-lg-8" >}}

*In Swahili*

<br clear="all">

To change the title of the tab from the default title of the _Messages_ tab from `Jumbe` in Kiswahili to `Barua`, add or edit the below value in the `messages-sw.properties` file:

```
Messages = Jumbe
```
to 

```
Messages = Barua
```

##### Tasks

Localize the Tasks header by adding the appropriate translation in the `messages-sw.properties` file.

For example, to translate the below delivery task title to Swahili:

```
{
    name: 'anc-home-visit-delivery',
    icon: 'icon-pregnancy',
    title: 'task.anc.delivery.title',
}
``` 

Add the value below to the `messages-sw.properties` file:

```
task.anc.delivery.title = Kazi ya Kujifungua
```
<br clear="all">

{{< figure src="localize-tasks-en.png" link="localize-tasks-en.png" class="right col-6 col-lg-8" >}}

*In English*

<br clear="all">

{{< figure src="localize-tasks-sw.png" link="localize-tasks-sw.png" class="right col-6 col-lg-8" >}}

*In Swahili*

<br clear="all">

To change the title of the tab from the default title of the _Tasks_ tab from `Kazi` in Kiswahili to `Fanya Hizi`, add or edit the below code in the `messages-sw.properties` file:

```
Tasks = Kazi
```

to 

```
Tasks = Fanya Hizi
```

##### Reports

Localize the Reports tab field names by adding the appropriate translations in the `messages-sw.properties` file.

For example, to change the date of birth field to Swahili, in `messages-sw.properties` file, add this:

```
contact.type.date_of_birth = Siku ya Kuzaliwa
```

<br clear="all">

{{< figure src="localize-reports-en.png" link="localize-reports-en.png" class="right col-6 col-lg-8" >}}

*In English*

<br clear="all">

{{< figure src="localize-reports-sw.png" link="localize-reports-sw.png" class="right col-6 col-lg-8" >}}

*In Swahili*

<br clear="all">

To change the title of the tab from the default title of the _Reports_ tab from `Ripoti` in Kiswahili to `Ripoti hizi`, add or edit the below code in the `messages-sw.properties` file.

```
Reports = Ripoti
```

to 

```
Reports = Ripoti hizi
```

##### People

To localize the People tab labels, add the appropriate translation in `messages-sw.properties` file.

To change the people name label translation from the default Swahili translation of `Watu` to `Watu wa hili hapa eneo`, in `messages-sw.properties` file, add the following values:

```
contact.type.person = Mtu wa hili hapa eneo
contact.type.person.plural = Watu wa hili hapa eneo
```

<br clear="all">

{{< figure src="people-translation-en.png" link="people-translation-en.png" class="right col-6 col-lg-8" >}}

*In English*

<br clear="all">

{{< figure src="people-translation-sw.png" link="people-translation-sw.png" class="right col-6 col-lg-8" >}}

*In Swahili*

<br clear="all">

To change the title of the _People_ tab from `Wasiliani` in Kiswahili to `Watu`, add or edit the below code in the `messages-sw.properties` file.

```
People = Wasiliani
```

to 

```
People = Watu
```

##### Targets

To localize the People tab labels, add the appropriate translation in `messages-sw.properties` file.

To add the `Growth Monitoring` target title in Swahili, add the appropriate translation in the `messages-sw.properties` file.

```
targets.growth_monitoring.title = Ufuatiliaji wa ukuaji
```

<br clear="all">

{{< figure src="growth-monitoring-before.png" link="growth-monitoring-before.png" class="right col-6 col-lg-8" >}}

*Before*

<br clear="all">

{{< figure src="growth-monitoring-after.png" link="growth-monitoring-after.png" class="right col-6 col-lg-8" >}}

*In Swahili*

<br clear="all">

To change the title of the _Targets_ tab from `Grafu` in Kiswahili to `Lengo`, add or edit the below code in the `messages-sw.properties` file.

```
Targets = Grafu
```

to 

```
Targets = Lengo
```

### 2. RTL support

As of version 4.18.0, the CHT has support for Right to Left languages, and bundles Arabic translations. Setting the language to Arabic will automatically switch the UI to a mirrored design, to align with standard RTL writing and web elements. 

{{< figure src="rtl-contact.png" link="rtl-contact.png" class="right col-6 col-lg-8" >}}

{{< figure src="rtl-reports.png" link="rtl-reports.png" class="right col-6 col-lg-8" >}}

<br clear="all">

Any language can be set to be a RTL language via App Management > Display > Languages > Add/Edit language 

{{< figure src="rtl-admin.png" link="rtl-admin.png" class="right col-6 col-lg-8" >}}

### 3. App Forms

To localize a CHT app form to Swahili, open the appropriate xlsx of the form and add a `label::sw` column which has the translation for the text. This will work in the `Survey` sheet or the `choices` sheet.

<br clear="all">

{{< figure src="new-person-xls-form.png" link="new-person-xls-form.png" class="right col-6 col-lg-8" >}}

*New Person app form XLS configuration*

<br clear="all">

{{< figure src="new-person-form-english.png" link="new-person-form-english.png" class="right col-6 col-lg-8" >}}

*Default English translation*

<br clear="all">

{{< figure src="new-person-form-swahili.png" link="new-person-form-swahili.png" class="right col-6 col-lg-8" >}}

*Form after switching CHV's language to Kiswahili*

<br clear="all">

The _App Management - Admin Area_ section will still remain in English even after changing the default language to Swahili.

> [!NOTE]
> The CHV can also choose the language of their choice when they login for the first time. A popup appears where they can choose their preferred language.

### 4. Outgoing Texts

In projects that incorporate SMS workflows, there are SMS notifications/replies that go to CHVs and Supervisors phones.

To change the language of outgoing texts for a CHV or Supervisor to Swahili, follow the steps below.

- In the `app_settings.json`, when configuring replies, add Swahili language code (sw) under `locales`:

```json
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
]
``` 

- Set up the translation for the reply message:

```json
{
  "messages":[
    {
      "message":[
        {
          "content":"Thank you, visit for {{patient_name}} ({{patient_id}}) has been recorded.",
          "locale":"en"
        },
        {
          "content":"Asante, kuhudhuria kwa {{patient_name}} ({{patient_id}} kumerekodiwa.",
          "locale":"sw"
        }
      ],
      "event_type":"report_accepted",
      "recipient":"reporting_unit"
    }
  ]
}
```

<br clear="all">


