#!/bin/bash

# This script is used in Github Actions to do link checking on commits to branches and main, so
# please edit with care!  See ../workflows/ci.yml for specific usage.
#
# If you're doing local development and want to run link checkers locally, please use this script!
# You'll need:
# - install go - https://golang.org/doc/install
# - install muffet - https://github.com/raviqqe/muffet
# - make sure muffet is in your PATH
# - run from root of this repo: ./.github/scripts/muffet.sh
#
# If we have errors from this script being too aggressive (see how large downloads on
# download.docker.com are excluded below) you can add additional sites as needed. Please
# use extremely granular URLs so as not to exclude more than we need to.

muffet http://localhost:1313 \
  --dns-resolver 9.9.9.9:9953 \
  --buffer-size 50000 \
  --timeout 135 \
  --rate-limit 2 \
  --ignore-fragments \
  --exclude "http[s]*://github.com/medic/.*/issues/new.*" \
  --exclude "http[s]*://github.com/medic/.*/commit.*" \
  --exclude "http[s]*://github.com/medic/cht-docs/edit/main.*" \
  --exclude "http[s]*://github.com/medic/medic-infrastructure.*" \
  --exclude "http[s]*://github.com/moh-kenya/config-echis-2.0.*" \
  --exclude "http[s]*://docs.google.com/spreadsheets/d/12345ABCDEF.*" \
  --exclude "http[s]*://docs.google.com/document/d/14AuJ7SerLuOPESBjQlJqpBtzwSAoVf5ykTT7fjyJBT0.*" \
  --exclude "http[s]*://docs.google.com/document/d/1pPk6FAuLUPKUYnCRgruPk6Lh5IeWzu6IPD1KTFOi6YQ.*" \
  --exclude "http[s]*://drive.google.com/file/d/1YPXoba9gVmD7SP-X88PpJIsIVGvY86_G.*" \
  --exclude "http[s]*://tools.google.com.*" \
  --exclude "http[s]*://www.tableau.com.*" \
  --exclude "http[s]*://doi.org/10.1080/02681102.2019.1667289" \
  --exclude "http[s]*://journals.sagepub.com/doi/full/10.1177/20552076231194924" \
  --exclude "http[s]*://garticphone.com.*" \
  --exclude "http[s]*://www.hl7.org.*" \
  --exclude "http[s]*://demo.app.medicmobile.org.*" \
  --exclude "http[s]*://www.npmjs.com/org/medic/team/developers" \
  --exclude "http[s]*://docs.couchdb.org.*" \
  --exclude "http[s]*://oppiamobile.readthedocs.io*." \
  --exclude "http[s]*://africastalking.com.*" \
  --exclude "http[s]*://borgbackup.readthedocs.io.*" \
  --exclude "http[s]*://udemy.com.*" \
  --exclude "http[s]*://udacity.com.*" \
  --exclude "http[s]*://.*my.local-ip.co.*" \
  --exclude "http[s]*://.*local-ip.medicmobile.org.*" \
  --exclude "http[s]*://cht.domain.com.*" \
  --exclude "http[s]*://localhost:[3000|8443|5984]+" \
  --exclude "http[s]*://localhost$" \
  --exclude "http[s]*://127*"
