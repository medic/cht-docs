---
title: "Connecting to RDBMS from MacOS"
linkTitle: "RDBMS from MacOS"
weight: 
description: >
  How to connect to the PostgreSQL RDBMS server from MacOS    
relatedContent: >
  building/guides/database/rdbms-from-windows
aliases:
   - /apps/guides/database/rdbms-from-mac
----

Follow these steps on a Mac to generate your public/private keys and access the PostgreSQL server.

## Access Terminal

Terminal (Terminal.app) is the terminal emulator included in the macOS operating system. You can use this application to generate your SSH key.

1. Open a new **Finder** window
2. Navigate to the **Applications** folder
3. Navigate to the **Utilities** folder
4. Open the **Terminal** app

![Terminal](terminal.png)

## Generate Key

From Terminal, follow these instructions (see screenshot below):

1. Type: `ssh-keygen -t rsa`
2. Hit return to use the default file / location
3. Enter a *passphrase*
4. Enter your *passphrase* again
5. Type: `cat ~/.ssh/id_rsa.pub`

In the screenshot below:

* `(a)` is the location and filename of your ***private*** key
* `(b)` is the location and filename of your ***public*** key
* `(c)` are the contents of your ***public*** key

{{% alert title="Note" %}}
You will need to provide the contents of `(c)` to your Medic contact or RDBMS administrator.  It should start with `ssh-rsa` and end with something that looks like an email address.
{{% /alert %}}

![SSH Commands](ssh-commands.png)


## Connect to PostgreSQL

Copy your public key and provide it to your Medic contact or RDBMS administrator. Your public key is not sensitive and can be shared over slack, github, etc... 

Once the RDBMS administrator has added your public SSH key on RDBMS, the administrator will provide you with login credentials to the SSH server as well as for PostgreSQL. 

Verify you can successfully connect to to the SSH server with `ssh -i ~/.ssh/id_rsa <user>@<rdbms host> -p <port>`. If your setup is correct, you should login to the server and see the prompt of your terminal change to `<user>@rdbms:~$`

You should be able to access PostgreSQL from a SQL client using the provided credentials. Some common SQL clients include: [pgAdmin](https://www.pgadmin.org/), [DBeaver](https://dbeaver.io/), [Postico](https://eggerapps.at/postico/).

From your SQL client, use the settings mentioned below to connect. Be sure to select the ***Private Key*** that you generated above.

|Field|Value|
|---|---|
|Host|`localhost`|
|Host Port|`5432`|
|User|`<provided by Medic>`|
|Password|`<provided by Medic>`|
|Database|`<provided by Medic>`|
|SSH Host|`rdbms.dev.medicmobile.org`|
|SSH Port|`33696`|
|SSH User|`<provided by Medic>`|
|SSH Password|N/A - Use Private Key|
|Private Key|Choose the location of the private key generated above|

![PG Connection Settings](connection-settings.png)

