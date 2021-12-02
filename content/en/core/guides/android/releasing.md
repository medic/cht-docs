---
title: "Releasing"
linkTitle: "Releasing"
weight: 3
description: >
  Instructions for releasing Android Apps
relatedContent: >
  core/guides/android/publishing
  core/guides/android/branding
---

All Medic's android projects automatically build, sign, and release builds via Github Actions or Travis. The following guide applies to any of these apps, although the last 2 are in maintenance mode (links pointing to the release sections):

   * [cht-android](https://github.com/medic/cht-android/releases)
   * [cht-gateway](https://github.com/medic/cht-gateway/releases)
   * [medic-collect](https://github.com/medic/medic-collect/releases)
   * [rdt-capture](https://github.com/medic/rdt-capture/releases)


## Alpha for release testing

1. Make sure all issues for this release have passed AT and been merged into `master`. You can also create an alpha release from a feature branch, to provide the needed `.apk` files to the QA team.
2. Create a git tag starting with `v` and ending with the alpha version, e.g. `git tag v1.2.3-alpha.1` and push the tag to GitHub (`git push --tags`). For features branches, you can add the name of the branch or whatever keyword helps to identify the the release, e.g. `v1.2.3-alpha.dark-theme.4`.
3. Creating the tag will trigger the building and signing of the app in CI. The release-ready APKs are available for side-loading from the Releases section in the project (e.g. [CHT-Android Releases](https://github.com/medic/cht-android/releases)), along with the AABs that may be required by the Google Play Store.
4. **Side-Load**: for testing internally, or apps that are not published in the Play Store like Collect and Gateway: Navigate to the GitHub Releases page (linked above) and download the relevant APKs for distribution.
5. Announce the release in _#quality-assurance_.


## Production release

1. Create a release in GitHub from the release branch so it shows up under the [Releases tab](https://github.com/medic/cht-android/releases) with the naming convention `v<major>.<minor>.<patch>`. This will create the git tag automatically. Include the release notes from the [CHANGELOG](https://github.com/medic/cht-android/blob/master/CHANGELOG.md) in the description of the release.
2. [Publish]({{< ref "core/guides/android/publishing" >}}) in the Play Store, F-Droid or whatever channel is used for publishing. For the CHT-Android app, the "reference" apps (`medicmobilegamma` and `unbranded`) must be published in the Play Store.
3. Announce the release on the [CHT forum](https://forum.communityhealthtoolkit.org), under the "Product - Releases" category.

## New flavor release

_Only CHT Android_

If the release only contains a new flavor but is based on the last version, tag it with the same version that the last one plus a number suffix separated with a `-`, e.g. if the last version was `v1.2.3`, tag it as `v1.2.3-1`. In this case there is no need to publish again the reference apps in the Play Store, or to announce the release in the forum if isn't relevant.
