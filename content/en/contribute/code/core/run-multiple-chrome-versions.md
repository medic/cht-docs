---
title: "Running multiple Chrome versions"
linkTitle: "Multiple Chrome versions"
weight: 16
description: >
  How to run multiple Chrome versions on your local machine
aliases: >
  /core/guides/multiple-chrome-versions
---

{{% alert title="Note" %}}
These steps are suitable for Mac. It was tested in a Mac Intel.  It can be adapted to any Chrome version.
{{% /alert %}}

Follow these steps on a Mac to run Chrome version 90 besides your actual up to date Chrome app.
- Download Chrome `90.0.4430.72` from [slimjet](https://www.slimjet.com/chrome/google-chrome-old-version.php?cmtx_sort=)
- Do not install the `Google Chrome.app` in your `Application` folder. Install it in your `Desktop` folder for example.
- Change the name of the app to `Google Chrome 90.app` and then move it to the `Application` folder, ***without*** overwritting your current Chrome
- Remove Chrome’s automatic updates by:
  - Right click on `Application/Google Chrome 90.app`
  - Click on `Show package content`
  - Open in the IDE the file `Contents/Info.plist`
  - Find the key `KSUpdateURL`
  - Replace the string below: <string>https://tools.google.com/service/update2</string> to <string>https://tools.google.com/[DUMMYTEXT]</string>
- Run `Google Chrome 90.app` as long as it’s the only one running
