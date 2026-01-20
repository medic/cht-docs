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

Submitted forms are shown on the Reports tab, with each value in the report displayed alongside a label. The label for each value is represented by a key in the `report.{form-name}.{field-name}` format, which can be translated by including the key and translation in the [language files](/community/contributing/translations/#overview). If the label is omitted in the translation the full key will show in the app.

#### Hiding report fields

Individual report fields can be hidden from view on the Reports tab by including the field key in the `hidden_fields` property on the report doc. There are several ways to populate the `hidden_fields` property (either can be used):

1. In the [XLSForm file](/building/forms/app#xlsform), add a column named `instance::tag` to the `survey` sheet and include `hidden` for any field (or group) that should be hidden on the Reports tab.
2. Add a `hidden_fields` array to the [form's properties file](/building/forms/app#properties) with the keys for the fields (and groups) to be hidden.

This configuration is only applied to future reports and will not change how existing reports are displayed. Data for the hidden fields is still recorded in the database, but it is not shown to the user on the Reports tab.

### Build 

Custom translations from the properties files are added to the CHT app with the `upload-custom-translations` action.

```shell
cht --local upload-custom-translations
```
    
Updated translations from forms need to be added with the actions to upload forms.

```shell
cht --local upload-contact-forms upload-app-forms
```
