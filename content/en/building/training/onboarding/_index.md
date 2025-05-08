---
title: "Onboarding Using a Training App"
linkTitle: "Onboarding"
weight: 1
description: >
   Best practices when using a Training App to keep training and production data apart
relatedContent: >
  building/branding/android/
  reference-apps/training/
aliases:
   - /building/guides/training/onboarding/
   - /apps/guides/training/onboarding/
---

When onboarding new users, having a dedicated CHT app and instance for training can be helpful; it allows new users to do training exercises with mock data to get familiar with the app, while not having the data from their training interfering with the future use of their CHT app. Different approaches are possible, such as only entering real patient data during training, or manually deleting all the training data, but these methods are less practical for large deployments.

> [!NOTE]
> The suggestions in this guide should be assessed and adapted as needed to benefit a deployment. It is important that users don't accidentally use the wrong app. The [troubleshooting guide]({{< relref "building/guides/data/training-instance" >}}) can help to monitor and remediate training data being in the production instance, or the opposite.

## Setting up a training app

A separate Android App can be created for training, which would point to a CHT instance dedicated to training. The training instance should have the same configuration as the production instance, and have users created for training. To differentiate the Android app used for training from the production one, create a duplicate of [your flavor]({{< relref "building/branding/android" >}}) and modify the following aspects
- **Border & Message**: Consider adding a distinctive border and message when using the training app. This can be done by setting the build config field `IS_TRAINING_APP` to `true`, as seen in [`build.gradle`](https://github.com/medic/cht-android/blob/8d077ed08dc3889ef1f4e3bad7231931bca55d87/build.gradle#L212-L216) for the training version of the Gamma app.
- **CHT Instance**: In your flavor's `res/values/strings.xml` file set the `app_host` string to be the URL of your training instance, as seen in the [Gamma Training app](https://github.com/medic/cht-android/blob/8d077ed08dc3889ef1f4e3bad7231931bca55d87/src/medicmobilegamma_training/res/values/strings.xml#L3). If left the same as the production app both training and production data will end up in your production instance.
- **Launcher icons**: Consider using completely different icons, or at least change the color of the launcher icons.
- **App name**: Provide a noticeably different name to the training app. Since app names are often cut short on Android devices, make the change at beginning of the text. For example, `CHW App [TRAINING VERSION]` may display as `CHW App...` so it would be better to use `[TRAINING] CHW App`. The app name is set in the flavor's `res/values/strings.xml` file, as seen in [the Gamma training app](https://github.com/medic/cht-android/blob/8d077ed08dc3889ef1f4e3bad7231931bca55d87/src/medicmobilegamma_training/res/values/strings.xml#L4).
- **App ID**: If you want to allow both apps to be on a device at once you will need to make sure your training app has a different `applicationId`, as seen [in `build.gradle` for the Gamma training app](https://github.com/medic/cht-android/blob/8d077ed08dc3889ef1f4e3bad7231931bca55d87/build.gradle#L214).

{{< cards >}}
  {{< figure src="training-app.png" link="training-app.png" alt="CHT training app with border and message" class="right col-6 col-lg-4" >}}
{{< /cards >}}
 
> [!NOTE]
> Keeping the `applicationId` values the same will make it impossible to have both the training and production apps installed at the same time on a device. If you have a way to install the production app after the training is complete then you may choose to do this to prevent users from using the wrong app.

## Switching from training to production app

To avoid having production data in the training app, it is encouraged to **remove** the training app from the device once training is complete.

If the production app can always be installed after the use of the training is complete, then using the same `applicationId` guarantees that only one of the apps is installed at any given time.

Changing passwords for the training users in an attempt to lock them out is not recommended. In some circumstances a user would be able to continue to use the training app for production use and not have the data sync back to the server.

It is preferable to remove the training app from devices, and [monitor the training instance for unexpected activity]({{< relref "building/guides/data/training-instance" >}}) that can be brought over to the production instance if needed.
