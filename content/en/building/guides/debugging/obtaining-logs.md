---
title: "Obtaining Browser and Phone Logs"
linkTitle: "Browser and Phone Logs"
weight:
description: >
  How to obtain Android and browser client logs
relatedContent: >
  building/guides/debugging/sharing-4x-logs.md
  hosting/4.x/production/docker/logs
aliases:
   - /apps/guides/debugging/obtaining-logs
---

There are many places where useful logs reside. This details all those places, and the easiest way to get a hold of them.

## On a laptop or desktop

To check if there are relevant logs open up the developer console in your browser. The shortcut is probably COMMAND+OPTION+I on MacOS, or CTRL+SHIFT+I on Linux and Windows. Click the console tab and copy out any errors or logging that you think is relevant.

## On a phone

There are two types of logs updated by Android devices depending on what information is needed. If you trying to get either of the logs from a device for the first time you need to set it up for USB debugging.

1. Enable USB debugging on the phone. This varies from phone to phone, but here is the [official Android documentation](https://developer.android.com/studio/debug/dev-options#enable).
2. Connect your phone by USB to the computer.
3. On your phone, you will see a popup _"Allow USB debugging. The computer's RSA fingerprint..."_, click _"OK"_.

   ![Allow USB debugging](/building/guides/debugging/images/allow_usb_debugging.png)

### Browser logs

Now that you've enabled USB debugging on the phone you can access the dev console on the phone via USB from your desktop browser. This allows the same level of debugging and inspection you have on a desktop browser, but from your phone's browser in the CHT app. Follow the [official Android documentation](https://developer.chrome.com/docs/devtools/remote-debugging/webviews/#open_a_webview_in_devtools) to access the console.

### Android logs

The Android log is written to from the cht-android wrapper which captures errors like application crashes or failing integrations between Android apps.

1. To install the `adb` command, follow the instructions under the [Development Environment > Debug tool adb]({{< ref "community/code/android/development-setup#debug-tool-adb" >}}) section.
2. Within a command line session, write the following command: `adb start-server`.
3. To check if your phone is properly connected, write the command `adb devices`. This will list the devices connected.

   ![ADB Devices](/building/guides/debugging/images/adb_devices.png)

4. Type the command `adb logcat > phone.log` to get the android logs in the file `phone.log`. The log will be written to the `phone.log` file as long as this command is running. You can stop the recording at any time pressing _Ctrl+C_. Now if you reproduce the error on the phone you can look for any useful information being written to the `phone.log`.

This will get all the logs from the device, not just logs for the app you want to debug. You can pass arguments to `adb` to only get the logs you want.

```sh
adb logcat MedicMobile:V AndroidRuntime:E chromium:V '*:S' > phone.log
```

Alternatively you can use `grep` to filter the logs down to only those from the relevant app.

```sh
adb logcat | grep MedicMobile > phone.log
```

## On the server

Some unexpected errors are caught and stored in `feedback` docs and stored on the phone and later synced to CouchDB on the server. To access these, look for docs in the `medic-user-{username}-meta` or `medic-users-meta` databases. This is particularly useful to debug issues where you do not have physical access to the device. More information is available under [Managing Databases]({{< relref "building/guides/database" >}}).
