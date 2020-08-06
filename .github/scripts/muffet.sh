#!/bin/bash
muffet http://localhost:1313 \
  --buffer-size 50000 \
  --timeout 35 \
  --concurrency 2 \
  --ignore-fragments \
  --exclude ".*demo\.app\.medicmobile\.org.*" \
  --exclude ".*download\.docker\.com.*" \
  --exclude ".*www\.npmjs\.com/org/medic/team/developers" \
  --exclude "https://github\.com/medic/cht-docs/issues/new.*" \
  --exclude "https://github\.com/medic/cht-core/issues/new.*" \
  --exclude "https://github\.com/medic/cht-docs/commit.*" \
  --exclude "https://github\.com/medic/cht-core/commit.*" \
  --exclude "https://github\.com/medic/cht-docs/edit/master/.*" \
  --exclude ".*localhost:5984.*"