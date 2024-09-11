---
title: "Securely onboarding users at scale"
linkTitle: "Securely Onboarding Users"
weight:
description: >
    How to securely create users, handle password changes and password breaches
relatedContent: >
    building/guides/training/onboarding
    building/guides/database/couchdb-authentication
    building/tutorials/contact-and-users-1
    building/guides/data/users-bulk-load
    building/concepts/users
    building/concepts/access/#magic-links-for-logging-in-token-login

---

{{% pageinfo %}}
This document shows how to achieve a high level of credential management security for a CHT deployment. Implementers need to know when ease of use is more important than a more secure system. By reading this document you should be able to know when to make the "more secure" vs "easier to use" trade off. 

No system is perfectly secure - be prepared to remediate a security breach!
{{% /pageinfo %}}

When a CHT deployment will support hundreds of users or more, secure credential management becomes critical. Patient data is sensitive and should never be accessed in any way by unauthorized parties. By following best practices and preparing for the worst case scenario of a password breach, patient data can be kept safe and CHWs can be kept online and able to deliver care.

## Before starting

### Secure devices

Firstly, ensure that the CHWs' devices are secure: they all employ disk encryption and require a password or PIN to unlock and use. Please see our [Securing Android Devices document]({{% ref "building/guides/security/securing-android" %}}) for more information. As well, an [MDM]({{% ref "building/guides/android/publishing#mobile-device-management" %}}) may be used to enforce disk encryption and device unlock protocols.

### Secure administrative users

