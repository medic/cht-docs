---
title: "Localization"
linkTitle: "Localization"
weight: 13
description: >
 Localizing language in the CHT
relatedContent: >
  core/overview/translations
  building/reference/translations
aliases:
   - /apps/tutorials/localizing-cht
---

{{% pageinfo %}}
Given that CHT apps are used around the world, the Core Framework was designed with localization in mind. The Core Framework itself is available in English, French, Hindi, Nepali, Spanish, Swahili, and Indonesian.

This tutorial will take you through localizing the CHT to a custom language (Swahili). This will include setting up the user interface labels as well as outgoing text messages.

By the end of the tutorial you should be able to:

- Change the CHT user interface labels to a custom language.
- Change outgoing text messages to a custom language(Swahili will be used in the guide).
{{% /pageinfo %}}

## Brief Overview of Key Concepts

*Localization* this is  setting up the desired language in CHT for the end user.

*Translations* this is manually setting up extra translations of instance tabs texts or outgoing SMS text. See an outline of how to do that [here]({{< ref "../reference/translations/#translations" >}}).

## Required Resources

You should have a functioning [CHT instance with `cht-conf` installed locally]({{< ref "building/local-setup" >}}), completed a [project folder]({{< ref "building/local-setup#3-create-and-upload-a-blank-project" >}}) setup, and an [messages-sw.properties]({{< ref "../reference/translations" >}}) file.

## Implementation Steps

Create a new file in the 'translations/' folder called `messages-sw.properties`.

After an edit or addition of a translation, upload the current `messages-sw.properties` onto your local environment using the below command.

```
cht --url=https://medic:password@localhost --upload-custom-translations
```

### 1. Add User Interface Label Translations
_**CHT Instance text**_ - for non-admin users, this is the text that falls under **Messages**, **Tasks**, **Reports**, **People** and **Targets**.
To localize instance text to Swahili, change the default system language to `Swahili`.

<br clear="all">

{{< figure src="change-system-language.png" link="change-system-language.png" class="right col-6 col-lg-8" >}}

Go to App Management > Display > Languages > Default Language(Change to Swahili)

<br clear="all">

{{< figure src="click-language-name.png" link="click-language-name.png" class="right col-6 col-lg-8" >}}

To find out what the language code for Swahili is, Go to the list of language as illustrated in the screenshot, click `Kiswahili (Swahili)` to show the options dropdown and click `Edit Name` the code will be in the text box under `Language Code` on the popup. 

<br clear="all">

{{< figure src="click-language-edit-name-popup.png" link="click-language-edit-name-popup.png" class="right col-6 col-lg-8" >}}

In our case, the language code is `sw`.

<br clear="all">

Create a `message-sw.properties` file and use the instructions outlined [here]({{< ref "../reference/translations/#translations" >}}) to learn the structure of a message-{language-code}.properties file.

Populate the `messages-sw.properties` file with the appropriate translation strigs and upload it using the below command:

