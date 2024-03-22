---
title: "Deploy CHT Core on Medic hosted EKS"
weight: 2
linkTitle: "Deploy to EKS"
description: >
    Setting up a cloud hosted deployment of CHT Core on Medic's AWS EKS infrastructure
relatedContent: >
    core/overview/architecture
    core/overview/cht-sync
---

While not directly available to the public who might be doing CHT Core development, having Medic's process for using our [Amazon Elastic Kubernetes Service](https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html) (AWS EKS) publicly documented will help Medic employees new to EKS.  As well, hopefully  external developers looking to re-use Medic tools and process to use EKS will find it helpful.

While these instructions assume you work at Medic and have access to private GitHub repositories, many of the tools are fully open source.

## Command Line Prerequisites 

Before using this guide, be sure you have these tools installed:

* [awscli](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html): version `2` or newer
* [kubectl](https://kubernetes.io/docs/tasks/tools): Must be within one minor version of cluster. If cluster is `1.24.x`, use `1.23.x`, `1.24.x` or `1.25.x`.
* [helm](https://helm.sh/docs/intro/install/)
* [jq](https://jqlang.github.io/jq/download/)

## Autocomplete

Both `helm` and `kubectl` have autocomplete libraries you can add to your shell. For power users and beginners alike, this adds a huge amount of discoverability. This guide covers `zsh`, but `bash`, `fish` and `powershell` are supported as well:

1. Output `zsh` shell's setup to a file: 
   ```shell
   kubectl completion zsh > zsh.kubectl.autocomplete
   helm completion zsh > zsh.helm.autocomplete
   ```
  
2. Then source the two new files:
   ```shell
   source zsh.kubectl.autocomplete
   source zsh.helm.autocomplete
   ```

## Request permission

1. [Create a ticket](https://github.com/medic/medic-infrastructure/issues/new) to get your DNS and Namespace created for EKS, which should match each other. As an example, a `USERNAME-dev` name space would match `USERNAME.dev.medicmobile.org` DNS. The ticket should include requesting EKS access to be granted. 
2. Once you get your AWS account invite (see prior step), follow the [CLI setup guide](https://github.com/medic/medic-infrastructure/blob/master/terraform/aws/dev/eks/access/README.md).
    
**NB** - Security key (eg Yubikey) users need to add a TOTP MFA too! CLI requires the TOTP values (6-digit number) and security keys are not supported. Security keys can only be used on web logins.

## Starting and stopping (aka deleting)

1. Login with `eks-aws-mfa-login` script in the [infra repo](https://github.com/medic/medic-infrastructure/tree/master/terraform/aws/dev/eks/access): `./eks-aws-mfa-login USERNAME  TOTP_HERE`
2. Ensure you're using dev EKS cluster. Replace `AWS_ACCOUNT_ID` with the real ID from SRE: `kubectl config use-context arn:aws:eks:eu-west-2:AWS_ACCOUNT_ID:cluster/dev-cht-eks`
3. Add new `values.yaml` file - you can [copy this one](https://github.com/medic/medic-infrastructure/blob/master/terraform/aws/dev/cht-projects/alpha-dev-cht-deploy-values.yaml) and just change the `alpha-dev` values to `USERNAME-dev`
4. Use `uuidgen` to fill in the `secret` in `values.yaml`
5. Use a good passphrase (diceware!) to fill in 1password1 in 1values.yaml1
6. Ensure you have the latest code of `cht-core` [repo](https://github.com/medic/cht-core): `git checkout master;git pull origin`
7. Deploy!: `cd scripts/deploy;./cht-deploy -f PATH_TO/values.yaml`
8. Delete it when you're done: `helm delete USERNAME-dev --namespace USERNAME-dev`
