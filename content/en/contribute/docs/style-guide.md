---
title: "Documentation Style Guide"
linkTitle: "Style Guide"
weight: 10
description: >
  Editorial guidelines for writing documentation
---

This style guide provides a set of editorial guidelines for anyone writing documentation for Community Health Toolkit projects. These are guidelines, not rules. Use your best judgment. 

{{% alert title="Note" %}}
This documentation site does not involve release management and acceptance testing. Help us maintain the quality of our documentation by submiting a pull request (PR) with any suggested changes. One of the repository's maintainers will review the PR, request additional changes as needed, and merge the PR when it is ready.
{{% /alert %}}

## Table of Contents
- [Table of Contents](#table-of-contents)
- [Language](#language)
- [General guidelines and best practices](#general-guidelines-and-best-practices)
  - [Present tense](#present-tense)
  - [Active voice](#active-voice)
  - [Simple and direct language](#simple-and-direct-language)
  - [Address the reader as "you"](#address-the-reader-as-you)
  - [Latin phrases](#latin-phrases)
- [Practices to avoid](#practices-to-avoid)
  - [Using "we"](#using-we)
  - [Using jargon and idioms](#using-jargon-and-idioms)
  - [Using statements about the future](#using-statements-about-the-future)
  - [Using statements that will soon be out of date](#using-statements-that-will-soon-be-out-of-date)
- [Cross-referencing content](#cross-referencing-content)
  - [Avoid broken links](#avoid-broken-links)
- [Formatting standards](#formatting-standards)
  - [Use Markdown Notation](#use-markdown-notation)
  - [Grammar and punctuation in headers](#grammar-and-punctuation-in-headers)
  - [Angle brackets for placeholders](#angle-brackets-for-placeholders)
  - [Bold for user interface elements](#bold-for-user-interface-elements)
  - [Italics to define or introduce new terms](#italics-to-define-or-introduce-new-terms)
  - [Code style for filenames, directories, and paths](#code-style-for-filenames-directories-and-paths)
  - [British standard for punctuation inside quotes](#british-standard-for-punctuation-inside-quotes)
  - [Notes and tips](#notes-and-tips)
  - [Images](#images)
- [Inline code formatting](#inline-code-formatting)
  - [Code style for inline code and commands](#code-style-for-inline-code-and-commands)
- [Code snippet formatting](#code-snippet-formatting)
  - [Don't include the command prompt](#dont-include-the-command-prompt)
  - [Separate commands from output](#separate-commands-from-output)
- [Community Health Toolkit word list](#community-health-toolkit-word-list)

## Language

Documentation for the Community Health Toolkit is written is American English.

## General guidelines and best practices

This section contains suggested best practices for clear, concise, and consistent content.

### Present tense

| Do | Don't |
|---|---|
| CouchDB converts this to a properly hashed password when you save. | CouchDB will convert this to a properly hashed password on save. |

Exception: Use future or past tense if it is required to convey the correct meaning.

### Active voice

| Do | Don't |
|---|---|
| Stop everything and delete the medic DB to clear your database. | Clear your db by stopping everything and deleting the medic DB. |
| Replicate your local production database into a new medic database to bootstrap your data. | Bootstrap your data by replicating your local PROD DB into a new medic database. |

Exception: Use passive voice if active voice leads to an awkward construction.

### Simple and direct language

Use simple and direct language. Avoid using unnecessary phrases, such as saying "please."

| Do | Don't |
|---|---|
| To create a database, ... | In order to create a database, ... |
| See the configuration file. | Please see the configuration file. |
| View the logs. | With this next command, we'll view the logs. |


### Address the reader as "you"

| Do | Don't |
|---|---|
| You can create a database by ... | We'll create a database by ... |
  | In the preceding output, you can see... | In the preceding output, we can see ... |

### Latin phrases

Prefer English terms over Latin abbreviations.

| Do | Don't |
|---|---|
| For example, ... | e.g., ... |
| That is, ... | i.e., ... |

Exception: Use "etc." for et cetera.

## Practices to avoid

### Using "we"

Using "we" in a sentence can be confusing, because the reader might not know
whether they're part of the "we" you're describing.

| Do | Don't |
|---|---|
| Version 3.0 includes ... | In version 3.0, we have added ... |
| Medic Mobile provides a new feature to reduce the time to load contacts. | We made several changes to reduce the time to load contacts. |
| This page teaches you how to use medic-gateway. | In this page, we are going to learn about medic-gateway. |

### Using jargon and idioms

Some readers speak English as a second language. Avoid jargon and idioms to help them understand better.

| Do | Don't |
|---|---|
| To get started, ... | To get up and running with no fuss, ... |
| Internally, ... | Under the hood, ... |
  | Create a new database. | Turn up a new database. |

### Using statements about the future

Avoid giving hints about the future. If you need to talk about
an alpha or beta feature, put the text under a heading that identifies it as alpha or beta
information.

### Using statements that will soon be out of date

Avoid words like "currently" and "new." A feature that is new today might not be
considered new in a few months.

| Do | Don't |
|---|---|
| In version 3.4, ... | In the current version, ... |
  | The Log user statistics feature provides ... | The new Log user statistics feature provides ... |

## Cross-referencing content

Connecting readers to related content in different pages is an important aspect of documentation. There are three ways this can be done in the doc site:
1. **Inline links**: a portion of any narrative text can link to another page. This should done using the markdown link notation. 
   
   For example, the text `linking documents is a [foundational reason for the web existing in the first place](https://en.wikipedia.org/wiki/Hypertext)!` yields: "linking documents is a [foundational reason for the web existing in the first place](https://en.wikipedia.org/wiki/Hypertext)!"
2. **See Also**: the `see-also` shortcode is available to connect to an important concept within the documentation site. The link will be more prominent to the reader by having a common prefix and shown on a separate line.
   
   For example, `{{</* see-also page="design/icons" */>}}` will show as seen here: {{< see-also page="design/icons" >}}

   A custom title and anchor can be provided. For example, `{{</* see-also page="design/icons" title="Learn about the Icon Library" anchor="about-the-icon-library" */>}}`, will show as: {{< see-also page="design/icons" title="Learn about the Icon Library" anchor="about-the-icon-library" >}}

3. **Related Content**: Pages within the documentation site are often closely related, but are separated by the type of content. For instance, a topic may be described in the features, have an implementation guide, and have best practices in the design system. To make this linkage easier for documentation writers and readers, a "Related Content" section can be shown at the bottom of the page. Each page defines it's own related content as `relatedContent` in its front matter. For example, a page with the following front matter would have two pages shown as *Related Content*.
   ```
   ---
   title: Messaging
   relatedContent: >
    apps/guides/messaging/
    design/apps/
    ---
   ``` 

### Avoid broken links
To avoid broken links always use `ref` or `relref` shortcodes for internal references with the full path for the page. Check out the [Hugo documentation for cross-references](https://gohugo.io/content-management/cross-references/) for more details.

For example,  `[Icon Library]({{</* relref "design/icons" */>}})` yields "[Icon Library]({{% relref "design/icons" %}})". Using the full path will avoid ambiguous references if a new page of the same is created. 

## Formatting standards

### Use Markdown Notation

Documentation pages should be written in [Markdown notation](https://www.markdownguide.org/), and not contain HTML tags whenever possible.

| Style | Do | Don't |
|---|---|---|
| _italic_ | `_italic_` or `*italic*` | `<i>italic</i>` or `<em>bold</em>` |
| **bold** | `**bold**` | `<b>bold</b>` or `<strong>bold</strong>` |
| table | `|...|` using [markdown tables](https://www.markdownguide.org/extended-syntax/#tables) | `<table><tr><td>...</td></tr></table>` | 


### Grammar and punctuation in headers

Use title case for page `title`, and sentence case for `linkTitle` description. Do not end titles with periods.


### Angle brackets for placeholders

Use angle brackets for placeholders. Tell the reader what a placeholder
represents.

1. Create a file named `<project_name>-medic-os-compose.yml`. Where `<project_name>` is the name of one of your project.

### Bold for user interface elements

| Do | Don't |
|---|---|
| Click **Fork**. | Click "Fork". |
| Select **Other**. | Select 'Other'. |

### Italics to define or introduce new terms

| Do | Don't |
|---|---|
| By default CouchDB runs in _admin party_ mode, which means you do not need users to read or edit any data. | By default CouchDB runs in "admin party" mode, which means you do not need users to read or edit any data. |
| The _keys_ in `.properties` files are referred to as _terms_ in POEditor. | The "keys" in .properties files are referred to as **terms** in POEditor. |

### Code style for filenames, directories, and paths

| Do | Don't |
|---|---|
| Open `messages-en.properties` file. | Open messages-en.properties file. |
| The file is located in `/config/standard` directory. | The file is located in /config/standard directory. |
| Create `medic/translations/messages-en.properties` file. | Create medic/translations/messages-en.properties file. |

### British standard for punctuation inside quotes

| Do | Don't |
|---|---|
| The doc in the database is a "record". | The doc in the database is a "record." |
| The copy is called a "fork". | The copy is called a "fork." |

### Notes and tips

Make notes and tips stand out by using blockquote styling.

{{% alert title="Note" %}}
This is a sample note.
{{% /alert %}}

`{{%/* alert title="Note" %}} 
This is a sample note.
{{% /alert */%}}`

### Images

The figure shortcode is preferred for images as it uses built-in styling that is responsive, however Markdown syntax is also acceptable. Do not use html styling.

| Do | Don't |
|---|---|
| `{{< figure src="image.png" class="right col-6 col-lg-3" >}}` | `<img src="image.png" width="30%" align="right">` |

The image can also link to a file by using the link attribute.

```
{{< figure src="image.png" link="image.png" class="right col-6 col-lg-3" >}}
```

## Inline code formatting

### Code style for inline code and commands

For inline code in an HTML document, use the ``` tag. In a Markdown
document, use the backtick (`).

| Do | Don't |
|---|---|
| The `grunt dev-webapp` command builds and deploys the webapp. | The "grunt dev-webapp" command creates a Deployment. |
| To upload the configuration from your current directory, use `medic-conf --local`. | To upload the configuration from your current directory, use "medic-conf --local". |
| Enclose code samples with triple backticks. `(```)` | Enclose code samples with any other syntax. |


## Code snippet formatting

### Don't include the command prompt

| Do | Don't |
|---|---|
| `export COUCH_NODE_NAME=couchdb@127.0.0.1` | `$ export COUCH_NODE_NAME=couchdb@127.0.0.1` |

### Separate commands from output

Verify the security settings on CouchDB:

```
curl http://localhost:5984
```

The output is similar to this:

```
{"error":"unauthorized","reason":"Authentication required."}
```

## Community Health Toolkit word list

A list of terms and words to be used consistently across the site.

| Term | Usage |
|---|---|
| Docker | Docker should always be capitalized. |
| Community Health Toolkit | Community Health Toolkit should always be capitalized. |
| CHT | Acronym for "Community Health Toolkit". |
| CouchDB | No space between Couch and DB. Do not use Couchdb, Couch DB or other variations. |


