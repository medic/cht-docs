---
title: "Fixing E2E Tests"
linkTitle: "E2E Tests"
weight: 12
description: >
  Tips for fixing e2e tests
aliases: >
  /core/guides/fixing-e2e-tests
---

# How to fix e2e tests

End to end (e2e) tests can be really difficult to debug - sometimes they fail seemingly at random, and sometimes they only fail on certain environments (eg: ci but not locally). This can make reproducing and reliably fixing the issue challenging, so here are some tips to help!

## Read the logs

Read the failure carefully - it often has really good info but sometimes it's just hard to find. Most importantly it tells you exactly the line in the test that failed and you can look that up in the source to see what it was trying to do. The error message itself is also really useful. Also sometimes one error causes the next, so always start with the first test failure before looking at the others.

### Known failure patterns

- Can't click on an element because another element would get the click. This usually means a modal dialog was being shown. 90% of the time this is the update notification modal which means some settings change has been detected after the test started execution.
- Stale element. This means the DOM element has been removed after it was found on the page but before trying to do something with it. Generally try to find the element just before it needs it to reduce the chance of this happening

## Other logs and screenshots

There are logs and screenshots stored in the allure reports. [Here](https://github.com/medic/cht-core/blob/master/TESTING.md#view-the-ci-report) are the instructions to access that information.

## Running just the failing test

### Option 1

Running e2e tests can be quite slow so to save time modify the `specs` property of `/tests/e2e/**/wdio.conf.js` so it only finds your test. You can also change `describe` and `it` to `xdescribe` and `xit` to skip specific tests.

### Option 2

Alternatively you can run API in test mode using:

```
API_PORT=4988 COUCH_URL=http://admin:pass@localhost:5984/medic-test node server.js
```

Then grep for just the tests you want to run:

```
protractor /home/kenn/webapp/tests/e2e.tests.conf.js --specs='/home/kenn/webapp/tests/e2e/api/controllers/_changes.spec.js' --grep="should allow DB admins to POST to _changes"
```

## Watching the test run

Running the tests locally with `npm run wdio-local` or `npm run standard-wdio-local` will allow you to watch it run but if you interact with the page the test will fail in unexpected ways. Furthermore the browser will close after a short timeout so you won't be able to inspect the console or DOM. To do this, force quit the process running the test before it tears down and you will be able to navigate around the app, use Chrome dev tools, and inspect the docs in the database to (hopefully) work out what's going wrong.
