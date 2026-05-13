---
title: "ui-extensions"
linkTitle: "ui-extensions"
weight: 5
description: Custom user interfaces 
keywords: extension UI extensibility user interface web component
---

_Introduced in v5.2.0_

## Introduction

UI Extensions are [custom web components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) that can extend the functionality/content of the CHT web application. This is an advanced feature and requires an app developer with some software development experience.

An example of a use for this feature is TODO

### Types

Currently there are two supported types of UI Extensions.

#### Header tab extensions

Extensions with the `header_tab` type are included in the webapp interface as a new top-level tab (along with "People", "Tasks", etc).

TODO Talk about how properties are used.

The `weight` property helps determine the ordering of the UI Extensions in relation to the other visible [header tabs](/building/reference/app-settings/header_tabs/).

#### Sidebar tab extensions

Extensions with the `sidebar_tab` type are included in the webapp interface as new tabs available from the sidebar menu (along with "Training Materials", "About", etc).

## Building

The configuration for a UI Extension consists of a JavaScript file which exports a `class` extending `HTMLElement` and a `properties.json` file containing the configuration for the extension. These files should be added into the `/ui-extensions` directory in the project's config directory. 

```
- config
  - ui-extensions
    - my-extension.js
    - my-extension.properties.json
```

### Web component class

The extension JavaScript file must export a `class` that extends `HTMLElement`. This class represents the custom web component that will be available to the user in the webapp. The functionality that can be included in this web component is essentially limitless. Additionally, a number of resources are provided to the web component allowing for better integration with the CHT data model.

#### Constructor

The `constructor` of the class is called when the element is created, but before it is inserted on the DOM. It can be used to do any initialization that does not require access to the DOM or other external context. This is a good place to attach the [shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components#shadow_dom_2) to properly insulate the web component from the rest of the web app.

```js
constructor() {
  super();
  this.attachShadow({ mode: 'open' });
}
```

#### `connectedCallback()`

The `connectedCallback()` method is called when the element is added to the DOM. This is a good place to finalize the component initialization (set up event listeners, fetch data, render content, etc).  

This basic example demonstrates how HTML and CSS for the component can be set:

```js
connectedCallback() {
  this.shadowRoot.innerHTML = `
      <style>
        h1 {
          color: blue;
        }
      </style>
      <h1>Hello World</h1>
    `;
}
```

#### Input data

Input data is available to the component logic in the `this.inputs` root level property.

| Property             | Description                                                                                                                             |
|----------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| `userContactSummary` | The [contact-summary context](/building/contact-summary/contact-summary-templated/) for the contact associated with the logged in user. | 
| `config`             | Optional. This object will contain the data loaded from `config` property of the UI Extension's `properties.json` file (if it exists).  |

#### CHT API

{{< read-content file="building/reference/_partial_cht_api.md" >}}

##### CHT Data model

The `cht` API can also be used to interact directly with the CHT data model to read/create/update data. See [the cht-datasource docs](https://docs.communityhealthtoolkit.org/cht-datasource/) for more details about the available functionality. 

### UI Extension Properties

The `.properties.json` file contains the configuration for each UI Extension.

| Property        | Required | Description                                                                                                                                                                                                                                                                    |
|-----------------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `type`          | Yes      | The type of the extension (`header_tab`, `sidebar_tab`).                                                                                                                                                                                                                       |
| `title`         | Yes      | The translation key for the title of the UI Extension.                                                                                                                                                                                                                         |
| `roles`         |          | An array of [user role names](/building/reference/app-settings/user-roles/) that have access to the extension. Only users with one (or more) of the specified roles will be able to access the extension. If no `roles` are set, the extension will be available to all users. |
| `icon`          |          | The FontAwesome class (beginning with `fa-`) to use as the extension icon. Must not be combined with `resource_icon`.                                                                                                                                                          |
| `resource_icon` |          | The [resources key](/building/branding/resources/) for the image to use as the extension icon. Must not be combined with `icon`.                                                                                                                                               |
| `accent_color`  |          | A [CSS color value](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Colors/Color_values) to use as the accent color for the extension.                                                                                                                                 |
| `weight`        |          | The numerical "weight" used to determine the extension ordering. Lower values come first.                                                                                                                                                                                      |
| `config`        |          | Custom object containing any properties that should be passed to the constructed web component via `this.inputs.config`.                                                                                                                                                       |

## Uploading/deleting UI Extensions

Use cht-conf to upload all configured UI Extensions:

```shell
cht --url=${COUCH_URL} upload-ui-extensions
```

Individual UI extensions can be uploaded by including their name when running the command. If you have a UI extension defined in `hello.js`/`hello.properties.json`, running this command will only upload that extension:

```shell
cht --url=${COUCH_URL} upload-ui-extensions -- hello
```

cht-conf can also be used to delete all UI Extensions from an instance:

```shell
cht --url=${COUCH_URL} delete-ui-extensions
```

Additionally, individual UI Extensions can be deleted by including their name when running the command:

```shell
cht --url=${COUCH_URL} delete-ui-extensions -- hello
```
