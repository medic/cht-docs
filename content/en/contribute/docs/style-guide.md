---
title: "Documentation Style Guide"
linkTitle: "Style Guide"
weight: 10
description: >
  Editorial guidelines for writing documentation
show_toc: true
---

This style guide provides a set of editorial guidelines for anyone writing documentation for Community Health Toolkit projects. These are guidelines, not rules. Use your best judgment. 

{{% alert title="Note" %}}
This documentation site does not involve release management and acceptance testing. Help us maintain the quality of our documentation by submitting a pull request (PR) with any suggested changes. One of the repository's maintainers will review the PR, request additional changes as needed, and merge the PR when it is ready.
{{% /alert %}}


## Language

Documentation for the Community Health Toolkit is written is American English.

## Voice and tone 

The voice and tone should be inclusive and accessible to its audience. Consider that readers come from different backgrounds and may have varying levels of ability reading English, as well as technical abilities. 

### Write like you speak
Aim for a voice and tone that’s conversational and approachable. Try to sound like a knowledgeable friend who understands what the developer wants to do.

### Get to the point quickly
Lead with what’s most important. Make steps obvious to make your documentation easily scannable. 

### Be brief
Give the audience just enough context and information to make decisions confidently. Avoid long sentences.


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
| Medic provides a new feature to reduce the time to load contacts. | We made several changes to reduce the time to load contacts. |
| This page teaches you how to use cht-gateway. | In this page, we are going to learn about cht-gateway. |

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
   
1. **See Also**: the `see-also` shortcode is available to connect to an important concept within the documentation site. The link will be more prominent to the reader by having a common prefix and shown on a separate line.
   
   For example, `{{</* see-also page="design/interface/icons" */>}}` will show as seen here: {{< see-also page="design/interface/icons" >}}
   
   You can also make the callout say "Read More" with the `prefix` tag: `{{</* see-also prefix="Read More" page="design/interface/icons" */>}}`. This will show as seen here: {{< see-also page="design/interface/icons" prefix="Read More" >}} 
   
   A custom title and anchor can be provided as well. For example, `{{</* see-also page="design/interface/icons" title="Learn about the Icon Library" anchor="about-the-icon-library" */>}}`, will show as: {{< see-also page="design/interface/icons" title="Learn about the Icon Library" anchor="about-the-icon-library" >}}
   
   Please use `see-also` when referencing _related topics_ , as seen in [Workflows]({{< ref "building/workflows/workflows-overview" >}}), and use `read-more` when referencing the _same topic_ in more depth, as in the [Home Page]({{< ref "/" >}}).  

1. **Related Content**: Pages within the documentation site are often closely related, but are separated by the type of content. For instance, a topic may be described in the features, have an implementation guide, and have best practices in the design system. To make this linkage easier for documentation writers and readers, a "Related Content" section can be shown at the bottom of the page. Each page defines it's own related content as `relatedContent` in its front matter. For example, a page with the following front matter would have two pages shown as *Related Content*.
   ```
   ---
   title: Messaging
   relatedContent: >
    building/messaging/
    design/building/
    ---
   ``` 

