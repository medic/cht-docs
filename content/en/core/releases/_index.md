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
  hosting/
  hosting/requirements/
---

## Supported Versions

Medic supports minor versions of the CHT Core Framework for three months after the next minor version is made available, and the latest minor of a major version for twelve months after the next major version is made available.

Once a version is no longer supported it will not receive any further patch releases and upgrading to a supported version will be required to resolve any issues you have.

It is recommended that all projects update regularly multiple times a year to get the benefits of bug fixes, security patches, and performance improvements. Being on a supported version also makes it easy to start using features coming in future releases. Most upgrades are quick, reliable, and easily adopted by users. Whenever an upgrade does require additional effort this will be outlined in the release notes.

| Version | Status    | Release date | End of life |
|---------|-----------|--------------|-------------|
| 4.13.x  | Supported | 22-Oct-2024  | TBA         |
| 4.12.x  | Supported | 02-Oct-2024  | 22-Jan-2025 |
| 4.11.x  | Supported | 26-Sep-2024  | 02-Jan-2025 |
| 4.10.x  | Supported | 15-Aug-2024  | 26-Dec-2024 |
| 4.9.x   | Supported | 25-Jun-2024  | 15-Nov-2024 |
| 4.8.x   | EOL       | 22-May-2024  | 25-Sep-2024 |
| 4.7.x   | EOL       | 07-May-2024  | 22-Aug-2024 |
| 4.6.x   | EOL       | 20-Mar-2024  | 10-Aug-2024 |
| 4.5.x   | EOL       | 20-Nov-2023  | 20-Jun-2024 |
| 4.4.x   | EOL       | 20-Sep-2023  | 20-Feb-2024 |
| 4.3.x   | EOL       | 18-Aug-2023  | 20-Dec-2023 |
| 4.2.x   | EOL       | 25-May-2023  | 18-Nov-2023 |
| 4.1.x   | EOL       | 12-Dec-2022  | 25-Aug-2023 |
| 4.0.x   | EOL       | 03-Nov-2022  | 12-Mar-2023 |
| 3.17.x  | EOL       | 11-Oct-2022  | 03-Nov-2023 |
| 3.16.x  | EOL       | 3-Aug-2022   | 11-Jan-2023 |
| 3.15.x  | EOL       | 4-May-2022   | 3-Nov-2022  |
| 3.14.x  | EOL       | 11-Feb-2022  | 4-Aug-2022  |
| 3.13.x  | EOL       | 29-Sep-2021  | 11-May-2022 |
| 3.12.x  | EOL       | 28-Jul-2021  | 29-Dec-2021 |
| 3.11.x  | EOL       | 21-Apr-2021  | 28-Oct-2021 |
| 3.10.x  | EOL       | 9-Sep-2020   | 21-Jul-2021 |
| 3.9.x   | EOL       | 19-Jun-2020  | 9-Dec-2020  |
| 3.8.x   | EOL       | 11-Feb-2020  | 19-Sep-2020 |
| 3.7.x   | EOL       | 22-Oct-2019  | 11-Jun-2020 |
| 3.6.x   | EOL       | 17-Jul-2019  | 24-Mar-2020 |
| 3.5.x   | EOL       | 27-Jun-2019  | 17-Oct-2019 |
| 3.4.x   | EOL       | 27-Mar-2019  | 27-Sep-2019 |
| 3.3.x   | EOL       | 22-Feb-2019  | 27-Jun-2019 |
| 3.2.x   | EOL       | 23-Jan-2019  | 22-May-2019 |
| 3.1.x   | EOL       | 21-Nov-2018  | 23-Apr-2019 |
| 3.0.x   | EOL       | 15-Nov-2018  | 21-Feb-2019 |
| 2.18.x  | EOL       | 30-Aug-2018  | 15-Nov-2019 |
| earlier | EOL       | ...          | 30-Nov-2018 |

## Requirements

### Dependencies

The following table shows the dependencies for deploying the CHT.

| cht-core | NodeJS | CouchDB | Supported browsers | SMS bridge | Android OS | cht-android | cht-sync |
|----|----|----|----|----|----|----|---|
| **4.4.x+** | N/A | 3.3.2+ | Chrome 90+, Android System WebView 90+, Firefox latest | cht-gateway | 5.0+ | 1.0+ | 1.1.0+ |
| **4.0.x-4.3.x** | N/A | 2.x | Chrome 90+, Android System WebView 90+, Firefox latest | cht-gateway | 5.0+ | 1.0+ | 1.1.0+ |
| **3.x** | 8.11+ | 2.x | Chrome 53+, Firefox latest | cht-gateway | 4.4+ | 0.4.5+ | 1.1.0+ |
| **2.x** | 6+ | 1.6+ | Chrome 30+, Firefox latest | cht-gateway | 4.4+ | Any | N/A |
| **0.4** | 0.12+ | 1.6+ | Chrome 30+, Firefox latest | SMSSync | N/A | N/A | N/A |

