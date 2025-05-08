---
title: "Running multiple Chrome versions"
linkTitle: "Multiple Chrome Versions"
weight: 16
aliases: >
  /core/guides/multiple-chrome-versions
  /contribute/code/core/run-multiple-chrome-versions
---

{{< hextra/hero-subtitle >}}
  How to run multiple Chrome versions on your local machine
{{< /hextra/hero-subtitle >}}

{{< callout  >}}
  These steps are suitable for Mac. They were tested in a Mac Intel. They can be adapted to any Chrome version.
{{< /callout >}}

Follow these steps on a Mac to run Chrome version 90 while having another Chrome app on a different version. 
- Download Chrome `90.0.4430.72` from [slimjet](https://www.slimjet.com/chrome/google-chrome-old-version.php?cmtx_sort=)
- Do not install the `Google Chrome.app` in your `Application` folder. Install it in your `Desktop` folder for example.
- Change the name of the app to `Google Chrome 90.app` and then move it to the `Application` folder, ***without*** overwriting your current Chrome
- Remove Chrome’s automatic updates by:
  - Close all Chrome open instances.
  - Open `Google Chrome 90.app` while not having Internet, so it doesn't give an error after modifying the `Info.plis`.
  - Right-click on `Application/Google Chrome 90.app`
  - Click on `Show package content`
  - Open the file `Contents/Info.plist` in your IDE 
  - Find the key `KSUpdateURL`
  - Replace the string below: <string>https://tools.google.com/service/update2</string> to <string>https://tools.google.com/[DUMMYTEXT]</string>
- Run `Google Chrome 90.app` as long as it’s the only one running
