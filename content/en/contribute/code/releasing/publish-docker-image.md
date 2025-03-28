---
title: "Publishing Docker Images"
linkTitle: "Publishing Docker Images"
weight: 4
description: >
    Using GitHub Actions to publish Docker images
relatedContent: >
    core/releases
---

## Setup Image Repository

Docker images can be published to Docker Hub or Amazon ECR. (You should only publish to one of these repositories. There is no need to store the same image in both places.)

### Configure repository on Docker Hub

Docker images for CHT projects can be published to the [medicmobile](https://hub.docker.com/u/medicmobile) Docker Hub organization, so they are easily accessible to the community. This process can be automated using GitHub actions.

First, create a repository for your new image on Docker Hub.

1. Use the admin Docker account to [create a new repository](https://hub.docker.com/u/medicmobile) in the `medicmobile` organization.
2. For your new repository, update the permissions to give the `developers` team the ability to `Read & Write`.  This will allow the GitHub action to push to the repository.

### Configure repository on ECR

There are two Amazon ERC repositories that can be used for publishing CHT images. `public.ecr.aws/medic` contains the released versions of the images, while `720541322708.dkr.ecr.eu-west-2.amazonaws.com/medic` is used to store branch builds (useful for CI testing, etc).

Use an AWS admin account to add a new _public_ repository configuration for the new Docker image.  For example, for the `cht-couchdb-nouveau` image, it would look like:

```json
{
    "repository": {
        "repositoryArn": "arn:aws:ecr:eu-west-2:720541322708:repository/medic/cht-couchdb-nouveau",
        "registryId": "720541322708",
        "repositoryName": "medic/cht-couchdb-nouveau",
        "repositoryUri": "720541322708.dkr.ecr.eu-west-2.amazonaws.com/medic/cht-couchdb-nouveau",
        "createdAt": "2024-12-03T13:05:44.979000+03:00",
        "imageTagMutability": "MUTABLE",
        "imageScanningConfiguration": {
            "scanOnPush": false
        },
        "encryptionConfiguration": {
            "encryptionType": "AES256"
        }
    }
}
```

Update the `ecr-publishers` IAM Group policy (associated with the IAM user: `ci-user`) in include the resource url for your new Docker image in the `Statement[*].Resource` array.

_See this issue thread for more details: [#9685](https://github.com/medic/cht-core/issues/9685)._

## Add GitHub Action Workflow configuration

Now that the Docker Hub repository is created, you can add the GitHub Action workflow configuration to your project. This configuration should build the Docker image based on the code in the repository and then publish it to the Docker Hub repository.

Here is an example of a basic workflow configuration that publishes a new image for each tag that is pushed:

```yaml
name: Publish Docker image

on:
  push:
    tags: ['v*']

env:
  DOCKER_HUB_USER: dockermedic
  DOCKER_NAMESPACE: medicmobile
  DOCKER_REPOSITORY: **REPLACE WITH REPOSITORY NAME**

jobs:
  push_to_registry:
    name: Push Docker image to Docker Hub
    runs-on: ubuntu-22.04
    steps:
      - name: Check out the repo
        uses: actions/checkout@v3

      - name: Log in to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ env.DOCKER_HUB_USER }}
          password: ${{ secrets.DOCKER_HUB_PASS }}

      - name: Extract metadata (tags, labels) for Docker
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ${{ env.DOCKER_NAMESPACE }}/${{ env.DOCKER_REPOSITORY }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
```

Do not forget to update the `DOCKER_REPOSITORY` environment variable with the name of the repository you created on Docker Hub. Also note that the `DOCKER_HUB_PASS` secret is an org level secret. So, no special configuration should be required to use this secret for any repositories in the [`medic` organization](https://github.com/medic).

This configuration will create and publish a new Docker image for each tag that is pushed to the repository. The image will be tagged with the tag name and the `latest` tag.