{{< see-also page="hosting/requirements" title="Hosting Requirements" >}}

### Client Devices

The following is the minimum specification recommendation for smartphones to handle the typical workload of front line health workers. Users with particularly high workloads or facility or supervisor workloads will require more powerful devices.

| Specification | Minimum | Recommended |
|--|--| -- |
| Android version | 5.0 | 9.0+ |
| Processor | 1.0GHz dual-core |  2.0GHz quad-core |
| RAM | 1GB | 2GB |
| Storage | 8GB | 16GB |

If CHWs will be collecting GPS data, autonomous GPS sensors in addition to assisted GPS (A-GPS) for areas with poor GSM network connectivity will enhance the quality of GPS data collected. Autonomous GPS is usually labeled in terms of the supported navigation satellite system:

- Galileo
- BDS (BeiDou)
- GLONASS
- QZSS

Devices with more navigation systems are more likely to get a more accurate location fix in varied locations. For example, Huawei Y5 has GPS specs listed on gsmarena.com as **_GPS: Yes, with A-GPS, GLONASS, BDS_** which makes it a good choice for GPS data collection.


## Release Notes

### 4.x

- [4.13.0]({{% ref "core/releases/4.13.0.md" %}})
- [4.12.0]({{% ref "core/releases/4.12.0.md" %}})
- [4.11.0]({{% ref "core/releases/4.11.0.md" %}})
- [4.10.0]({{% ref "core/releases/4.10.0.md" %}})
- [4.9.0]({{% ref "core/releases/4.9.0.md" %}})
- [4.8.1]({{% ref "core/releases/4.8.1.md" %}})
- [4.8.0]({{% ref "core/releases/4.8.0.md" %}})
- [4.7.2]({{% ref "core/releases/4.7.2.md" %}})
- [4.7.1]({{% ref "core/releases/4.7.1.md" %}})
- [4.7.0]({{% ref "core/releases/4.7.0.md" %}})
- [4.6.0]({{% ref "core/releases/4.6.0.md" %}})
- [4.5.2]({{% ref "core/releases/4.5.2.md" %}})
- [4.5.1]({{% ref "core/releases/4.5.1.md" %}})
- [4.5.0]({{% ref "core/releases/4.5.0.md" %}})
- [4.4.2]({{% ref "core/releases/4.4.2.md" %}})
- [4.4.1]({{% ref "core/releases/4.4.1.md" %}})
- [4.4.0]({{% ref "core/releases/4.4.0.md" %}})
- [4.3.2]({{% ref "core/releases/4.3.2.md" %}})
- [4.3.1]({{% ref "core/releases/4.3.1.md" %}})
- [4.3.0]({{% ref "core/releases/4.3.0.md" %}})
- [4.2.4]({{% ref "core/releases/4.2.4.md" %}})
- [4.2.3]({{% ref "core/releases/4.2.3.md" %}})
- [4.2.2]({{% ref "core/releases/4.2.2.md" %}})
- [4.2.1]({{% ref "core/releases/4.2.1.md" %}})
- [4.2.0]({{% ref "core/releases/4.2.0.md" %}})
- [4.1.2]({{% ref "core/releases/4.1.2.md" %}})
- [4.1.1]({{% ref "core/releases/4.1.1.md" %}})
- [4.1.0]({{% ref "core/releases/4.1.0.md" %}})
- [4.0.1]({{% ref "core/releases/4.0.1.md" %}})
- [4.0.0]({{% ref "core/releases/4.0.0.md" %}})

### 3.x

- [3.17.2]({{% ref "core/releases/3.17.2.md" %}})
- [3.17.1]({{% ref "core/releases/3.17.1.md" %}})
- [3.17.0]({{% ref "core/releases/3.17.0.md" %}})
- [3.16.1]({{% ref "core/releases/3.16.1.md" %}})
- [3.16.0]({{% ref "core/releases/3.16.0.md" %}})
- [3.15.0]({{% ref "core/releases/3.15.0.md" %}})
- [3.14.2]({{% ref "core/releases/3.14.2.md" %}})
- [3.14.1]({{% ref "core/releases/3.14.1.md" %}})
- [3.14.0]({{% ref "core/releases/3.14.0.md" %}})
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
