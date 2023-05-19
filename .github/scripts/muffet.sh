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
  --buffer-size 50000 \
  --timeout 10 \
  --concurrency 2 \
  --ignore-fragments \
  --exclude ".*demo\.app\.medicmobile\.org.*" \
  --exclude ".*download\.docker\.com.*" \
  --exclude ".*www\.npmjs\.com/org/medic/team/developers" \
  --exclude "https://github\.com/medic/cht-docs/issues/new.*" \
  --exclude "https://github\.com/medic/cht-core/issues/new.*" \
  --exclude "https://github\.com/medic/cht-docs/commit.*" \
  --exclude "https://github\.com/medic/cht-core/commit.*" \
  --exclude "https://github\.com/medic/cht-docs/edit/main/.*" \
  --exclude "http[s]*://localhost[8443|5984]*" \
  --exclude "http[s]*://.*my.local-ip.co*" \
  --exclude "http[s]*://cht\.domain\.com.*" \
  --exclude "http[s]*://127\.0\.0*" \
  --exclude "http[s]*://.*rapidpro.io.*" \
  --exclude "http[s]*://.*africastalking.com*" \
  --exclude "http[s]*://.*udemy.com.*" \
  --exclude "http[s]*://.*notion.so.*" \
  --exclude "http[s]*://.*medium.com.*" \
  --exclude "http[s]*://.*twitter.com.*" \
  --exclude "https://fhir.org/" \
  --exclude "https://docs.google.com/spreadsheets/d/12345ABCDEF/.*" \
  --exclude "https://doi.org/10.1080/02681102.2019.1667289"
