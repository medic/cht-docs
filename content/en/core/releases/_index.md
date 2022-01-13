---
title: "Core Framework Releases"
linkTitle: "Releases"
weight: 2
description: >
  Versions currently supported, dependencies, and release notes for the CHT Core Framework
no_list: true
aliases:
  -    /core/overview/supported-software
relatedContent:
  apps/guides/hosting/
  apps/guides/hosting/requirements/
---

## Supported Versions

Medic supports minor versions of the CHT Core Framework for three months after the next minor version is made available, and the latest minor of a major version for twelve months after the next major version is made available.

Once a version is no longer supported it will not receive any further patch releases and upgrading to a supported version will be required to resolve any issues you have.

| Version | Status | Release date | End of life |
|----|----|----|----|
| 3.13.x | Current | 29-Sep-2021 | TBA |
| 3.12.x | Current | 28-Jul-2021 | 29-Dec-2021 |
| 3.11.x | Current | 21-Apr-2021 | 28-Oct-2021 |
| 3.10.x | EOL | 9-Sep-2020 | 21-Jul-2021 |
| 3.9.x | EOL | 19-Jun-2020 | 9-Dec-2020 |
| 3.8.x | EOL | 11-Feb-2020 | 19-Sep-2020 |
| 3.7.x | EOL | 22-Oct-2019 | 11-Jun-2020 |
| 3.6.x | EOL | 17-Jul-2019 | 24-Mar-2020 |
| 3.5.x | EOL | 27-Jun-2019 | 17-Oct-2019 |
| 3.4.x | EOL | 27-Mar-2019 | 27-Sep-2019 |
| 3.3.x | EOL | 22-Feb-2019 | 27-Jun-2019 |
| 3.2.x | EOL | 23-Jan-2019 | 22-May-2019 |
| 3.1.x | EOL | 21-Nov-2018 | 23-Apr-2019 |
| 3.0.x | EOL | 15-Nov-2018 | 21-Feb-2019 |
| 2.18.x | EOL | 30-Aug-2018 | 15-Nov-2019 |
| earlier | EOL | ... | 30-Nov-2018 |

## Requirements

### Dependencies

The following table shows the dependencies for deploying the CHT.

| cht-core | NodeJS | CouchDB | Supported browsers | SMS bridge | Android OS | cht-android | cht-couch2pg |
|----|----|----|----|----|----|----|---|
| **4.x** | 16.0+ | 2.x | Chrome and Firefox latest | cht-gateway | 5.0+ | 1.0+ | 3.0+ |
| **3.x** | 8.11+ | 2.x | Chrome 53+, Firefox latest | cht-gateway | 4.4+ | 0.4.5+ | 3.0+ |
| **2.x** | 6+ | 1.6+ | Chrome 30+, Firefox latest | cht-gateway | 4.4+ | Any | 2.0 < 3.0 |
| **0.4** | 0.12+ | 1.6+ | Chrome 30+, Firefox latest | SMSSync | N/A | N/A | N/A |

{{< see-also page="apps/guides/hosting/requirements" title="Hosting Requirements" >}}

### Client Devices

The following is the minimum specification recommendation for smartphones to handle the typical workload of front line health workers. Users with particularly high workloads or facility or supervisor workloads will require more powerful devices.

| Specification | Minimum |
|--|--|
| Android version | 5.0 |
| Processor | 1.0GHz dual-core |
| RAM | 1GB |
| Storage | 8GB |


## Release Notes
### 3.x

- [3.13.0]({{% ref "core/releases/3.13.0.md" %}})
- [3.12.1]({{% ref "core/releases/3.12.1.md" %}})
- [3.12.0]({{% ref "core/releases/3.12.0.md" %}})
- [3.11.3]({{% ref "core/releases/3.11.3.md" %}})
- [3.11.2]({{% ref "core/releases/3.11.2.md" %}})
- [3.11.1]({{% ref "core/releases/3.11.1.md" %}})
- [3.11.0]({{% ref "core/releases/3.11.0.md" %}})
- [3.10.5]({{% ref "core/releases/3.10.5.md" %}})
- [3.10.4]({{% ref "core/releases/3.10.4.md" %}})
- [3.10.3]({{% ref "core/releases/3.10.3.md" %}})
- [3.10.2]({{% ref "core/releases/3.10.2.md" %}})
- [3.10.1]({{% ref "core/releases/3.10.1.md" %}})
- [3.10.0]({{% ref "core/releases/3.10.0.md" %}})
- [3.9.2]({{% ref "core/releases/3.9.2.md" %}})
- [3.9.1]({{% ref "core/releases/3.9.1.md" %}})
- [3.9.0]({{% ref "core/releases/3.9.0.md" %}})
- [3.8.2]({{% ref "core/releases/3.8.2.md" %}})
- [3.8.1]({{% ref "core/releases/3.8.1.md" %}})
- [3.8.0]({{% ref "core/releases/3.8.0.md" %}})
- [3.7.1]({{% ref "core/releases/3.7.1.md" %}})
- [3.7.0]({{% ref "core/releases/3.7.0.md" %}})
- [3.6.2]({{% ref "core/releases/3.6.2.md" %}})
- [3.6.1]({{% ref "core/releases/3.6.1.md" %}})
- [3.6.0]({{% ref "core/releases/3.6.0.md" %}})
- [3.5.0]({{% ref "core/releases/3.5.0.md" %}})
- [3.4.1]({{% ref "core/releases/3.4.1.md" %}})
- [3.4.0]({{% ref "core/releases/3.4.0.md" %}})
- [3.3.0]({{% ref "core/releases/3.3.0.md" %}})
- [3.2.1]({{% ref "core/releases/3.2.1.md" %}})
- [3.2.0]({{% ref "core/releases/3.2.0.md" %}})
- [3.1.0]({{% ref "core/releases/3.1.0.md" %}})
- [3.0.0]({{% ref "core/releases/3.0.0.md" %}})

