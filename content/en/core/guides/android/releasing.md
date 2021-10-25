---
title: "Releasing"
linkTitle: "Releasing"
weight: 7
description: >
  Instructions for releasing Android Apps
---

All medic Android projects automatically build, sign, and publish builds via Github Actions or Travis. The following guide applies to any of these apps (links pointing to the release sections):

   * [cht-android](https://github.com/medic/cht-android/releases)
   * [cht-gateway](https://github.com/medic/cht-gateway/releases)
   * [medic-collect](https://github.com/medic/medic-collect/releases)
   * [rdt-capture](https://github.com/medic/rdt-capture/releases)


## Alpha for release testing

1. Make sure all issues for this release have passed AT and been merged into `master`.
2. Create a git tag starting with `v` and ending with the alpha version, e.g. `git tag v1.2.3-alpha.1` and push the tag to GitHub (`git push --tags`).
3. Creating this tag will trigger the building, signing of the app in CI. The release-ready APKs are available for side-loading from the Releases section in the project (e.g. [CHT-Android Releases](https://github.com/medic/cht-android/releases), along with the AABs that may be required by the Google Play Store.
4. **Side-Load**: for testing internally, or apps that are not published in the Play Store like Collect and Gateway: Navigate to the GitHub Releases page (linked above) and download the relevant APKs for distribution.
5. Announce the release in #quality-assurance.


## Final for users

1. The exact same process from Step 1 to 3 above, but name it without any suffix, e.gg. `v1.2.3`.
3. Publish in the Play Store. For the CHT-Android app, the "reference" apps must be published: Unbranded, Simprints, and Gamma flavors.
4. Announce the release on the [CHT forum](https://forum.communityhealthtoolkit.org), under the "Product - Releases" category.

**NOTE**: if the release only contains a new flavor but is based in the last version, tag it with a number suffix separated with a `-`, e.g. `v1.2.3-1`. In this case there is no need to publish again the reference apps.


### New App in the Play Store

Remember that when the app is created in the Play Store, it's required to choose the way the app will be signed by Google: we upload the signed AAB files, but then Google creates optimized versions of the app in .apk format. The app has to be configured to use the same signing and upload signatures by Google. Choose to upload a "Java keystore", the Play Console will require a file encrypted with a tool named PEPK, that file is the `<brand>_private_key.pepk` file generated when following the instructions of [New brand](#new-brand) (the button to upload the `.pepk` in the Play Console may say "Upload generated ZIP" although the PEPK file doesn't look like a .zip file).
