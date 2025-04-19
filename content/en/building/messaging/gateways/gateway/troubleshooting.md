---
title: "Troubleshooting"
linkTitle: "Troubleshooting"
weight: 90
description: >
  Guide to troubleshooting Gateway problems
aliases:
  -    /apps/guides/messaging/gateways/gateway/troubleshooting
relatedContent: >
  building/messaging/gateways/gateway/phones
  building/messaging/gateways/gateway/configuration
---

In a techlead heaven, we would have immediate physical access to gateway phones, but alas, most of the time we have to hand them over to the partner. Fortunately, comes this guide on debugging gateway problems.

Follow the steps as below (if you don't have physical access to the phone, start with step 2 i.e debug from the server side first)

1. Make sure that the device:

	1. Is connected to the internet. You can check this by opening any Browser app in the phone and going to `https://google.com`.
	2. Check if the instance name, instance type and `gateway` user password are set correctly in the Gateway `Settings` app screen.

		{{< figure src="settings_screen.png" link="settings_screen.png" caption="Settings Screen" >}}

	3. Has the latest Gateway version. Get the latest version by opening the Google Play Store, searching for `Medic Gateway` and updating the existing app

	4. Medic Gateway should be set as the default app for SMS. To check, go to `Settings` in the Gateway app. If Medic Gateway is not the default, you will be met with the below app screen. In that case, click `Help me change`.
		{{< figure src="not_default.png" link="not_default.png" caption="Not Default" >}}

	5. If messages are not going through to the server, in the `To Webapp`  tab, select some of them and press `Retry` at the bottom and wait for about 5-10 minutes.

	6. If messages are not going through to the users, in the `From Webapp`  tab, select some of them and press `Retry` at the bottom and wait for about 5-10 minutes.

	7. In CDMA networks, there are operator issues where messages get to the users in chunks of around 160 characters when the message is too long. If this is the case, go to `Settings` in the gateway screen and make sure you tick `CDMA compatibility mode`

	8. Check if the phone has adequate free space

	9. Restart the phone if no solution seems to work. Resetting the Android state sometimes resolves some persistent problems

2.  When attacking the problem from the phones end does not work, move on to the server and try to solve it from there. Maybe the server has a configuration issue which hinders the processing or the acceptance of the messages by `Medic-Api`
Follow the steps:
	1. Navigate to `/srv/storage/gardener/logs/ `
	1. Perform `ls -lt` to arrange the log files in order of modified date. Note the concerned file which was last modified on the date you are investigating
	1. Pipe it to grep to get only SMS logs e.g `grep api/sms medic_medic_medic-api4.log`. As below, note the errors and work from there.

```shell
cd /srv/storage/gardener/logs/
ls -lt
grep api/sms medic_medic_medic-api4.log
```
If the above steps don't yield the problem, read the [Obtaining Logs]({{< ref "building/guides/debugging/obtaining-logs#android-logs" >}}) page, note the make/model/android version their gateway handset is and escalate with those details to the PM/project techlead.

**Verifying the SMS Gateway via a Test Message**

We can verify whether the SMS Gateway app is responding by sending a test message via the web app. For example, let us try this in a deployed project.
1. Log in via the web app with a user with administrative rights.

{{< figure src="log-in-page.png" link="log-in-page.png" caption="Log in page" >}}

2. Go to App Management.

{{< figure src="app-management-menu-item.png" link="app-management-menu-item.png" caption="App Management menu item" >}}

3. Click on SMS option, then click the Test Message tab.

{{< figure src="sms-menu-item.png" link="sms-menu-item.png" caption="SMS menu item" >}}

4. Test message creation and delivery to Gateway phone verification:
	1. Input the test message which will be sent to the Gateway and the phone number where we wish to see the Gateway's reply. Country code if not specified will be the default country code specified in SMS -> Default country code.
    {{< figure src="default-country-code.png" link="default-country-code.png" caption="Default country code setting" >}}

	2. The test message text doesn't matter here as we are just verifying if the Gateway phone receives messages from our server and responds correctly to it by sending us a message back in the phone number we input in step (i). The easiest way would be to input our own phone number in (i) and validate that the Gateway phone sends the response message to it.
	3. After inputting the number where you expect to view the response message, press the "Send message" button. 
	4. We should see the Report Submitted message if the SMS was successfully received by the Gateway phone.
    {{< figure src="report-submitted.png" link="report-submitted.png" caption="Report submitted" >}}

5. If the message was received by the Gateway we should see the message in the "Messages" tab in the app and get an auto-reply on the number we provided in step 4(i). We should be able to see the following acknowledgments in the web app and phone respectively.

	1. Message Acknowledgement in the web app in the messages tab.
    {{< figure src="messages-tab.png" link="messages-tab.png" caption="Message shown in Messages Tab" >}}

	2. Response sent acknowledgment in the Outgoing Messages -> Due tab. The recipient should be the number we input in 4(i) and the status should be delivered. 
    {{< figure src="outgoing-messages.png" link="outgoing-messages.png" caption="Outgoing Messages in App Management" >}}

	3. Message reply as seen on the phone of 4(i) from Gateway phone.
    {{< figure src="outgoing-messages.png" link="outgoing-messages.png" caption="Outgoing Messages in App Management" >}}

{{< figure src="sms-reply.png" link="sms-reply.png" caption="SMS reply shown on device" >}}

6. If you see the message acknowledgment it means the Gateway is working as expected.

> [!TIP]
> Insist on screenshots even for the most trivial things that partners insist they have performed as you asked. They are also good for giving you a mental image of what is happening on the phone remotely.



