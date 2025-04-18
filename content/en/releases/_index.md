---
title: "Releases"
linkTitle: "Releases"
weight: 11
description:
  Versions currently supported, dependencies, and release notes for the CHT Core Framework
aliases:
  - /core/releases
  - /core/overview/supported-software
---


<!--

------------------------------------------------
        NOTE ABOUT NO VERSIONS IN TOC
------------------------------------------------

Versions are hidden from showing in the table
of contents by using a CSS trick in the custom.css
file located:

  /assets/css/custom.css

look for this line:

  a[href^="/releases/"] + div {
      display: none;
  }

------------------------------------------------
--> 

{{< hextra/hero-subtitle >}}
  Versions currently supported, dependencies, and release notes for the CHT Core Framework
{{< /hextra/hero-subtitle >}}

## Supported Versions

Medic supports minor versions of the CHT Core Framework for three months after the next minor version is made available, and the latest minor of a major version for twelve months after the next major version is made available.

Once a version is no longer supported it will not receive any further patch releases and upgrading to a supported version will be required to resolve any issues you have.

It is recommended that all projects update regularly multiple times a year to get the benefits of bug fixes, security patches, and performance improvements. Being on a supported version also makes it easy to start using features coming in future releases. Most upgrades are quick, reliable, and easily adopted by users. Whenever an upgrade does require additional effort this will be outlined in the release notes.

| Version | Status    | Release date | End of life |
|---------|-----------|--------------|-------------|
| 4.18.x  | Supported | 20-Mar-2025  | TBA         |
| 4.17.x  | Supported | 05-Feb-2025  | 20-Jun-2025 |
| 4.16.x  | Supported | 16-Jan-2025  | 05-May-2025 |
| 4.15.x  | Supported | 20-Nov-2024  | 16-Apr-2025 |
| 4.14.x  | EOL       | 31-Oct-2024  | 20-Feb-2025 |
| 4.13.x  | EOL       | 22-Oct-2024  | 31-Jan-2025 |
| 4.12.x  | EOL       | 02-Oct-2024  | 22-Jan-2025 |
| 4.11.x  | EOL       | 26-Sep-2024  | 02-Jan-2025 |
| 4.10.x  | EOL       | 15-Aug-2024  | 26-Dec-2024 |
| 4.9.x   | EOL       | 25-Jun-2024  | 15-Nov-2024 |
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
- [4.18.0]({{% relref "releases/4_18_0.md" %}}) - 2025-03-21
- [4.17.0]({{% relref "releases/4_17_0.md" %}}) - 2025-02-05
- [4.16.0]({{% relref "releases/4_16_0.md" %}}) - 2025-01-16
- [4.15.0]({{% relref "releases/4_15_0.md" %}}) - 2024-11-19
- [4.14.0]({{% relref "releases/4_14_0.md" %}}) - 2024-11-06
- [4.13.0]({{% relref "releases/4_13_0.md" %}}) - 2024-10-22
- [4.12.0]({{% relref "releases/4_12_0.md" %}}) - 2024-10-02
- [4.11.0]({{% relref "releases/4_11_0.md" %}}) - 2024-09-26
- [4.10.0]({{% relref "releases/4_10_0.md" %}}) - 2024-08-15
- [4.9.0]({{% relref "releases/4_9_0.md" %}}) - 2024-06-26
- [4.8.1]({{% relref "releases/4_8_1.md" %}}) - 2024-06-20
- [4.8.0]({{% relref "releases/4_8_0.md" %}}) - 2024-05-23
- [4.7.2]({{% relref "releases/4_7_2.md" %}}) - 2024-06-19
- [4.7.1]({{% relref "releases/4_7_1.md" %}}) - 2024-05-15
- [4.7.0]({{% relref "releases/4_7_0.md" %}}) - 2024-05-07
- [4.6.0]({{% relref "releases/4_6_0.md" %}}) - 2024-03-22
- [4.5.2]({{% relref "releases/4_5_2.md" %}}) - 2024-02-09
- [4.5.1]({{% relref "releases/4_5_1.md" %}}) - 2023-12-12
- [4.5.0]({{% relref "releases/4_5_0.md" %}}) - 2023-11-19
- [4.4.2]({{% relref "releases/4_4_2.md" %}}) - 2023-12-12
- [4.4.1]({{% relref "releases/4_4_1.md" %}}) - 2023-10-10
- [4.4.0]({{% relref "releases/4_4_0.md" %}}) - 2023-09-21
- [4.3.2]({{% relref "releases/4_3_2.md" %}}) - 2023-10-10
- [4.3.1]({{% relref "releases/4_3_1.md" %}}) - 2023-08-30
- [4.3.0]({{% relref "releases/4_3_0.md" %}}) - 2023-08-18
- [4.2.4]({{% relref "releases/4_2_4.md" %}}) - 2023-10-10
- [4.2.3]({{% relref "releases/4_2_3.md" %}}) - 2023-09-25
- [4.2.2]({{% relref "releases/4_2_2.md" %}}) - 2023-07-07
- [4.2.1]({{% relref "releases/4_2_1.md" %}}) - 2023-06-10
- [4.2.0]({{% relref "releases/4_2_0.md" %}}) - 2023-05-25
- [4.1.2]({{% relref "releases/4_1_2.md" %}}) - 2023-06-19
- [4.1.1]({{% relref "releases/4_1_1.md" %}}) - 2023-03-21
- [4.1.0]({{% relref "releases/4_1_0.md" %}}) - 2022-12-12
- [4.0.1]({{% relref "releases/4_0_1.md" %}}) - 2022-12-01
- [4.0.0]({{% relref "releases/4_0_0.md" %}}) - 2022-11-08