CHT administrators have the ability to create and delete users and push new configurations to the CHT so they should take extra precautions in managing their password. They should use a [strong passphrase](https://en.wikipedia.org/wiki/Passphrase) (instead of a password) that is unique to their CHT login. They should use a [password manager](https://en.wikipedia.org/wiki/Password_manager) to store this passphrase.
By following these steps, unauthorized people are less likely to be able to access administrator accounts.

### Secure passwords

When generating passwords for CHWs, do not use a formula which repeats itself (eg `password123` for user A, `password234` for user B etc.).  Do not use the CHW information such as username, email or phone number in the password. Train CHWs to not re-use passwords. 

For a reference application showing secure password generation, please see `generatePassword()` in the [CHT Core scripts directory](https://github.com/medic/cht-core/blob/master/scripts/bulk-password-update-export.js). This will generate a truly random 14 character password with uppercase (`A-Z`), lowercase (`a-z`), numerical (`0-9`) and one special character (`-`).  

To generate a password that is easier to remember, type and speak over a phone, consider using [Diceware passphrases](https://en.wikipedia.org/wiki/Diceware). For added accessibility, use a word list from the CHWs native language if it is not English.  This will make the words easier to spell and more likely to be remembered, but still secure.
## Spreadsheet use

Most deployments manage users in a spreadsheet shared either in Google Docs or other cloud service. It is convenient to have a canonical shared location to access the data. This is an acceptable, but not ideal, solution as it ensures changes are instantly shared while still ensuring a number of key security requirements. For an ideal solution, see ["Ideal" below](#ideal-practice-1-only-magic-links).

Of paramount importance:

* **Never** enable anonymous access to the URL for the spreadsheet. You **must always require authentication** to access user credential lists
* Audit regularly who has access to the shared spreadsheet. Consider setting up an alert every time a new person is granted access
* Reduce the total number of users that need access by breaking up user lists by logical group. For example, each sub-county could have its own user spreadsheet. That way the user credentials are only shared with the local administrators who need it
* Refrain from printing spreadsheets of users and passwords. They can be lost, stolen or easily photographed when shown in public
* If you ever need to download a plaintext CSV with username and password, ensure the computer also has disk encryption enabled and requires a password to unlock
* Do not keep downloaded CSV plaintext copies of credentials. Instead, delete and re-download them from the authorized, authenticated cloud server as needed

## Transmitting credentials

When it comes time get a username and password onto a device or to a remote user, be sure to use mediums that are secure. One of the main concerns is credentials being found long after they were sent.
* A best practice is for the sender to add a credential to a shared password manager.  The person receiving the credentials can then securely open the password manager. 
* If no password manager is available, consider sending the password via [One Time Secret](https://onetimesecret.com/)
* To send credentials in to many CHWs, consider using [token login]({{% ref "building/concepts/access#magic-links-for-logging-in-token-login" %}}).
* For sending large lists of credentials, as mentioned above, using a cloud provider like Google Sheets, is a good way to have an audit trail and still provide easy, remote access.

## Example scenarios

### Ideal practice 1: Only Magic Links

Create a spreadsheet with all your users' data. Included is a username but NOT a password. When users are created in bulk via [the command line]({{% ref "building/guides/data/csv-to-docs#creating-csv-files-for-users" %}}) or [bulk user upload]({{% ref "building/guides/data/users-bulk-load" %}}), have a [token login]({{% ref "building/concepts/access#magic-links-for-logging-in-token-login" %}}) sent to the user via an SMS gateway. This avoids the problem of passwords being stored in clear text in the spreadsheet or on a printed version. The token login links can only be used once and are only valid for 24 hours.

### Ideal practice 2: Unknown passwords, reset during provision

An alternate and also secure approach, is to bulk create the users as described above, not use magic links, and use random passwords that you do not save after giving users the credentials. Train the users on changing their password after they've logged in for the first time. This makes it harder for a password to be leaked because the password list isn't kept.  Additionally, as users are trained to change their password, a leaked list is likely not useful as all passwords have changed.

### Acceptable practice: Shared list, limited access, unique passwords

For deployments that are centrally provisioning devices, it is acceptable for generate a [strong password](#secure-passwords) per user in a centrally accessible, [secure spreadsheet](#spreadsheet-use).  Working off a computer to view the spreadsheet, provision each device. Do not to print the list of credentials. 

### Worst practice: Shared list, anonymous access, similar passwords

Create all users with near identical passwords (eg `password123`, `passord234`, `password345` etc.) that are then printed out, shared via email or posted to a public URL which requires no authentication. Send an SMS to the CHW with username, password and URL of the device.

There's many failures here:
* Passwords are predictable and easy to guess
* Credential lists are shared too widely
* Users will have their credentials in SMS which may be easily discovered weeks or months later by an unauthorized party

## Remediation of security failure

By knowing what the security threats are you can know the most helpful steps to remediate them to limit the damage done to the CHT deployment, the privacy of the patients and the security of CHWs.

{{% alert title="Note" %}}
Users who have their password changed can continue to use the CHT to deliver care.  They need to _keep their device offline_ though. After a password change, when a CHW attempts to sync, they will be prompted to log in. At that point, they will not be able to continue using the CHT until they log in.
No data will be lost if they log in as the _same user_.
{{% /alert %}}

### Credential list shared on internet

If an online list of credentials is leaked to unauthorized parties, or worse, the Internet at large in the form of being indexed by a search engine, you need to change all passwords as soon as possible for any user on the leaked list. Per the note above, changing a password will log the user out immediately unless they are offline.  Having supervisors encourage a user to switch their device to offline mode (turn off all data) is a good way to ensure they can continue to deliver care so they're not locked out.
### Programmatic password reset

Medic [has published a script](https://github.com/medic/cht-core/blob/master/scripts/bulk-password-update-export.js) to easily change all passwords for a list of users.  Administrators will then be responsible to log CHWs back in by [securely sending](#transmitting-credentials) them their password. 

Additionally, this script could be updated to immediately send a [token login]({{% ref "building/concepts/access#magic-links-for-logging-in-token-login" %}}) link to the user.  There would be no need to change the password as this is done automatically for you.  Note that users would need their phone numbers recorded in the CHT to receive a token login link. Here's an example `curl` command to send a token login link for the `mary` user:
```shell
curl https://medic:password@cht.example.com/api/v1/users/mary \
    -X POST -H "Content-Type: application/json" \
    -d '{"token_login":true}'
```

### Audit who has changed their password

If you have instructed all users to manually change their password, CHT administrators can search their server logs to see which users have made the update.  First find a list of all running services that have the word `haproxy` in it:

```shell
docker ps --filter "name=haproxy" --format '{{.Names}}'
```

Then, assuming your service is called `cht_haproxy_1`, run this command to find all password changes in the past 24 hours:

```shell
docker logs cht_haproxy_1 --since 24h 2>&1  | grep password_scheme
```


Here is an example event showing user `mary` having changed their password on Feb 9 18:47:

`
Feb  9 18:47:08 haproxy[12]: 172.22.0.2,couchdb,201,15,0,0,PUT,/_users/org.couchdb.user%3Amary,api,medic,'{"_id":"org.couchdb.user:mary","_rev":"3-d3dd14f3026942245ce3881adfcd513e","name":"mary","type":"user","roles":["chw"],"facility_id":"14046008-f796-4418-9ff2-12c2ef77b478","password_scheme":"***","iterations":10,"derived_key":"f846a7a20209592c613c09ea4405170735c7a557","salt":"bbb089e5fc459c2ca1088c8316e0cc99","password":"***"}',411,15,86,'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)'
`

## Frequently Asked Questions

- [Best practices for user management at scale?](https://forum.communityhealthtoolkit.org/t/best-practices-for-user-management-at-scale/1668/1)
- [Is it possible to send Magic Link to users using their own mobile bundles instead of setting up a messaging gateway?](https://forum.communityhealthtoolkit.org/t/send-magic-link-via-mobile-bundle/2760/2)
