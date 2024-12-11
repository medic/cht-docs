---
toc_hide: true
hide_summary: true
---

Be sure to update the following values in your YAML file:

* `<your-namespace>` (_two occurrences_)
* `<version>` - 4.x version you're upgrading to
* `<password>` - retrieved from `get-env` call above
* `<secret>` - retrieved from `get-env` call above
* `<admin-user>` - needs to be the same as used in 3.x - likely `medic`
* `<uuid>` - retrieved from `get-env` call above
* `<url>` - the URL of your production instance goes here (eg `example.org`)
* `<path-to-tls>` - path to TLS files on disk

Storage Configuration Notes:

The storage related values don't need to be changed but here's an explanation:

* `preExistingDataAvailable: "true"` - If this is false, the CHT gets launched with empty data.
* `dataPathOnDiskForCouchDB: "data"` - Leave as `data` because that's the directory we created above when moving the existing data.
* `partition: "0"` - Leave as `0` to use the whole disk. If you have moved data to a separate partition in a partitioned hard disk, then you'd put the partition number here.
