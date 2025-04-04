---
title: "Feature Releases"
linkTitle: "Feature Releases"
weight: 1
description: >
    Feature Releases for the CHT Core Framework
aliases:
  -    /releases/core-framework/feature_releases/
relatedContent: >
    releases/core-framework
    contribute#are-you-a-partner-wondering-how-issues-are-prioritized

---

To build and iterate on new features at a pace that is faster than our regular release cycle, some features are released in a _Feature Release_. Feature Releases (FRs) are based on the most recent release and only include improvements related to a feature being developed. These releases are tested to be production-ready so that new features can be studied with CHT partners in a live deployment, with the aim of getting the feature ready for wider use in an upcoming release.

## Release names

A Feature Release can easily be identified by its version, which follows the pattern of `{BASE-RELEASE-NUMBER}-FR-{FEATURE-NAME}`. For example, if the latest release is `3.10.1` then the Feature Release for speedier upgrades would be `3.10.1-FR-speedier-upgrades`. When this feature is found to be successful and ready for wider distribution it will be included in the next release.


## Initial FR Installation

### 3.x
When you are on a non-feature release, you need to use horticulturalist (horti) to do the initial install of the FR.  For example, if your instance was running at `192-168-68-26.local-ip.medicmobile.org:8443` and you wanted to install `3.16.0-FR-offline-user-replace-beta.1`, after [installing](https://github.com/medic/horticulturalist#usage) `horti` you could start the installation with this command:

```
COUCH_URL=https://medic:password@192-168-68-26.local-ip.medicmobile.org:8443/medic horti --local --install=3.16.0-FR-offline-user-replace-beta.1
```

On subsequent upgrades to the later beta's of the FR, you will be able to more easily do it through the admin UI in the CHT.

### 4.x

As horticulturalist (horti) does not exist in CHT 4.x, the current way to upgrade an instance is to manually edit your compose file to have the correct version tag of the images. Find the CHT Core compose file and edit all 5 instances of the version tag for each image.

For example, this `image` is using the label `4.0.1-4.0.1` (1 of 5 instances):

```yaml
services:
  haproxy:
    image: public.ecr.aws/s5s3h4s7/cht-haproxy:4.0.1-4.0.1
    restart: always
    hostname: haproxy
```

If you wanted to install `4.1.0-FR-supervisor-cwh-add-beta.1`, you would make it look like this:

```yaml
services:
  haproxy:
    image: public.ecr.aws/s5s3h4s7/cht-haproxy:4.1.0-FR-supervisor-cwh-add-beta.1
    restart: always
    hostname: haproxy
```

On subsequent upgrades to the later beta's of the FR, you will be able to more easily do it through the admin UI in the CHT.

## Upgrades to release

Once the feature is ready for widespread use, it will be included in a regular [CHT release]({{% ref "/contribute/code/releasing" %}}). Projects using the feature version can be upgraded as soon as practical to get back on to a fully supported release.
