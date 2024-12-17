---
title: Managing
linkTitle: Managing
weight: 3
description: >
  Managing translations in the CHT
relatedContent: >  
  building/translations/localizing
aliases:
   - /core/overview/translations
   - /building/translations/managing-translations
---

Apps built with CHT Core are localized so that users can use them in the language of their choice. The goal of this section is to help the community manage existing and new translations.

{{% alert title="Note" color="info" %}}
Please open [an issue](https://github.com/medic/cht-core/issues/new) if you are interested in translating the CHT into a different language, and make it available to the community.
{{% /alert %}}

## Overview

Translation files live in the GitHub repo. These translation files are [properties files](https://en.wikipedia.org/wiki/.properties), which are a series of keys and their corresponding values. The English file is used by default, and as such, it contains the entire set of keys. If any key is missing from another language file the English value is used.

New elements in CHT apps, such as tasks, targets, profiles, and forms should be localized as well. These labels should be included in the same custom translations properties file. If a translation is missing for the user's language it will use that of the default language. 

## Adding new languages

New languages must be added and configured in several places:

- Create a new `messages-xx.properties` file in the [`api/resources/translations`](https://github.com/medic/cht-core/tree/master/api/resources/translations) folder, replacing "xx" with the 2 or 3 letter [language code](https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes). The language code will be used to identify the language in the application. For instance, for English, we would have a `translations/messages-en.properties` file. 
- Add the language to the [`LOCAL_NAME_MAP` in api](https://github.com/medic/cht-core/blob/e6d184946affc62773d569168216a5b913f38a30/api/src/translations.js#L17). Use the language code for the key, and the local name followed by the English name for the language in brackets, eg: "fr: 'Français (French)'".
- Import the moment language pack in the [main.ts file](https://github.com/medic/cht-core/blob/e6d184946affc62773d569168216a5b913f38a30/webapp/src/ts/main.ts#L23). If moment doesn't provide the required language pack you may need to contribute it upstream to the moment library.
- Import the bootstrap-datepicker language pack in the [Enketo main.ts file](https://github.com/medic/cht-core/blob/master/webapp/src/js/enketo/main.js). If bootstrap-datepicker doesn't provide the required language pack you may need to create a custom language pack as in the [Luganda language example](https://github.com/medic/cht-core/blob/master/webapp/src/js/enketo/bootstrap-datepicker.lg.js).
- Add a `TRANSLATIONS` entry for the new language in the [translator.js file](https://github.com/medic/cht-core/blob/master/webapp/src/js/bootstrapper/translator.js).

## Adding new keys

1. First check if an appropriate key already exists in [`messages-en.properties`](https://github.com/medic/cht-core/blob/master/api/resources/translations/messages-en.properties). Using existing keys when possible reduces the effort required to translate the app into a new language.
2. Create a new key and default English value.
3. Reach out to the community to translate the value into all supported languages. The CI will block merging PRs unless all values are provided.
4. Validate the translations are complete and correct by executing `npm run lint-translations`.

### Translating static text

In angular this is done using angular-translate, and ideally using the [translate directive](http://angular-translate.github.io/docs/#/guide/05_using-translate-directive) to reduce the number of watchers, eg: `<h3 translate>date.incorrect.title</h3>`.

Use the translation functions in the config module in [API](https://github.com/medic/cht-core/blob/e6d184946affc62773d569168216a5b913f38a30/api/src/config.js#L72) and [Sentinel](https://github.com/medic/cht-core/blob/e6d184946affc62773d569168216a5b913f38a30/sentinel/src/config.js#L88).

### Translating configurations

Much of the app is configurable (eg: forms and schedules). Because the specifics of the configuration aren't known during development time, these can't be provided via messages. Instead configurers can provide a map of locale to value for each translated property. Then use the `translateFrom` filter to translate from the configured map using the user's language.

## Modifying any existing translation values

1. Update the default English value.
2. Reach out to the community to translate the value into all supported languages.
3. Validate the translations are complete and correct by executing `npm run lint-translations`.

## Removing translation keys

Carefully verify that the translation key isn't used. This can be challenging if keys have been concatenated or generated because then you won't be able to find the complete string in the source code. Once this has been confirmed, then simply remove the key and value from all translation files.
