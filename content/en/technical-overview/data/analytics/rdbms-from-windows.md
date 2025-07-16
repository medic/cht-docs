---
title: "Connecting to RDBMS from Windows"
linkTitle: "RDBMS from Windows"
weight: 3
description: >
  How to connect to the PostgreSQL RDBMS server from Windows   
relatedContent: >
  technical-overview/data/analytics/rdbms-from-mac
aliases:
   - /apps/guides/database/rdbms-from-windows
---
Connecting to RDBMS, the PostgreSQL server, is pretty stratightforward in nix systems. In Windows there are a couple of things you need to do to get it up and running. 

## SSH Key Generation and Importing

1. Download Puttygen from [here](https://www.ssh.com/ssh/putty/download)

2. Run Puttygen Go to Windows Start menu → All Programs → PuTTY→ PuTTYgen.

3. Create a new key pair for your computer. 

    {{< figure src="puttygen-run-key-generate.png" link="puttygen-run-key-generate.png" caption="Putty-gen-key-pair" >}}

4. Convert the key generated from ssh2 format to openssh. Puttygen [supports this](https://stackoverflow.com/questions/2224066/how-to-convert-ssh-keypairs-generated-using-puttygen-windows-into-key-pairs-us/2224204#2224204).

    ```
    1. Open PuttyGen
    2. Click Load
    3. Load your private key
    4. Go to Conversions->Export OpenSSH and export your private key
    5. Copy your private key to ~/.ssh/id_dsa (or id_rsa).
    6. Create the RFC 4716 version of the public key using ssh-keygen
        ssh-keygen -e -f ~/.ssh/id_dsa > ~/.ssh/id_dsa_com.pub
    6. Convert the RFC 4716 version of the public key to the OpenSSH format:
        ssh-keygen -i -f ~/.ssh/id_dsa_com.pub > ~/.ssh/id_dsa.pub
        
    ```

5. Import the file using PuTTYgen:

    {{< figure src="putty-gen-import.png" link="putty-gen-import.png" caption="puttty-import-key" >}}

6. Save it as PuTTY Private Key File .ppk:

    {{< figure src="putty-save-key.png" link="putty-save-key.png" caption="putty-save-keys" >}}

7. Add the key (.ppk) to Pageant (PuTTY authentication agent):

    {{< figure src="putty-add-key.png" link="putty-add-key.png" caption="putty-add-key.png" >}}

8. Now you can connect to RDBMS using PuTTY:

    {{< figure src="putty-connect.png" link="putty-connect.png" caption="putty-connect.png" >}}
    
    {{< figure src="putty-connect-final.png" link="putty-connect-final.png" caption="putty-connect.png" >}}
    
    If you are connecting to rdbms in order to use a PostgreSQL client. You may not need to tunnel the connection. The client can do it for you. 
    
    {{< figure src="rdbms_connect_1.png" link="rdbms_connect_1.png" caption="rdbms_1" >}}
    
    {{< figure src="rdbms_connect_2.png" link="rdbms_connect_2.png" caption="rdbms_2" >}}