### 2.x

- [2.18.1]({{% ref "core/releases/2.18.1.md" %}})
- [2.18.0]({{% ref "core/releases/2.18.0.md" %}})
- [2.17.0]({{% ref "core/releases/2.17.0.md" %}})
- [2.16.1]({{% ref "core/releases/2.16.1.md" %}})
- [2.16.0]({{% ref "core/releases/2.16.0.md" %}})
- [2.15.0]({{% ref "core/releases/2.15.0.md" %}})
- [2.14.3]({{% ref "core/releases/2.14.3.md" %}})
- [2.14.2]({{% ref "core/releases/2.14.2.md" %}})
- [2.14.1]({{% ref "core/releases/2.14.1.md" %}})
- [2.14.0]({{% ref "core/releases/2.14.0.md" %}})
- [2.13.7]({{% ref "core/releases/2.13.7.md" %}})
- [2.13.6]({{% ref "core/releases/2.13.6.md" %}})
- [2.13.5]({{% ref "core/releases/2.13.5.md" %}})
- [2.13.4]({{% ref "core/releases/2.13.4.md" %}})
- [2.13.3]({{% ref "core/releases/2.13.3.md" %}})
- [2.13.2]({{% ref "core/releases/2.13.2.md" %}})
- [2.13.1]({{% ref "core/releases/2.13.1.md" %}})
- [2.13.0]({{% ref "core/releases/2.13.0.md" %}})
- [2.12.5]({{% ref "core/releases/2.12.5.md" %}})
- [2.12.4]({{% ref "core/releases/2.12.4.md" %}})
- [2.12.3]({{% ref "core/releases/2.12.3.md" %}})
- [2.12.2]({{% ref "core/releases/2.12.2.md" %}})
- [2.12.1]({{% ref "core/releases/2.12.1.md" %}})
- [2.12.0]({{% ref "core/releases/2.12.0.md" %}})
- [2.11.3]({{% ref "core/releases/2.11.3.md" %}})
- [2.11.2]({{% ref "core/releases/2.11.2.md" %}})
- [2.11.1]({{% ref "core/releases/2.11.1.md" %}})
- [2.11.0]({{% ref "core/releases/2.11.0.md" %}})
- [2.10.3]({{% ref "core/releases/2.10.3.md" %}})
- [2.10.2]({{% ref "core/releases/2.10.2.md" %}})
- [2.10.1]({{% ref "core/releases/2.10.1.md" %}})
- [2.10.0]({{% ref "core/releases/2.10.0.md" %}})
- [2.9.1]({{% ref "core/releases/2.9.1.md" %}})
- [2.9.0]({{% ref "core/releases/2.9.0.md" %}})
- [2.8.5]({{% ref "core/releases/2.8.5.md" %}})
- [2.8.4]({{% ref "core/releases/2.8.4.md" %}})
- [2.8.3]({{% ref "core/releases/2.8.3.md" %}})
- [2.8.2]({{% ref "core/releases/2.8.2.md" %}})
- [2.8.1]({{% ref "core/releases/2.8.1.md" %}})
- [2.8.0]({{% ref "core/releases/2.8.0.md" %}})
- [2.7.3]({{% ref "core/releases/2.7.3.md" %}})
- [2.7.2]({{% ref "core/releases/2.7.2.md" %}})
- [2.7.1]({{% ref "core/releases/2.7.1.md" %}})
- [2.7.0]({{% ref "core/releases/2.7.0.md" %}})
- [2.6.3]({{% ref "core/releases/2.6.3.md" %}})
- [2.6.2]({{% ref "core/releases/2.6.2.md" %}})
- [2.6.1]({{% ref "core/releases/2.6.1.md" %}})
- [2.6.0]({{% ref "core/releases/2.6.0.md" %}})

### Earlier releases

- [0.4.15 and earlier]({{% ref "core/releases/0.4.15-and-earlier.md" %}})
