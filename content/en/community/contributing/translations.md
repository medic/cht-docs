---
title: Translations
linkTitle: Translations
weight: 4
description: >
  Internationalizing CHT Core.
relatedContent: >
  building/translations/overview
aliases:
  - /core/overview/translations
  - /building/translations/managing-translations
  - /building/translations/managing
---

> [!TIP]
> Open [an issue](https://github.com/medic/cht-core/issues/new) if you are interested in translating the CHT into a different language, and make it available to the community.

CHT Core currently has built-in support for the following languages:

| Language   | Language Code | Status     |
|------------|---------------|------------|
| Arabic     | `ar`          | Incomplete |
| Bambara    | `bm`          | Incomplete |
| English    | `en`          | Complete   |
| Spanish    | `es`          | Complete   |
| French     | `fr`          | Complete   |
| Hindi      | `hi`          | Incomplete |
| Indonesian | `id`          | Incomplete |
| Nepali     | `ne`          | Complete   |
| Swahili    | `sw`          | Complete   |

Languages marked as "Complete" are fully translated and any new user-facing text will always be translated into these languages. Languages marked as "Incomplete" may be missing translations for some keys and/or the CHT community needs additional volunteers to help support this language by translating new keys. 

If you are interested in helping to support any of these languages, please come introduce yourself in the [Translation category](https://forum.communityhealthtoolkit.org/c/product/translations/35) on the CHT Community Forum! (No technical knowledge/experience is needed to help with translations.)

See the [localization documentation]({{< ref "building/translations/overview" >}}) for more information on how to manage custom translations for a particular CHT instance.

## Overview

Translation files live in the GitHub repo. These translation files are [properties files](https://en.wikipedia.org/wiki/.properties), which are a series of keys and their corresponding values. The English file is used by default, and as such, it contains the entire set of keys. If any key is missing from another language file the English value is used.

## Adding new languages

New languages must be added and configured in several places:

- Create a new `messages-xx.properties` file in the [`api/resources/translations`](https://github.com/medic/cht-core/tree/master/api/resources/translations) folder, replacing "xx" with the 2 or 3 letter [language code](https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes). The language code will be used to identify the language in the application. For instance, for English, we would have a `translations/messages-en.properties` file.
- Add the language to the [`LOCAL_NAME_MAP` in api](https://github.com/medic/cht-core/blob/e6d184946affc62773d569168216a5b913f38a30/api/src/translations.js#L17). Use the language code for the key, and the local name followed by the English name for the language in brackets, eg: "fr: 'Français (French)'".
- Import the moment language pack in the [main.ts file](https://github.com/medic/cht-core/blob/e6d184946affc62773d569168216a5b913f38a30/webapp/src/ts/main.ts#L23). If moment doesn't provide the required language pack you may need to contribute it upstream to the moment library.
- Import the bootstrap-datepicker language pack in the [Enketo main.ts file](https://github.com/medic/cht-core/blob/master/webapp/src/js/enketo/main.js). If bootstrap-datepicker doesn't provide the required language pack you may need to create a custom language pack as in the [Luganda language example](https://github.com/medic/cht-core/blob/master/webapp/src/js/enketo/bootstrap-datepicker.lg.js).
- Add a `TRANSLATIONS` entry for the new language in the [translator.js file](https://github.com/medic/cht-core/blob/master/webapp/src/js/bootstrapper/translator.js).

## Adding new keys

When developing a new feature in CHT Core, any user-facing text must be translated. (Note: log messages are not considered "user-facing" as they will not be seen by end users and as such do not need to be translated.)

In the cht-core repository, the translations are stored in [`api/resources/translations`](https://github.com/medic/cht-core/tree/master/api/resources/translations). To add a new translation string:

- First check if an appropriate key already exists in [`messages-en.properties`](https://github.com/medic/cht-core/blob/master/api/resources/translations/messages-en.properties). Using existing keys when possible reduces the effort required to translate the app into a new language.
- Create a unique key to identify the translation string. The key should accurately describe the string's purpose/usage.
- Add the key to each of the files contained in `api/resources/translations`.
- Include an English translation string for your key (and strings for any other languages you are proficient in). Leave the string empty for the other languages.
    - Note the [translation linting]({{< ref "#linting-translations" >}}) will fail for any empty strings in translation files for the languages marked as "Supported" in the table above. This is expected and the check should continue to fail until translations from the community are added (as described below).
- When you have completed the implementation of your new feature (and you are confident you know which translation strings are needed), make a new post in the [Translation category](https://forum.communityhealthtoolkit.org/c/product/translations/35) on the CHT Community Forum requesting help from the community to translate the new strings. 
    - Include the key(s) and the English string(s) in your post, with a link to the issue/PR you are working on. You can also include any context/screenshots that may help the translators understand the string's purpose.
- Add the additional translations from the community into the proper files in `api/resources/translations`.
    - Translations are required for all the languages above marked as "Supported".


### Translating static text

In angular this is done using angular-translate, and ideally using the [translate directive](http://angular-translate.github.io/docs/#/guide/05_using-translate-directive) to reduce the number of watchers, eg: `<h3 translate>date.incorrect.title</h3>`.

Use the translation functions in the config module in [API](https://github.com/medic/cht-core/blob/e6d184946affc62773d569168216a5b913f38a30/api/src/config.js#L72) and [Sentinel](https://github.com/medic/cht-core/blob/e6d184946affc62773d569168216a5b913f38a30/sentinel/src/config.js#L88).

### Translating configurations

Much of the app is configurable (eg: forms and schedules). Because the specifics of the configuration aren't known during development time, these can't be provided via messages. Instead, configurers can provide a map of locale to value for each translated property. Then use the `translateFrom` filter to translate from the configured map using the user's language.

## Modifying any existing translation values

To modify a translation string value, update the default English value and then follow the same basic steps [outlined above]({{< ref "#adding-new-keys" >}}) to request translations from the community.

## Removing translation keys

Carefully verify that the translation key isn't used. This can be challenging if keys have been concatenated or generated because then you won't be able to find the complete string in the source code. Once this has been confirmed, then simply remove the key and value from all translation files.

## Linting translations

You can run the automated translation linting locally via the `npm run lint-translations` command. This linting is automatically executed by GitHub Actions on every pull request.
