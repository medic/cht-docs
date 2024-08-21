---
title: "Deploy CHT Core on Medic hosted EKS"
weight: 2
linkTitle: "Deploy to EKS"
description: >
    Setting up a cloud hosted deployment of CHT Core on Medic's AWS EKS infrastructure
---

While not directly available to the public who might be doing CHT Core development, having Medic's process for using our [Amazon Elastic Kubernetes Service](https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html) (AWS EKS) publicly documented will help Medic employees new to EKS.  As well, hopefully  external developers looking to re-use Medic tools and process to use EKS will find it helpful.

While these instructions assume you work at Medic and have access to private GitHub repositories, many of the tools are fully open source.

##  Prerequisites 

### Command Line

Be sure you have these tools installed and repos cloned:

* [awscli](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html): version `2` or newer
* [kubectl](https://kubernetes.io/docs/tasks/tools): Must be within one minor version of cluster. If cluster is `1.24.x`, use `1.23.x`, `1.24.x` or `1.25.x`.
* [helm](https://helm.sh/docs/intro/install/)
* [jq](https://jqlang.github.io/jq/download/)
* [Medic Infra](https://github.com/medic/medic-infrastructure/) repo cloned

#### Optional:  Autocomplete

Both `helm` and `kubectl` have autocomplete libraries. For power users and beginners alike, it adds a lot of discoverability. This code is for `zsh`, but `bash`, `fish` and `powershell` are supported as well:

   ```shell
   source <(kubectl completion zsh)
   source <(helm completion zsh)
   ```

See [helm](https://helm.sh/docs/helm/helm_completion_bash/) and [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/#enable-shell-autocompletion) docs to automatically loading these on every new session.

### Request permission

By default, Medic teammates do not have EKS access and must file a ticket to request it:

1. [Create a ticket](https://github.com/medic/medic-infrastructure/issues/new) to get your DNS and Namespace created for EKS, which should match each other. As an example, a `mrjones-dev` name space would match `mrjones.dev.medicmobile.org` DNS. The ticket should include requesting EKS access to be granted.
2. Once the ticket in step one is complete, follow the [CLI setup guide](https://github.com/medic/medic-infrastructure/blob/master/terraform/aws/dev/eks/access/README.md).

**NB** - Security key (e.g. Yubikey) users need to add a TOTP MFA (Time-based, One-Time Password Multi-Factor Authentication) too! CLI requires the TOTP values (6-digit number) and security keys are not supported. Security keys can only be used on web logins.

### First time setup

These steps only need to be run once!

After you have created a ticket per "Request permission" above, you should get a link to sign up for AWS.  Click the link and:

1. Create new password ensure it's 10+ characters including one alpha (`a-z`) and one special (``~!@#$%^&*_-+=`|\(){}[]:;"'<>,.?/``) character.
2. Setup MFA. In top-right corner of browser, there is a drop-down menu with your `username @ medic`. Click that and then on "My Security Credentials"
3. Assign an MFA device and give it the **same name** as your username: In AWS web GUI, click your name in upper right:
   1. Security Credentials 
   2. scroll down to "Multi-factor authentication (MFA)" 
   3. click "Assign MFA device" 
   4. enter a "Device name" (should match username) 
   5. "Select MFA device" that you're using
4. Create Access Keys for Command Line Interface: In AWS web GUI, click your name in upper right -> Security Credentials -> scroll down to "Access keys" -> click "Create access key" -> for use case choose "Command Line Interface" -> click "Next" -> enter description and click "Create access key"
5. Run `aws configure` and place appropriate access keys during prompts. Use `eu-west-2` region. It should look like this:

   ```
   $ aws configure

   AWS Access Key ID [None]: <ACCESS-KEY-HERE>
   AWS Secret Access Key [None]: <SECRET-HERE>
   Default region name [None]: eu-west-2
   Default output format [None]:
   ```
6. Run the Update Kubeconfig command, assuming username is `mrjones` and namespace is `mrjones-dev` - be sure to place these with yours: `aws eks update-kubeconfig --name dev-cht-eks --profile mrjones --region eu-west-2`



## Starting and stopping (aka deleting)

1. Login with `eks-aws-mfa-login` script in the [infra repo](https://github.com/medic/medic-infrastructure/tree/master/terraform/aws/dev/eks/access): 
   ```shell
   ./eks-aws-mfa-login USERNAME  TOTP_HERE
   ```
2. Ensure you're using dev EKS cluster:
   ```shell
   kubectl config use-context arn:aws:eks:eu-west-2:720541322708:cluster/dev-cht-eks
   ```

   If get an error `no context exists with the name`, change `use-context` to `set-context` in the  command.  This will create the entry the first time.  Subsequent calls should use `use-context`.
3. Create a new `values.yaml` file by [copying this one](https://github.com/medic/medic-infrastructure/blob/master/terraform/aws/dev/cht-projects/alpha-dev-cht-deploy-values.yaml). Be sure to update these values after you create it: 
   * `alpha-dev` values to `USERNAME-dev` 
   * Update `certificate` to the latest value from SRE - currently it's `arn:aws:iam::720541322708:server-certificate/2024-wildcard-dev-medicmobile-org-chain`
   * Add a strong `password` - this instance is exposed to the Internet!
   * Put a UUID in `secret` - the command `uuidgen` is great for this
   * Update `host` to be your `username`.  For example: `mrjones.dev.medicmobile.org`
4. Use `uuidgen` to fill in the `secret` in `values.yaml`
5. Use a good passphrase (diceware!) to fill in `password` in `values.yaml`. _Please note that a few special characters are unsupported in this field like `:`, `@`, `"`, `'`, etc. Add your password as a string by enclosing it in quotes `""`, and do not use spaces in your password. This will not impact the deployment but will not let you log in to the CHT instance._
6. Ensure you have the latest code of `cht-core` [repo](https://github.com/medic/cht-core):
   ```shell
   git checkout master;git pull origin
   ```
7. Deploy!:
   ```shell
   cd scripts/deploy;./cht-deploy -f PATH_TO/values.yaml
   ```
8. Delete it when you're done:
   ```shell
   helm delete USERNAME-dev --namespace USERNAME-dev
   ```

## References and Debugging

More information on `cht-deploy` script is available in the [CHT Core GitHub repository](https://github.com/medic/cht-core/blob/master/scripts/deploy/README.md) which includes specifics of the `values.yaml` file and more details about the debugging utilities listed below.

### Debugging

A summary of the utilities in `cht-core/scripts/deploy` directory, assuming `mrjones-dev` namespace:

* list all resources: `./troubleshooting/list-all-resources mrjones-dev` 
* view logs, assuming `cht-couchdb-1` returned from prior command: `./troubleshooting/view-logs mrjones-dev cht-couchdb-1`
* describe deployment, assuming `cht-couchdb-1` returned from 1st command: `./troubleshooting/describe-deployment mrjones-dev cht-couchdb-1`
* list all deployments: `./troubleshooting/list-all-resources mrjones-dev`

### Getting shell

Sometimes you need to look at files and other key pieces of data that are not available with [the current](https://github.com/medic/cht-core/blob/master/scripts/deploy/troubleshooting/view-logs) `troubleshooting/view-logs` script.  In this case, getting an interactive shell on the pod can be helpful. 

1. First, get a list pods for your namespace: `kubectl -n NAMESPACE get pods`
2. After finding the pod you're interested, connect to the pod to get a shell: `kubectl -n NAMESPACE exec -it PODNAME/CONTAINERNAME -- /bin/bash`

### `invalid apiVersion` Error

If you get the error: 

> exec plugin: invalid apiVersion "client.authentication.k8s.io/v1alpha1" when running `kubectl version`

You might be using an version of kubernetes api `client.authentication.k8s.io` which is not supported by your `kubectl` client. This can sometimes happen in EKS clusters if aws cli is an older version, in most cases you need at least version `2` of aws cli. Check version by running: `aws --version` and note that version `2` *cannot* be installed through `pip` (See [Command Line](#command-line) section above for installation instructions)

## SRE Steps for granting users access to a namespace

If you're on the SRE/Infra team and want to grant a Medic teammate access to EKS:

1. Tools required: aws, eksctl, kubectl
2. Create AWS User.
    - Attach IAM policy: Force_MFA and share auto-generated password safely
    - Have user log in and finish MFA, access key setup
    - SRE adds you to mfa-required-users group
3. Add the namespaces and users to `tf/eks/dev/access/main.tf`
4. Run tofu apply in the folder `tf/eks/dev/access`
5. Create `identitymapping` if needed:

Reading the [AWS guide for principal access](https://docs.aws.amazon.com/eks/latest/userguide/add-user-role.html) may help here!
