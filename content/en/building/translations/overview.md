---
title: Overview
linkTitle: Overview
weight: 1
description: >
  Supporting localization and adding translations in the CHT
aliases:
   - /building/translations/translations-overview
   - /building/reference/translations
   - /apps/reference/translations
---

Given that CHT applications are used around the world, the Core Framework was designed with localization in mind. The Core Framework is available in English, French, Nepali, Swahili, Spanish, [and more](/community/contributing/translations)!

## Key Concepts

*Localization* refers to setting up the desired language in CHT for the end user. See an outline of how to change language settings for CHT users [in the dedicated section](#localization).

*Translations* refers to manually setting up extra translations of instance tabs texts or outgoing SMS text. See an outline of how to add new translations to the CHT [in the dedicated section](/building/translations/localizing).

## Localization
In the `app_settings.json` file the default language for the application is set by the `locale` property, along with a separate default language for outgoing messages that are sent via SMS with the `locale_outgoing` property.  

Additionally, languages available to the user can be enabled and disabled through [the `languages` property](/building/reference/app-settings#app_settingsjson) which contains an array of objects. These objects should contain the `locale` and `enabled` properties representing respectively the 2 or 3 letter language code and whether that language should be enabled.

### Forms
Translations for XForms are defined within the forms themselves. The XLSForm notation is [documented here](http://xlsform.org/en/#multiple-language-support), and would use the corresponding 2-character language codes.

### Reports

Submitted forms are shown on the Reports tab, with each value in the report displayed alongside a label. The label for each value is represented by a key in the `report.{form-name}.{field-name}` format, which can be translated by including the key and translation in the [language files](#translations). If the label is omitted in the translation the full key will show in the app.

> [!NOTE]
> To hide report fields from showing on the Reports view altogether, the containing group or field must be included as `hidden_fields`, as per the [form properties file]( {{< ref "building/forms/app#properties" >}}).

### Build 

Custom translations from the properties files are added to the CHT app with the `upload-custom-translations` action.

```shell
cht --local upload-custom-translations
```
    
Updated translations from forms need to be added with the actions to upload forms.

```shell
cht --local upload-contact-forms upload-app-forms
```