```
cht --local upload-custom-translations
```
The default Swahili translations that come pre-added to CHT can be found [here](https://github.com/medic/cht-core/blob/4.5.x/config/standard/translations/messages-sw.properties).

After changing the instance language to Swahili, the various elements will behave like this:

_**Messages**_

In Messages, the time counter text and navigation text changes.

This is an example of Swahili localization.

<br clear="all">

{{< figure src="messages-tab-language-en.png" link="messages-tab-language-en.png" class="right col-6 col-lg-8" >}}

*English text*

<br clear="all">

{{< figure src="messages-tab-language-sw.png" link="messages-tab-language-sw.png" class="right col-6 col-lg-8" >}}

*Swahili Translation*

<br clear="all">

To change the title of the tab from the default title of this _Messages_ tab of `Jumbe` in Kiswahili to `Barua`, add or edit the below code in the `messages-sw.properties` file:

```
Messages = Jumbe
```
to 

```
Messages = Barua
```

_**Tasks**_

Localize the task header by adding the appropriate translation in the `messages-sw.properties` file.

For example, to translate the below delivery task title to Swahili:

```
{
    name: 'anc-home-visit-delivery',
    icon: 'icon-pregnancy',
    title: 'task.anc.delivery.title',
``` 

Add the code below to the `messages-sw.properties` file
```
task.anc.delivery.title = Kazi ya Kujifungua
```
<br clear="all">

{{< figure src="localize-tasks-en.png" link="localize-tasks-en.png" class="right col-6 col-lg-8" >}}

*Default English  text*

<br clear="all">

{{< figure src="localize-tasks-sw.png" link="localize-tasks-sw.png" class="right col-6 col-lg-8" >}}

*Swahili translation*

<br clear="all">

To change the title of the tab from the default title of this _Tasks_ tab of `Kazi` in Kiswahili to `Fanya Hizi`, add or edit the below code in the `messages-sw.properties` file:

```
Tasks = Kazi
```
to 

```
Tasks = Fanya Hizi
```

_**Reports**_

Localize the report field names by adding the appropriate translation in the `messages-{language-code}.properties` file.

For example, to change the date of birth field to Swahili, in `messages-sw.properties` file, add this:

```
contact.type.date_of_birth = Siku ya Kuzaliwa
```

<br clear="all">

{{< figure src="localize-reports-en.png" link="localize-reports-en.png" class="right col-6 col-lg-8" >}}

*Before*

<br clear="all">

{{< figure src="localize-reports-sw.png" link="localize-reports-sw.png" class="right col-6 col-lg-8" >}}

*Swahili Translation*

<br clear="all">

To change the title of the tab from the default title of this _Reports_ tab of `Ripoti` in Kiswahili to `Ripoti hizi`, add or edit the below code in the `messages-sw.properties` file.

```
Reports = Ripoti hizi
```
to 

```
Reports = Ripoti hizi
```

e.g 

_**People**_

To localize the contact labels, add the appropriate translation in `messages-{language-code}.properties` file.

e.g to change the people name label translation from the default Swahili translation of `Watu` to `Watu wa hili hapa eneo`, in `messages-sw.properties` file, add this:

```
contact.type.person = Mtu wa hili hapa eneo
contact.type.person.plural = Watu wa hili hapa eneo
```
<br clear="all">

{{< figure src="people-translation-en.png" link="people-translation-en.png" class="right col-6 col-lg-8" >}}

*Before*

<br clear="all">

{{< figure src="people-translation-sw.png" link="people-translation-sw.png" class="right col-6 col-lg-8" >}}

*After

<br clear="all">

To change the title of the tab from the default title of this _People_ tab of `Wasiliani` in Kiswahili to `Watu`, add or edit the below code in the `messages-sw.properties` file.

```
People = Wasiliani
```
to 

```
People = Watu
```

_**Targets**_

You can localize the names of the targets by adding the appropriate translation in the `messages-{language-code}.properties file.

For example, to add the `Growth Monitoring` target title in Swahili on the instance, add the appropriate translation in the `messages-sw.properties` file. For instance:

```
targets.growth_monitoring.title = Ufuatiliaji wa ukuaji
```
<br clear="all">

{{< figure src="growth-monitoring-before.png" link="growth-monitoring-before.png" class="right col-6 col-lg-8" >}}


*Before adding the Swahili target label*

<br clear="all">

{{< figure src="growth-monitoring-after.png" link="growth-monitoring-after.png" class="right col-6 col-lg-8" >}}

*After adding the Swahili target label*

<br clear="all">

To change the title of the tab from the default title of this _Targets_ tab of `Grafu` in Kiswahili to `Lengo`, add or edit the below code in the `messages-sw.properties` file.

```
Targets = Grafu
```
to 

```
Targets = Lengo
```

### 2. App Forms
To localize an app form to Swahili, open the appropriate xlsx of the form and add a `label::sw` column which has the translation for the text. This will work in the `Survey` sheet or the `choices` sheet.

<br clear="all">

{{< figure src="new-person-xls-form.png" link="new-person-xls-form.png" class="right col-6 col-lg-8" >}}

*New Person app form XLS configuration*

<br clear="all">

{{< figure src="new-person-form-english.png" link="new-person-form-english.png" class="right col-6 col-lg-8" >}}

*Screenshot of default English translation*

<br clear="all">

{{< figure src="new-person-form-swahili.png" link="new-person-form-swahili.png" class="right col-6 col-lg-8" >}}

*Screenshot of form after switching CHV language to Kiswahili*

<br clear="all">

_**App Management - Admin Area**_
This will still remain in English even after changing the default language to Swahili.



{{% alert title="Note" %}}The CHV can also choose the language of their choice when they login for the first time. A popup appears where they can choose their preferred language.
{{% /alert %}} 
### 3. Outgoing Texts

These are the SMS notifications/replies that go to CHVs and Supervisors phones in projects that incorporate SMS workflows.

To change the language of outgoing texts to a particular CHV/Supervisor to Swahili: 

First in the `app_settings.json`, when configuring replies, add Swahili(sw) under `locales`:
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

Set up the translation for the reply message:
```
"messages": [{
		"message": [{
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
	}
```
<br clear="all">

{{< figure src="change-user-language.png" link="change-user-language.png" class="right col-6 col-lg-8" >}}

Change the CHVs language by following: App Management > Users > [Choose CHV username e.g chv_1] > Language > Pick Swahili:

<br clear="all">

### Translating CHT to another language

To translate CHT to a new language (we have English, French, Hindi, Nepali, Spanish, Swahili, and Indonesian already in CHT), follow the steps outlined [here]({{< ref "core/overview/translations" >}}) for reference.