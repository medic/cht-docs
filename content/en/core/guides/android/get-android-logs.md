---
title: "Get Android Logs"
linkTitle: "Get Android Logs"
weight: 2
description: >
  Notes for getting logs using ADB
---

With Android 4.1 (aka Jelly Bean) and upwards the full system log is only visible if you have root.  
To get logs, you have to use `adb logcat` via a computer.

To **install** the `adb` command follow the instructions under the [Development Environment > Debug tool adb]({{< ref "core/guides/android/development-setup#debug-tool-adb" >}}) section.

## Configure on-device USB debugging

If you trying to get the logs from a device for the first time, follow these steps:


1. Enable USB debugging on your phone. This varies from phone to phone, checkout how to do it from the official Android [documentation](https://developer.android.com/studio/debug/dev-options#enable).

2. Connect your phone by USB to the computer.

3. You will see a popup _"Allow USB debugging. The computer's RSA fingerprint..."_, click _"OK"_. If you don't see the popup when the cable is plugged in, you will see it after the next step.

   ![Allow USB debugging](allow_usb_debugging.png)

4. Within a command line session write the following command: `adb start-server`.

5. To check if your phone is properly connected, write the command `adb devices`. This will list the devices connected. Something like: 

   ![ADB Devices](adb_devices.png)

All set to get the logs!


## Get the logs

Once the device is configured following the steps above, follow up with the command `adb logcat > phone.log` to get the android logs in the file `phone.log`. You can stop the recording at any time pressing _Ctrl+C_.

Now while taking android logs is the time to try to reproduce the error. 
Check some of the messages that are 'WAITING' and click retry. Do this for as many times as you deem necessary to capture logs for that event.

You can also get the same logs with **Android Studio**. The steps to connect the phone for the first time are the same, but then you can just open Android Studio with the phone connected and checkout the _Logcat_ tab.

### Get only the app logs

Either if you get the logs from `adb` or Android Studio you will notice that all the logs from all the apps and the Android OS are recorded, but there are ways to filter the content to only from the app we are trying to debug.

If the app ins **CHT Android**, within a command line session go to the project source code folder, and execute:

```
$ make logs
```

The logs will be shown in the console, and stored in the `android.log` file.

At the beginning of the execution you will notice that the `adb` command is executed and the content is filter with the following argument: `MedicMobile:V AndroidRuntime:E '*:S'`. If that doesn't work, try to execute:

```
$ adb logcat MedicMobile:V AndroidRuntime:E chromium:V '*:S'
```

Or a simpler solution could be get all the logs and filter with `grep`:

```
$ adb logcat | grep MedicMobile
```

To get more specific logs you can use other expressions in the `grep` command as well.