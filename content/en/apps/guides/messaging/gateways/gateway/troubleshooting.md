---
title: "Troubleshooting"
linkTitle: "Troubleshooting"
weight: 90
description: >
  Guide to troubleshooting Gateway problems
aliases:
  -    /apps/guides/messaging/gateway/troubleshooting
relatedContent: >
  apps/guides/messaging/gateways/gateway/phones
  apps/guides/messaging/gateways/gateway/configuration
---

In a techlead heaven, we would have immeadiate physical access to gateway phones, but alas, most of the time we have to hand them over to the partner. Fortunately, comes this guide on debugging gateway problems.

Follow the steps as below (if you don't have physical access to the phone, start with step 2 i.e debug from the server side first)

1. Make sure that the device:

	1. Is connected to the internet. You can check this by opening any Browser app in the phone and going to `https://google.com`.
	2. Check if the instance name, instance type and `gateway` user password are set correctly in the Gateway `Settings` app screen.

        ![Settings Screen](settings_screen.png)

	3. Has the latest Gateway version. Get the latest version by opening the Google Playstore, searching for `Medic Gateway` and updating the existing app

	4. Medic Gatway should be set as the default app for SMS. To check, go to `Settings` in the Gateway app. If Medic Gateway is not the default, you will be met with the below app screen. In that case, click `Help me change`.

        ![Not Default](not_default.png)

	5. If messages are not going through to the server, in the `To Webapp`  tab, select some of them and press `Retry` at the bottom and wait for about 5-10 minutes.

	6. If messages are not going through to the users, in the `From Webapp`  tab, select some of them and press `Retry` at the bottom and wait for about 5-10 minutes.

	7. In CDMA networks, there are operator issues where messages get to the users in chunks of around 160 characters when the message is too long. If this is the case, go to `Settings` in the gateway screen and make sure you tick `CDMA compatibility mode`

	8. Check if the phone has adequate free space

	9. Restart the phone if no solution seems to work. Resetting the Adroind state sometimes resolves some persistent problems

2.  When attacking the problem from the phones end does not work, move on to the server and try to solve it from there. Maybe the server has a configuration issue which hinders the processing or the acceptance of the messages by `Medic-Api`
Follow the steps:
	1. Navigate to `/srv/storage/gardener/logs/ `
	1. Perform `ls -lt` to arrange the log files in order of modified date. Note the concerned file which was last modified on the date you are investigating
	1. Pipe it to grep to get only SMS logs e.g `grep api/sms medic_medic_medic-api4.log`. As below, note the errors and work from there.
```
cd /srv/storage/gardener/logs/
ls -lt
grep api/sms medic_medic_medic-api4.log
```
If the above steps don't yield the problem, read the [Obtaining Logs]({{< ref "apps/guides/debugging/obtaining-logs#android-logs" >}}) page, note the make/model/android version their gateway handset is and escalate with those details to the PM/project techlead.

**Verifying the SMS Gateway via a Test Message**

We can verify whether the SMS Gateway app is responding by sending a test message via the web app. For example, let us try this in a deployed project.
1. Login via the web app.

![image](https://user-images.githubusercontent.com/3299006/175019916-2319fd9d-fbd3-4dea-9a2e-580b5aca559d.png)

2. Goto App Management.

![image](https://user-images.githubusercontent.com/3299006/175015115-d3cc84c9-937b-453f-b2b0-97e7122cb211.png)

3. Click on SMS option, then click the Test Message tab.

![image](https://user-images.githubusercontent.com/3299006/175015577-e546c897-555c-46c7-b77f-131f12baa669.png)

4. The Gateway replies with the status message on the phone number we input in the "From phone number" field. So please input the test message and a valid phone number where you expect to view the status message and press the "Send message" button. We should see the Report Submitted message if the SMS was enqueued to be sent.
![image](https://user-images.githubusercontent.com/3299006/175016759-d59a9097-afc0-4123-ae27-3bad76ddd969.png)
5. If the message was recieved by the gateway we sohuld see the message in the "Messages" tab in the app and get an auto reply on the number we provided in step 4.

	i.  Message Acknowledgement in the web app
![image](https://user-images.githubusercontent.com/3299006/175017321-21b01ae2-bf23-4330-9713-08efddf9d51e.png)

	ii. Message acknowledgement reply to the phone.
![image](https://user-images.githubusercontent.com/3299006/175025457-f4baf20d-07ae-4ace-8b10-92e41d409fe2.png)

6. If you see the message acknowledgement it means the Gateway is working as expected.

{{% alert title="Note" %}}
Insist on screenshots even for the most trivial things that partners insist they have performed as you asked. They are also good for giving you a mental image of what is happenning on the phone remotely.
{{% /alert %}}