### Avoid broken links
To avoid broken links always use `ref` or `relref` shortcodes for internal references with the full path for the page. Check out the [Hugo documentation for cross-references](https://gohugo.io/content-management/cross-references/) for more details.

For example,  `[Icon Library]({{</* relref "design/interface/icons" */>}})` yields "[Icon Library]({{% relref "design/interface/icons" %}})". Using the full path will avoid ambiguous references if a new page of the same is created. 

### Link paragraphs, not titles

Whether using `ref` ,`relref` or inline links, do not link a title:

| Do | Don't |
|---|---|
| ` Read more about [InnoDB here](https://en.wikipedia.org/wiki/InnoDB).` | `## [InnoDB here](https://en.wikipedia.org/wiki/InnoDB)` |
| `The [Icon Library]({{</* relref "design/interface/icons" */>}}) has many great icons.` | `## [Icon Library]({{</* relref "design/interface/icons" */>}})` |

## Formatting standards

### Use Markdown Notation

Documentation pages should be written in [Markdown notation](https://www.markdownguide.org/), and not contain HTML tags whenever possible.

| Style | Do | Don't |
|---|---|---|
| _italic_ | `_italic_` or `*italic*` | `<i>italic</i>` or `<em>bold</em>` |
| **bold** | `**bold**` | `<b>bold</b>` or `<strong>bold</strong>` |
| table | `|...|` using [markdown tables](https://www.markdownguide.org/extended-syntax/#tables) | `<table><tr><td>...</td></tr></table>` | 

### Tabular schedules

Displaying the occurrence of events over time in a workflow is often done using a table. To keep these consistent we recommend using the tabular schedule format.

For example, here is a sample vaccination schedules:

{{% schedule %}}
|| 6m | 12m | 18m | 2y | 2.5y | 3y | 3.5y | 4y | 4.5y | 5y |
|------------|--|--|--|--|--|--|--|--|--|--|
| Deworming  | |   | X | X | X | X |  | X | X | X |
| Vitamin A  | X | X | X | X | X | X | X | X | X | X |
{{% /schedule %}}


To achieve this use a markdown table with the letter X (`X`) to mark events, leaving cells empty when no action is needed. The shortcode `{{%/* schedule */%}}` is used before and after the markdown table so that built-in styling can be applied. Here is the code for the above example:

```markdown
{{%/* schedule */%}}
|| 6m | 12m | 18m | 2y | 2.5y | 3y | 3.5y | 4y | 4.5y | 5y |
|------------|--|--|--|--|--|--|--|--|--|--|
| Deworming  | |   | X | X | X | X |  | X | X | X |
| Vitamin A  | X | X | X | X | X | X | X | X | X | X |
{{%/* /schedule */%}}
```

{{% alert title="Note" %}}
The opening `{{%/* schedule */%}}` and closing  `{{%/* /schedule */%}}` shortcode must come before and after the  markdown table respectively in order for it to correctly style the table
{{% /alert %}}

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
| The _keys_ in `.properties` files are referred to as _terms_. | The "keys" in .properties files are referred to as **terms**. |

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

### Number formatting
Avoid the use of comma or period as thousands separator since it can be confused for a decimal point in some countries. Either use no separator for small numbers or a unicode _Thin Space_ which is often [recommended for international documents](https://en.wikipedia.org/wiki/Decimal_separator#Digit_grouping).

There's a shortcode `format-number` which will replace `_` with _Thin Space_ to simplify formatting in this way.

| Do                                    | Don't   |
|---------------------------------------|---------|
| `{{</* format-number 10_000 */>}}`    | 10,000  |
| `{{</* format-number 10_000 */>}}`    | 10.000  |
| `{{</* format-number 1_000_000 */>}}` | 1000000 |

### Notes and tips

Make notes and tips stand out by using blockquote styling.

{{% alert title="Note" %}}
This is a sample note.
{{% /alert %}}

`{{%/* alert title="Note" %}} 
This is a sample note.
{{% /alert */%}}`

### Page descriptions

Page descriptions show on index pages, and at the top of the individual pages.

Use active and concise language in page descriptions.

| Do | Don't |
|---|---|
|Best practices for configuring CHT Applications|This document covers the configuration best practices of forms, tasks, targets, and contact profiles when building your own community health app|

Use sentence case and no punctuation. Avoid multiple sentences.

| Do | Don't |
|---|---|
|Best practices for configuring CHT Applications|Best Practices For Configuring CHT Applications|
|Developing and delivering world-class software|Developing and delivering world-class software.|
|The central users of CHT Applications|CHWs are the central users of apps built with the Core Framework. CHWs conduct household visits and are responsible for the health of their community.|

### Images

The [image markdown syntax](https://www.markdownguide.org/basic-syntax/#images-1) can be used for images, but if any styling is required use the built-in `figure` shortcode. With the `figure` shortcode [many fields are configurable](https://gohugo.io/content-management/shortcodes/#figure), and the position and size can be responsive with [Bootstrap grid classes](https://getbootstrap.com/docs/4.0/layout/grid/#responsive-classes). You should avoid using the HTML `img` tag in the documentation.

| Do | Don't |
|---|---|
| `{{</* figure src="image.png" class="right col-6 col-lg-3" */>}}` | `<img src="image.png" width="30%" align="right">` |
| `{{</* figure src="image.png" class="right col-6 col-lg-3" */>}}` | `<img src="image.png" style="width:30%; align:right;">` |

It is good practice for the image to link to the image file so that a larger version can be viewed easily. This can be done using the `link` attribute with the `figure` shortcode, which is less error prone than adding a link to the markdown image notation.

| Do | Don't |
|---|---|
| `{{</* figure src="image.png" link="image.png" alt="Alt text" title="Image Title" */>}}` | `[![Alt text](image.png "Image Title")](image.png)` |

### Indicating location of items on the screen

| Do | Don't |
|---|---|
|right-hand side|right hand side|
|left-hand|left hand|

### Where to place your images

To ensure your images are loaded on the docsite in the right format,place them in a folder that is named similar to your .md file. For example in the scenario below, the image is linked in the style-guide.md file, thus it is placed in the style-guide folder.
{{< figure src="where-to-place-images.png" link="where-to-place-images.png" >}}

### Videos

When embedding videos, use the `youtube` shortcode to embed a responsive YouTube video player. 

Copy the YouTube video ID that follows `v=` in the video’s URL and pass it to the `youtube` shortcode. For instance, with `https://www.youtube.com/watch?v=pFEFIY_SA7M` the shortcode would be:

`{{</* youtube pFEFIY_SA7M */>}}`

And would display as seen here:

{{< youtube pFEFIY_SA7M >}}

## Inline code formatting

### Code style for inline code and commands

For inline code in an HTML document, use the ``` tag. In a Markdown
document, use the backtick (`).

| Do | Don't |
|---|---|
| The `npm run build-dev-watch` command builds and deploys the webapp. | The "npm run build-dev-watch" command creates a Deployment. |
| To upload the configuration from your current directory, use `cht --local`. | To upload the configuration from your current directory, use "cht --local". |
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
