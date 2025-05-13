#!/bin/bash

# This script is used in Github Actions to do link checking on commits to branches and main, so
# please edit with care!  See ../workflows/ci.yml for specific usage.
#
# If you're doing local development and want to run link checkers locally, please use this script!
# You'll need:
# - install go - https://golang.org/doc/install
# - install muffet - https://github.com/raviqqe/muffet
# - make sure muffet is in your PATH
# - cd ti: ./.github/scripts/
# - run script: ./muffet.sh
#
# If we have errors from this script being too aggressive (see how large downloads on
# download.docker.com are excluded below) you can add additional sites as needed. Please
# use extremely granular URLs so as not to exclude more than we need to.

# when upgrading muffet, upload new binary here and rename so version is explicit in filename
./2.10.9.muffet http://localhost:1313 \
  --buffer-size 50000 \
  --timeout 255 \
  --rate-limit 4 \
  --max-connections-per-host 8 \
  --ignore-fragments \
  --header="User-Agent: Muffet (github.com/raviqqe/muffet) on behalf of CHT Docs (docs.communityhealthtoolkit.org)" \
  --exclude "http[s]*://.*africastalking.com.*" \
  --exclude "http[s]*://github.com/medic/.*/issues/new.*" \
  --exclude "http[s]*://github.com/medic/.*/commit.*" \
  --exclude "http[s]*://github.com/medic/cht-docs/edit/main.*" \
  --exclude "http[s]*://github.com/medic/medic-infrastructure.*" \
  --exclude "http[s]*://github.com/moh-kenya/config-echis-2.0.*" \
  --exclude "http[s]*://.*google.com/.*12345ABCDEF.*" \
  --exclude "http[s]*://.*google.com/.*14AuJ7SerLuOPESBjQlJqpBtzwSAoVf5ykTT7fjyJBT0.*" \
  --exclude "http[s]*://.*google.com/.*1pPk6FAuLUPKUYnCRgruPk6Lh5IeWzu6IPD1KTFOi6YQ.*" \
  --exclude "http[s]*://.*google.com/.*1uXSqntenhxlGOeFtP7ScLcFmoid3kagPYn-EDoodP3s.*" \
  --exclude "http[s]*://.*google.com/.*0Ao9l2yegOFn7dEJRTEw1Z3RmZm0wTEo4Nk92NjVocnc.*" \
  --exclude "http[s]*://.*google.com/.*1yUenFP-5deQ0I9c-OYDTpbKYrkl3juv9djXoLLPoQ7Y.*" \
  --exclude "http[s]*://.*google.com/.*1YPXoba9gVmD7SP-X88PpJIsIVGvY86_G.*" \
  --exclude "http[s]*://tools.google.com.*" \
  --exclude "http[s]*://www.tableau.com.*" \
  --exclude "http[s]*://doi.org/10.1080/02681102.2019.1667289" \
  --exclude "http[s]*://journals.sagepub.com/doi/full/10.1177/20552076231194924" \
  --exclude "http[s]*://garticphone.com.*" \
  --exclude "http[s]*://www.hl7.org.*" \
  --exclude "http[s]*://build.fhir.org.*" \
  --exclude "http[s]*://www.apkmirror.com/apk/google-inc.*" \
  --exclude "http[s]*://www.pluralsight.com/courses/kubernetes-packaging-applications-helm.*" \
  --exclude "http[s]*://www.pluralsight.com/paths/using-kubernetes-as-a-developer.*" \
  --exclude "http[s]*://www.intellisoftkenya.com.*" \
  --exclude "http[s]*://demo.app.medicmobile.org.*" \
  --exclude "http[s]*://www.npmjs.com/org/medic/team/developers" \
  --exclude "http[s]*://docs.couchdb.org.*" \
  --exclude "http[s]*://oppiamobile.readthedocs.io*." \
  --exclude "http[s]*://borgbackup.readthedocs.io.*" \
  --exclude "http[s]*://.*udemy.com.*" \
  --exclude "http[s]*://.*udacity.com.*" \
  --exclude "http[s]*://.*my.local-ip.co.*" \
  --exclude "http[s]*://.*local-ip.medicmobile.org.*" \
  --exclude "http[s]*://cht.domain.com.*" \
  --exclude "http[s]*://localhost:[3000|8443|5984]+" \
  --exclude "http[s]*://localhost$" \
  --exclude "http[s]*://127.*"
