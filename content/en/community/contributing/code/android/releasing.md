---
title: "Releasing"
linkTitle: "Releasing"
weight: 3
description: >
  Instructions for releasing Android Apps
relatedContent: >
  building/guides/android/publishing
  building/branding/android
aliases: >
  /core/guides/android/releasing
  /contribute/code/android/releasing
---

All Medic's Android projects automatically build, sign, and release builds via GitHub Actions. The following guide applies to any of these apps, although the last 2 are in maintenance mode (links pointing to the release sections):

   * [cht-android](https://github.com/medic/cht-android/releases)
   * [cht-gateway](https://github.com/medic/cht-gateway/releases)
   * [medic-collect](https://github.com/medic/medic-collect/releases)
   * [rdt-capture](https://github.com/medic/rdt-capture/releases)


## Alpha for release testing

1. Ensure all issues for this release have passed AT and been merged into `master`. You can also create an alpha release from a feature branch, to provide the needed `.apk` files to the QA team.
2. Create a git tag starting with `v` and ending with the alpha version, e.g. `git tag v1.2.3-alpha.1`, and push the tag to GitHub (`git push --tags`). For features branches, you can add the name of the branch or whatever keyword helps to identify the release, e.g. `v1.2.3-alpha.dark-theme.4`.
3. Creating the tag will trigger the building and signing of the app in CI. The release-ready APKs are available for side-loading from the Releases section in the project (e.g. [CHT-Android Releases](https://github.com/medic/cht-android/releases)), along with the AABs that the Google Play Store may require. Note that the created release on GitHub with the generated artifacts will not be explicitly linked to the tag because the release is in a draft state.
4. **Side-Load**: for testing internally, or apps that are not published in the Play Store like Collect and Gateway: Navigate to the GitHub Releases page (linked above) and download the relevant APKs for distribution.
5. Announce the release in _#quality-assurance_.


## Production release

1. Update the CHANGELOG with the details of what's in this release.
1. Repeat steps 2-3 from the above [alpha release section](#alpha-for-release-testing) with the naming convention `v<major>.<minor>.<patch>`.
1. The CI build for the tag will create a new draft release on GitHub.  Include the release notes from the CHANGELOG in the description of the release and publish the release on GitHub.
1. [Publish]({{< ref "building/guides/android/publishing" >}}) in the Play Store. For the CHT-Android app, the "reference" apps (`medicmobilegamma` and `unbranded`) must be published in the Play Store. Other channels such as F-Droid can also be used to publish the app.
1. Announce the release on the [CHT forum](https://forum.communityhealthtoolkit.org), under the "Product - Releases" category.
