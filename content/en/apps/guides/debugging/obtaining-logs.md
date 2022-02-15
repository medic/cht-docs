---
title: "Obtaining Logs"
linkTitle: "Obtaining Logs"
weight:
description: >
  How to obtain server and client logs
relatedContent: >

---

There are many places where useful logs reside. This details all those places, and the easiest way to get a hold of them.

## Client logs

### On a laptop or desktop

To check if there are relevant logs open up the developer console in your browser. The shortcut is probably COMMAND+OPTION+I on MacOS, or CTRL+SHIFT+I on Linux and Windows. Click the console tab and copy out any errors or logging that you think is relevant.

### On a phone

There are two types of logs updated by Android devices depending on what information is needed. If you trying to get either of the logs from a device for the first time you need to set it up for USB debugging.

1. Enable USB debugging on the phone. This varies from phone to phone, but here is the [official Android documentation](https://developer.android.com/studio/debug/dev-options#enable).
2. Connect your phone by USB to the computer.
3. You will see a popup _"Allow USB debugging. The computer's RSA fingerprint..."_, click _"OK"_. If you don't see the popup when the cable is plugged in, you will see it after the next step.

   ![Allow USB debugging](/apps/guides/debugging/images/allow_usb_debugging.png)

#### Browser logs

Now that you've enabled USB debugging on the phone you can access the dev console on the phone via USB from your desktop browser. This allows the same level of debugging and inspection you have on a desktop browser, but from your phone's browser in the CHT app. Follow the [official Android documentation](https://developer.chrome.com/docs/devtools/remote-debugging/webviews/#open_a_webview_in_devtools) to access the console.

#### Android logs

The Android log is written to from the cht-android wrapper which can be useful to debug application crashes or failing integrations between apps.

1. To install the `adb` command, follow the instructions under the [Development Environment > Debug tool adb]({{< ref "core/guides/android/development-setup#debug-tool-adb" >}}) section.
2. Within a command line session, write the following command: `adb start-server`.
3. To check if your phone is properly connected, write the command `adb devices`. This will list the devices connected.

   ![ADB Devices](/apps/guides/debugging/images/adb_devices.png)

4. Type the command `adb logcat > phone.log` to get the android logs in the file `phone.log`. You can stop the recording at any time pressing _Ctrl+C_. Now while taking android logs is the time to try to reproduce the error. Do this for as many times as you deem necessary to capture logs for that event.

This will get all the logs from the device, not just logs for the app you want to debug. You can pass arguments to `adb` to only get the logs you want.

```sh
$ adb logcat MedicMobile:V AndroidRuntime:E chromium:V '*:S' > phone.log
```

Alternatively you can use `grep` to filter the logs down to only those from the relevant app.

```sh
$ adb logcat | grep MedicMobile > phone.log
```

### On the server

Some unexpected errors are caught and stored in `feedback` docs and stored on the phone and later synced to CouchDB on the server. To access these, look for docs in the `medic-user-{username}-meta` or `medic-users-meta` databases. This is particularly useful to debug issues where you do not have physical access to the device. More information is available under [Managing Databases]({{< relref "apps/guides/database" >}}).

## Server logs

To access the server logs you will need access to the server.