### 3.x

- [3.17.2]({{% relref "releases/3_17_2.md" %}}) - 2023-10-10
- [3.17.1]({{% relref "releases/3_17_1.md" %}}) - 2022-12-02
- [3.17.0]({{% relref "releases/3_17_0.md" %}}) - 2022-10-11
- [3.16.1]({{% relref "releases/3_16_1.md" %}}) - 2022-12-02
- [3.16.0]({{% relref "releases/3_16_0.md" %}}) - 2022-08-12
- [3.15.0]({{% relref "releases/3_15_0.md" %}}) - 2022-05-03
- [3.14.2]({{% relref "releases/3_14_2.md" %}}) - 2022-03-17
- [3.14.1]({{% relref "releases/3_14_1.md" %}}) - 2022-03-08
- [3.14.0]({{% relref "releases/3_14_0.md" %}}) - 2022-02-11
- [3.13.0]({{% relref "releases/3_13_0.md" %}}) - 2021-09-28
- [3.12.1]({{% relref "releases/3_12_1.md" %}}) - 2021-09-02
- [3.12.0]({{% relref "releases/3_12_0.md" %}}) - 2021-07-28
- [3.11.3]({{% relref "releases/3_11_3.md" %}}) - 2021-09-02
- [3.11.2]({{% relref "releases/3_11_2.md" %}}) - 2021-07-21
- [3.11.1]({{% relref "releases/3_11_1.md" %}}) - 2021-07-12
- [3.11.0]({{% relref "releases/3_11_0.md" %}}) - 2021-04-20
- [3.10.5]({{% relref "releases/3_10_5.md" %}}) - 2021-07-21
- [3.10.4]({{% relref "releases/3_10_4.md" %}}) - 2021-07-12
- [3.10.3]({{% relref "releases/3_10_3.md" %}}) - 2021-03-17
- [3.10.2]({{% relref "releases/3_10_2.md" %}}) - 2021-01-25
- [3.10.1]({{% relref "releases/3_10_1.md" %}}) - 2020-12-08
- [3.10.0]({{% relref "releases/3_10_0.md" %}}) - 2020-09-08
- [3.9.2]({{% relref "releases/3_9_2.md" %}}) - 2020-12-06
- [3.9.1]({{% relref "releases/3_9_1.md" %}}) - 2020-08-20
- [3.9.0]({{% relref "releases/3_9_0.md" %}}) - 2020-06-19
- [3.8.2]({{% relref "releases/3_8_2.md" %}}) - 2020-08-20
- [3.8.1]({{% relref "releases/3_8_1.md" %}}) - 2020-04-06
- [3.8.0]({{% relref "releases/3_8_0.md" %}}) - 2020-02-10
- [3.7.1]({{% relref "releases/3_7_1.md" %}}) - 2019-11-12
- [3.7.0]({{% relref "releases/3_7_0.md" %}}) - 2019-10-22
- [3.6.2]({{% relref "releases/3_6_2.md" %}}) - 2020-03-24
- [3.6.1]({{% relref "releases/3_6_1.md" %}}) - 2019-08-06
- [3.6.0]({{% relref "releases/3_6_0.md" %}}) - 2019-07-17
- [3.5.0]({{% relref "releases/3_5_0.md" %}}) - 2019-06-28
- [3.4.1]({{% relref "releases/3_4_1.md" %}}) - 2019-06-04
- [3.4.0]({{% relref "releases/3_4_0.md" %}}) - 2019-03-27
- [3.3.0]({{% relref "releases/3_3_0.md" %}}) - 2019-02-22
- [3.2.1]({{% relref "releases/3_2_1.md" %}}) - 2019-01-22
- [3.2.0]({{% relref "releases/3_2_0.md" %}}) - 2019-01-22
- [3.1.0]({{% relref "releases/3_1_0.md" %}}) - 2018-11-21
- [3.0.0]({{% relref "releases/3_0_0.md" %}}) - 2018-11-14

