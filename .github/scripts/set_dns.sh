#!/bin/bash

# At one point we had issues with the DNS server that GH CI Runners use,
# so this script was written to change Muffet to use Quad9. While Quad9 presumably
# will be a bit slower than local DNS to GH CI, it shouldn't matter as Muffet
# is run once a day and is not speed sensitive.
#
# More Info:
#  - Issue: local-ip.medicmobile.org doesn't resolve on GH runners, causes
#           link check errors (https://github.com/medic/cht-docs/issues/1106)
#  - Quad9: 9.9.9.9 DNS Server being used (https://quad9.net)

echo
echo "------------------------"
echo "calling: resolvectl dns eth0"
resolvectl dns eth0

echo
echo "------------------------"
echo "calling: dig local-ip.medicmobile.org  +short"
dig local-ip.medicmobile.org +short

echo
echo "------------------------"
echo "calling: sudo resolvectl dns eth0 9.9.9.9 149.112.112.112"
sudo resolvectl dns eth0 9.9.9.9 149.112.112.112

echo
echo "------------------------"
echo "calling: resolvectl dns eth0"
resolvectl dns eth0

echo
echo "------------------------"
echo "calling: dig local-ip.medicmobile.org  +short"
dig local-ip.medicmobile.org +short
