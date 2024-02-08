---
title: "Securely onboarding users at scale"
linkTitle: "Securely Onboarding Users"
weight:
description: >
    How to securely create users, handle password changes and password breaches
relatedContent: >
    apps/guides/training/onboarding
    apps/guides/database/couchdb-authentication
    apps/tutorials/contact-and-users-1
    apps/guides/data/users-bulk-load
    apps/concepts/users
    apps/concepts/access/#magic-links-for-logging-in-token-login

---

{{% pageinfo %}}
This document shows how to achieve a high level of credential management security for a CHT deployment. Implementers need to know when ease of use is more important than a more secure system. By reading this document you should be able to know when to make the "more secure" vs "easier to use" trade off. 

No system is perfectly secure - be prepared to remediate a security breach!
{{% /pageinfo %}}

When a CHT deployment will support hundreds of users or more, secure credential management becomes critical. Their data is sensitive and should never be viewed, or worse edited, by any unauthorized parties. By following best practices, being aware of and prepared for a worst case scenario of a password breach, patient data can be kept safe and CHWs can be kept online and able to deliver care.

## Before starting

### Secure devices

Firstly, ensure that the CHWs' devices are secure: they all employ disk encryption and require a password or PIN to unlock and use. Please see our [Securing Android Devices document]({{% ref "apps/guides/security/securing-android" %}}) for more information. As well, an [MDM]({{% ref "apps/guides/android/publishing#mobile-device-management" %}}) may be used to enforce disk encryption and device unlock protocols.

### Secure administrative users

CHT administrators have the ability to create and delete users and push new configurations to the CHT so they should take extra precautions in managing their password. They should use a [strong passphrase](https://en.wikipedia.org/wiki/Passphrase) (instead of a password) that is unique to their CHT login. They should use a [password manager](https://en.wikipedia.org/wiki/Password_manager) to store this password. 

By following these steps, unauthorized people are less likely to be able to access administrator accounts. 

## Spreadsheet use

Most deployments manage users in a spreadsheet shared either in Google Docs or other cloud service. It is convenient to have a canonical shared location to access the data. This is an acceptable, but not ideal, solution as it ensures changes are instantly shared while still ensuring a number of key security requirements. For an ideal solution, [see "Ideal" below](#ideal-1-only-magic-links).

Of paramount importance:

* **Never** enable anonymous access to the URL for the spreadsheet. You **must always require authentication** to access user credential lists
* Audit regularly who has access to the shared spreadsheet. Consider setting up an alert every time a new person is granted access
* Reduce the total number of users that need access by breaking up user lists by logical group. For example, each sub-county could have its own user spreadsheet. That way the user credentials are only shared with the local administrators who need it
* Refrain from printing spreadsheets of users and passwords. They can be lost, stolen or easily photographed when shown in public
* If you ever need to download a plaintext CSV with username and password, ensure the computer also has disk encryption enabled and requires a password to unlock
* Delete plaintext CSVs after you have used them for bulk upload. Do not keep plaintext copies on disk. Instead, re-download them from the authorized, authenticated cloud server as needed

## Transmitting credentials

When it comes time get a username and password on to a device or to a remote user, be sure to use mediums that are secure. One of the main concerns is credentials being found long after they were sent.

* A best practice is for the sender to add a credential to a shared password manager.  The person receiving the credentials can then securely open the password manager. 
* If no password manager is available, consider sending the password via [One Time Secret](https://onetimesecret.com/)
* For large lists of credentials, as mentioned above, using a cloud provider like Google Sheets, is a good way to have an audit trail and still provide easy, remote access.

TK - notes about downloading creds from [user management tool](https://github.com/medic/cht-user-management/) per [slack thread](https://medic.slack.com/archives/CHYAGKHN2/p1706744894943699?thread_ts=1706728984.849139&cid=CHYAGKHN2)? 

## Example scenarios

### Ideal practice 1: Only Magic Links

Create a spreadsheet with full name, telephone number etc. Included is a username but NOT a password. When users are created in bulk via the command line or bulk user upload, have magic links sent to the user via an SMS gateway. This avoids the problem of passwords being stored in clear text in the spreadsheet or on a printed version.

### Ideal practice 2: Unknown passwords, reset during provision

An alternate and also secure approach, is to bulk create the users as described above, not use magic links, and use random passwords that you do not save. Train the users on changing their password after they've logged in for the first time. This ensures if the initial password has leaked it's now no longer useful.

TK - impractical to reset during provisioning? 

### Acceptable practice: Shared list, limited access, unique passwords

TK - use bulk user password with JS random password generator function, limited access, audit access

### Worst practice: Shared list, anonymous access, similar passwords

TK Bulk create all users with near identical passwords (eg `password123`, `passord234`, `password345` etc.) that are then printed out, shared via email or posted to a public URL which requires no authentication. This is poor security practice and should be avoided if possible. TK

## Remediation of security failure

Tk - By knowing what the security threats are and how to remediate them, you can know the most helpful steps if they happen to you. 

{{% alert title="Note" %}}
Users who have their password changed can continue to use the CHT to deliver care.  They need to keep their device offline though. After a password change and a CHW attempts to sync, they will be prompted to log in and can no use the CHT until they log in.

No data will be lost if they log in as the same user.
{{% /alert %}}

### Credential list shared on internet

TK - reset all passwords in bulk programmatically , magic token login all users, work with supervisors to get users who are stuck offline

### Audit who has changed their password

TK - instruct all users to manually change their password (hamburger menu). before, check user revision number (eg `_rev: 1-7a868a8d7068b547b5fe6c6c19b20259`), after pass change, check user revision number and HAProxy log for user ID and `PUT` action for change pass

## Frequently Asked Questions

- [Best practices for user management at scale?](https://forum.communityhealthtoolkit.org/t/best-practices-for-user-management-at-scale/1668/1)
- [Is it possible to send Magic Link to users using their own mobile bundles instead of setting up a messaging gateway?](https://forum.communityhealthtoolkit.org/t/send-magic-link-via-mobile-bundle/2760/2)
