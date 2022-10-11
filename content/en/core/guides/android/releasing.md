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

All Medic's android projects automatically build, sign, and release builds via Github Actions. The following guide applies to any of these apps, although the last 2 are in maintenance mode (links pointing to the release sections):

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

1. Repeat step 2-3 from the above [alpha release section](#alpha-for-release-testing) with the naming convention `v<major>.<minor>.<patch>`.
2. The CI build for the tag will create a new draft release on GitHub.  Include the release notes from the CHANGELOG in the description of the release and publish the release on GitHub.
3. [Publish]({{< ref "core/guides/android/publishing" >}}) in the Play Store, F-Droid or whatever channel is used for publishing. For the CHT-Android app, the "reference" apps (`medicmobilegamma` and `unbranded`) must be published in the Play Store.
4. Announce the release on the [CHT forum](https://forum.communityhealthtoolkit.org), under the "Product - Releases" category.

## New flavor release

_Only CHT Android_

The new flavor should have branched off from the [last stable release](https://github.com/medic/cht-android/releases) in CHT Android repository, for example, if the latest stable release is `v1.2.3` and the branch name is `v1.2.3-new-brand`, then check out the tag and create a branch using the following command:
 ```
 git checkout v1.2.3 -b v1.2.3-new-brand
 ```
Add the flavor and make a pull request to the release branch. Once it has been approved, `squash and merge` the pull request, tag the commit with the same version as the last one and add a number suffix separated with a dash character (`-`), e.g. if the last version was `v1.2.3`, tag it as `v1.2.3-1`. In this case, it's not necessary to publish again the reference apps in Play Store or to announce the release in the forum, if not relevant.
Finally, make sure this commit is backported to the repository's main branch.