### 2.x

- [2.18.1]({{% relref "releases/2_18_1.md" %}}) - 2018-10-30
- [2.18.0]({{% relref "releases/2_18_0.md" %}}) - 2018-08-29
- [2.17.0]({{% relref "releases/2_17_0.md" %}}) - 2018-08-12
- [2.16.1]({{% relref "releases/2_16_1.md" %}}) - 2018-07-24
- [2.16.0]({{% relref "releases/2_16_0.md" %}}) - 2018-07-04
- [2.15.0]({{% relref "releases/2_15_0.md" %}}) - 2018-06-13
- [2.14.3]({{% relref "releases/2_14_3.md" %}}) - 2018-05-21
- [2.14.2]({{% relref "releases/2_14_2.md" %}}) - 2018-04-24
- [2.14.1]({{% relref "releases/2_14_1.md" %}}) - 2018-04-16
- [2.14.0]({{% relref "releases/2_14_0.md" %}}) - 2018-03-15
- [2.13.7]({{% relref "releases/2_13_7.md" %}}) - 2018-04-19
- [2.13.6]({{% relref "releases/2_13_6.md" %}}) - 2018-04-16
- [2.13.5]({{% relref "releases/2_13_5.md" %}}) - 2018-01-23
- [2.13.4]({{% relref "releases/2_13_4.md" %}}) - 2018-01-23
- [2.13.3]({{% relref "releases/2_13_3.md" %}}) - 2018-01-22
- [2.13.2]({{% relref "releases/2_13_2.md" %}}) - 2018-01-19
- [2.13.1]({{% relref "releases/2_13_1.md" %}}) - 2017-11-20
- [2.13.0]({{% relref "releases/2_13_0.md" %}}) - 2017-10-01
- [2.12.5]({{% relref "releases/2_12_5.md" %}}) - 2017-08-18
- [2.12.4]({{% relref "releases/2_12_4.md" %}}) - 2017-08-10
- [2.12.3]({{% relref "releases/2_12_3.md" %}}) - 2017-08-08
- [2.12.2]({{% relref "releases/2_12_2.md" %}}) - 2017-08-01
- [2.12.1]({{% relref "releases/2_12_1.md" %}}) - 2017-08-01
- [2.12.0]({{% relref "releases/2_12_0.md" %}}) - 2017-06-27
- [2.11.3]({{% relref "releases/2_11_3.md" %}}) - 2017-06-08
- [2.11.2]({{% relref "releases/2_11_2.md" %}}) - 2017-06-06
- [2.11.1]({{% relref "releases/2_11_1.md" %}}) - 2017-05-10
- [2.11.0]({{% relref "releases/2_11_0.md" %}}) - 2017-04-12
- [2.10.3]({{% relref "releases/2_10_3.md" %}}) - 2017-03-31
- [2.10.2]({{% relref "releases/2_10_2.md" %}}) - 2017-03-24
- [2.10.1]({{% relref "releases/2_10_1.md" %}}) - 2017-03-24
- [2.10.0]({{% relref "releases/2_10_0.md" %}}) - 2017-03-10
- [2.9.1]({{% relref "releases/2_9_1.md" %}}) - 2017-01-27
- [2.9.0]({{% relref "releases/2_9_0.md" %}}) - 2016-12-08
- [2.8.5]({{% relref "releases/2_8_5.md" %}}) - 2016-12-15
- [2.8.4]({{% relref "releases/2_8_4.md" %}}) - 2016-11-29
- [2.8.3]({{% relref "releases/2_8_3.md" %}}) - 2016-11-20
- [2.8.2]({{% relref "releases/2_8_2.md" %}}) - 2016-10-17
- [2.8.1]({{% relref "releases/2_8_1.md" %}}) - 2016-10-09
- [2.8.0]({{% relref "releases/2_8_0.md" %}}) - 2016-08-31
- [2.7.3]({{% relref "releases/2_7_3.md" %}}) - 2016-07-18
- [2.7.2]({{% relref "releases/2_7_2.md" %}}) - 2016-07-11
- [2.7.1]({{% relref "releases/2_7_1.md" %}}) - 2016-07-06
- [2.7.0]({{% relref "releases/2_7_0.md" %}}) - 2016-06-27
- [2.6.3]({{% relref "releases/2_6_3.md" %}}) - 2016-05-22
- [2.6.2]({{% relref "releases/2_6_2.md" %}}) - 2016-05-06
- [2.6.1]({{% relref "releases/2_6_1.md" %}}) - 2016-04-21
- [2.6.0]({{% relref "releases/2_6_0.md" %}}) - 2016-04-13

### Earlier releases

- [0.4.15 and earlier]({{% relref "releases/earlier" %}})
