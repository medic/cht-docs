---
title: "extension-libs/"
linkTitle: "extension-libs/"
weight: 5
description: >
  Used for providing custom scripts for execution in CHT apps
keywords: extension libs extensibility
aliases:
   - /apps/reference/extension-libs
----

_Introduced in v4.2.0_

## Introduction

Extension libraries are blocks of code that are cached with the CHT web application giving app developers a powerful tool to extend the CHT. This is an advanced feature and requires an app developer with some software development experience.

An example of a use for this feature is to provide a function to calculate a risk score based on a machine learning model. The function can then be called passing in values from app forms and return the result to be stored with the report.

### Library

The first step is to create the js file to return the function that will be called by the web application. Create a new file using this template:

```js
module.exports = function(/* parameters */) {
  return result;
}
```

Now populate the function as needed. For complex functions, it is recommended to use third party libraries (such as momentjs, lodash, etc) and use a bundler (eg: [webpack](https://webpack.js.org/)) to make it easy to build a single file. It's recommended to use development best practices such as linting, unit tests, and minification to ensure quality and small download size.

#### xpath functions

To call the function from within a form the parameters and return value will need to have a very specific structure to work with Enketo xforms.

```json
{
  "t": <type>,
  "v": <value>
}
```

Where the type is one of "bool", "num", "str", "date", or "arr". For example, to calculate the average of two inputs, you would use:

```js
const getValue = function(obj) {
  let val;
  if (obj.t === 'arr') {
    val = obj.v && obj.v.length && obj.v[0];
  } else {
    val = obj.v;
  }
  if (!val) {
    return 0;
  }
  const parsed = parseInt(val.textContent);
  return isNaN(parsed) ? 0 : parsed;
};

module.exports = function(first, second) {
  const average = (getValue(first) + getValue(second)) / 2;
  return {
    t: 'num',
    v: average
  };
}
```

### Uploading to the CHT

Create a folder within the project configuration to contain the libraries, for example:

```
./extension-libs
    average.js
    calculate-risk-score.js
```

Now run the command: `cht upload-extension-libs`

This will create or update a document to CouchDB with an ID of `extension-libs` with each of the configured scripts attached. Once this is created the webapp service worker will be updated so the libraries are cached on the phone ready for use offline.

### Invoking the function

#### CHT API

The function will now be available via the CHT API for [tasks]({{< ref "tasks" >}}), [targets]({{< ref "targets" >}}), and [contact summary]({{< ref "contact-page" >}}) configurations.

#### CHT xPath functions

To execute the function from within an xform use the [`cht:extension-lib` xpath function]({{< ref "forms/app#chtextension-lib" >}}).
