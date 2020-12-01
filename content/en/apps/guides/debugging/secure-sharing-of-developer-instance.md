---
title: "Securely Sharing Your Development Environment"
linkTitle: "Securely Sharing Your Development Environment"
weight: 
description: >
  Use a publicly accessible Linux web server to forward https requests to your development environment
relatedContent: >
  
---

{{% alert title="Warning" %}} 
Be extra careful with this process! The end result will be that your development instance will be accessible to the internet. If you have simple logins and passwords like "admin/test.223" because you thought it was just your local dev instance and it doesn't matter, now it matters! Whenever you're not using the SSH tunnel for testing, shut it down so not remote access is allowed.

Never expose a development instance to the internet where you've replicated production data locally. Well, maybe not never, but with extreme care and intention.
{{% /alert %}}

## Overview
When using a local [development environment](https://github.com/medic/cht-core/blob/master/DEVELOPMENT.md), you may want to share your work with other collaborators. You also may need to access the environment from your [mobile device](https://github.com/medic/medic-android/) which requires an SSL certificate (the "s" in "https"). By using a publicly accessible web server, you can receive the secure https requests and forward them back to your CHT instance which doesn't have https set up:

[<img src="/apps/guides/debugging/images/SSH.tunnel.diagram.svg" width=100% height=100%>](/apps/guides/debugging/images/SSH.tunnel.diagram.svg)

Once you have this web server set up, you may continue to use it whenever you want by simply reconnecting to it via the secure tunnel.

## Prereqs
This guide assumes:
* You have a local dev instance set up of cht-core https://github.com/medic/cht-core/blob/master/DEVELOPMENT.md
* You have medic-android repo checked out and can compile the android app from scratch https://github.com/medic/medic-android/
* You  have the generic Medic Mobile app installed on your android device https://play.google.com/store/apps/details?id=org.medicmobile.webapp.mobile&hl=en_US
* You have a server running Ubuntu 18.04 or later with a public IP and a DNS entry that you can SSH into and have sudo on
* You have apache >2.4.29 installed on the Ubuntu server and can add a new vhost to it, including an SSL cert. (nginx could be used instead as well, but not covered here)
* You have certbot installed from letsencrypt.org

For reference, any of the cheap servers out there (Digital Ocean has a $5/mo server https://digitalocean.com/) will enable you to do this. 
 
## Steps
1. Create a DNS entry.  Let's assume it's `cht.domain.com`.  It should point to the IP of your Ubuntu server. If you do not already have a domain name with DNS services that you can use, you can sign up for a free service to do this like [noip.com](https://www.noip.com/remote-access).
1. On your Ubuntu server, create a new apache vhost in `/etc/apache2/sites-available/100-cht.domain.com.conf` with the following contents:
    ```
    <VirtualHost *:80>
        ServerName cht.domain.com
        RewriteEngine on
        RewriteRule (.*) https://cht.domain.com%{REQUEST_URI}
    </VirtualHost>

    <IfModule mod_ssl.c>
    <VirtualHost *:443>
        ServerName cht.domain.com
        SSLEngine On
        <IfModule mod_headers.c>
            Header always set Strict-Transport-Security "max-age=63072000; preload"
        </IfModule>
        RewriteEngine on
        Include /etc/letsencrypt/options-ssl-apache.conf
        SSLCertificateFile /etc/ssl/certs/ssl-cert-snakeoil.pem
        SSLCertificateKeyFile /etc/ssl/private/ssl-cert-snakeoil.key

        ProxyPass / http://localhost:8081/
        ProxyPassReverse / http://localhost:8081/
        RequestHeader set X-Forwarded-Proto "https"
    </VirtualHost>
    </IfModule>
    ```
1. Enable the new site: `a2ensite 100-cht.domain.com`
1. Restart apache and ensure there's no errors: `apachectl restart`
1. Create the TLS certificate: `certbot -d cht.domain.com`
1. When prompted choose no redirect: "No redirect - Make no further changes to the webserver configuration."
1. Restart apache and ensure there's no errors: `apachectl restart`
1. In a browser, test that you can connect to your server with no errors at https://cht.domain.com (you may get a 500 error, but you shouldn't get any TLS errors)
1. Ensure your cht-core local dev instance is running by going to http://localhost:5988/
1. On your local dev box, set up the SSH tunnel with: `ssh -NT -R 8081:127.0.0.1:5988 cht.domain.com`
1. This assumes your local username is the same as it is on cht.domain.com. This command will hang and you may exit when down with "ctrl + c"
1. In a browser, test again that you now see your local dev instance and it loads correctly at https://cht.domain.com 
1. If needed, reset the Medic Mobile app on your phone so that it prompts which instance to use  
1. In the app on your phone, choose "custom" for which instance to use and enter https://cht.domain.com. You should now see your local dev instance in the medic mobile android device.  Happy testing!

Your traffic is now flowing like this from the SSH command above:

[<img src="/apps/guides/debugging/images/ssh.ports.svg" width=100% height=100%>](/apps/guides/debugging/images/ssh.ports.svg)
