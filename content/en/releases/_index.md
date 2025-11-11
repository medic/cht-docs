---
title: "Releases"
linkTitle: "Releases"
weight: 11
description: "Versions currently supported, dependencies, and release notes for the CHT Core Framework"
aliases:
  - /core/releases
  - /core/overview/supported-software
  - /technical-overview/supported-software
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
| 5.0.x   | Supported | tk-Nov-2025  | TBA         |
| 4.22.x  | Supported | 10-Oct-2025  | tk-Nov-2026 |
| 4.21.x  | Supported | 25-Jun-2025  | 10-Jan-2026 |
| 4.20.x  | EOL       | 04-Jun-2025  | 25-Sep-2025 |
| 4.19.x  | EOL       | 13-May-2025  | 04-Sep-2025 |
| 4.18.x  | EOL       | 20-Mar-2025  | 13-Aug-2025 |
| 4.17.x  | EOL       | 05-Feb-2025  | 20-Jun-2025 |
| 4.16.x  | EOL       | 16-Jan-2025  | 05-May-2025 |
| 4.15.x  | EOL       | 20-Nov-2024  | 16-Apr-2025 |
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
| 2.18.x  | EOL       | 30-Aug-2018  | 15-Nov-2019 |

## Requirements

### Dependencies

The following table shows the dependencies for deploying the CHT.

| cht-core         | Supported browsers                                     | SMS bridge  | Android OS | cht-android | cht-sync |
|------------------|--------|---------|--------------------------------------------------------|-------------|------------|-------------|----------|
| **5.x.x+**       | Chrome 107+, Android System WebView 107+, Firefox latest | cht-gateway | 5.0+       | 1.5.2 +   | 1.1.0+   |
| **4.20.x+ - 4.22.x**     | Chrome 90+, Android System WebView 90+, Firefox latest   | cht-gateway | 5.0+       | 1.5.2 +     | 1.1.0+   |
| **4.16.x+**      | Chrome 90+, Android System WebView 90+, Firefox latest   | cht-gateway | 5.0+       | 1.0+        | 1.1.0+   |
| **4.4.x-4.15.x** | Chrome 90+, Android System WebView 90+, Firefox latest   | cht-gateway | 5.0+       | 1.0+        | 1.1.0+   |
| **4.0.x-4.3.x**  | Chrome 90+, Android System WebView 90+, Firefox latest   | cht-gateway | 5.0+       | 1.0+        | 1.1.0+   |
| **3.x**          | Chrome 53+, Firefox latest                               | cht-gateway | 4.4+       | 0.4.5+      | 1.1.0+   |
| **2.x**          | Chrome 30+, Firefox latest                               | cht-gateway | 4.4+       | Any         | N/A      |
| **0.4**          | Chrome 30+, Firefox latest                               | SMSSync     | N/A        | N/A         | N/A      |

{{< see-also page="/hosting/cht/requirements" title="hosting Requirements" >}}

### Client Devices

The following is the minimum specification recommendation for smartphones to handle the typical workload of front line health workers. Users with particularly high workloads or facility or supervisor workloads will require more powerful devices.

| Specification   | Minimum          | Recommended      |
|-----------------|------------------|------------------|
| Android version | 5.0              | 9.0+             |
| Processor       | 1.0GHz dual-core | 2.0GHz quad-core |
| RAM             | 1GB              | 2GB              |
| Storage         | 8GB              | 16GB             |

If CHWs will be collecting GPS data, autonomous GPS sensors in addition to assisted GPS (A-GPS) for areas with poor GSM network connectivity will enhance the quality of GPS data collected. Autonomous GPS is usually labeled in terms of the supported navigation satellite system:

- Galileo
- BDS (BeiDou)
- GLONASS
- QZSS

Devices with more navigation systems are more likely to get a more accurate location fix in varied locations. For example, Huawei Y5 has GPS specs listed on gsmarena.com as **_GPS: Yes, with A-GPS, GLONASS, BDS_** which makes it a good choice for GPS data collection.

## Release Notes

### 5.x
- [5.0.0](/releases/5_0_0) - 2025-11-tk

### 4.x
- [4.22.0](/releases/4_22_0) - 2025-10-10
- [4.21.1](/releases/4_21_1) - 2025-07-30
- [4.21.0](/releases/4_21_0) - 2025-06-25
- [4.20.1](/releases/4_20_1) - 2025-07-30
- [4.20.0](/releases/4_20_0) - 2025-06-04
- [4.19.0](/releases/4_19_0) - 2025-05-13
- [4.18.0](/releases/4_18_0) - 2025-03-21
- [4.17.0](/releases/4_17_0) - 2025-02-05
- [4.16.0](/releases/4_16_0) - 2025-01-16
- [4.15.0](/releases/4_15_0) - 2024-11-19
- [4.14.0](/releases/4_14_0) - 2024-11-06
- [4.13.0](/releases/4_13_0) - 2024-10-22
- [4.12.0](/releases/4_12_0) - 2024-10-02
- [4.11.0](/releases/4_11_0) - 2024-09-26
- [4.10.0](/releases/4_10_0) - 2024-08-15
- [4.9.0](/releases/4_9_0) - 2024-06-26
- [4.8.1](/releases/4_8_1) - 2024-06-20
- [4.8.0](/releases/4_8_0) - 2024-05-23
- [4.7.2](/releases/4_7_2) - 2024-06-19
- [4.7.1](/releases/4_7_1) - 2024-05-15
- [4.7.0](/releases/4_7_0) - 2024-05-07
- [4.6.0](/releases/4_6_0) - 2024-03-22
- [4.5.2](/releases/4_5_2) - 2024-02-09
- [4.5.1](/releases/4_5_1) - 2023-12-12
- [4.5.0](/releases/4_5_0) - 2023-11-19
- [4.4.2](/releases/4_4_2) - 2023-12-12
- [4.4.1](/releases/4_4_1) - 2023-10-10
- [4.4.0](/releases/4_4_0) - 2023-09-21
- [4.3.2](/releases/4_3_2) - 2023-10-10
- [4.3.1](/releases/4_3_1) - 2023-08-30
- [4.3.0](/releases/4_3_0) - 2023-08-18
- [4.2.4](/releases/4_2_4) - 2023-10-10
- [4.2.3](/releases/4_2_3) - 2023-09-25
- [4.2.2](/releases/4_2_2) - 2023-07-07
- [4.2.1](/releases/4_2_1) - 2023-06-10
- [4.2.0](/releases/4_2_0) - 2023-05-25
- [4.1.2](/releases/4_1_2) - 2023-06-19
- [4.1.1](/releases/4_1_1) - 2023-03-21
- [4.1.0](/releases/4_1_0) - 2022-12-12
- [4.0.1](/releases/4_0_1) - 2022-12-01
- [4.0.0](/releases/4_0_0) - 2022-11-08

### 3.x

- [3.17.2](/releases/3_17_2) - 2023-10-10
- [3.17.1](/releases/3_17_1) - 2022-12-02
- [3.17.0](/releases/3_17_0) - 2022-10-11
- [3.16.1](/releases/3_16_1) - 2022-12-02
- [3.16.0](/releases/3_16_0) - 2022-08-12
- [3.15.0](/releases/3_15_0) - 2022-05-03
- [3.14.2](/releases/3_14_2) - 2022-03-17
- [3.14.1](/releases/3_14_1) - 2022-03-08
- [3.14.0](/releases/3_14_0) - 2022-02-11
- [3.13.0](/releases/3_13_0) - 2021-09-28
- [3.12.1](/releases/3_12_1) - 2021-09-02
- [3.12.0](/releases/3_12_0) - 2021-07-28
- [3.11.3](/releases/3_11_3) - 2021-09-02
- [3.11.2](/releases/3_11_2) - 2021-07-21
- [3.11.1](/releases/3_11_1) - 2021-07-12
- [3.11.0](/releases/3_11_0) - 2021-04-20
- [3.10.5](/releases/3_10_5) - 2021-07-21
- [3.10.4](/releases/3_10_4) - 2021-07-12
- [3.10.3](/releases/3_10_3) - 2021-03-17
- [3.10.2](/releases/3_10_2) - 2021-01-25
- [3.10.1](/releases/3_10_1) - 2020-12-08
- [3.10.0](/releases/3_10_0) - 2020-09-08
- [3.9.2](/releases/3_9_2) - 2020-12-06
- [3.9.1](/releases/3_9_1) - 2020-08-20
- [3.9.0](/releases/3_9_0) - 2020-06-19
- [3.8.2](/releases/3_8_2) - 2020-08-20
- [3.8.1](/releases/3_8_1) - 2020-04-06
- [3.8.0](/releases/3_8_0) - 2020-02-10
- [3.7.1](/releases/3_7_1) - 2019-11-12
- [3.7.0](/releases/3_7_0) - 2019-10-22
- [3.6.2](/releases/3_6_2) - 2020-03-24
- [3.6.1](/releases/3_6_1) - 2019-08-06
- [3.6.0](/releases/3_6_0) - 2019-07-17
- [3.5.0](/releases/3_5_0) - 2019-06-28
- [3.4.1](/releases/3_4_1) - 2019-06-04
- [3.4.0](/releases/3_4_0) - 2019-03-27
- [3.3.0](/releases/3_3_0) - 2019-02-22
- [3.2.1](/releases/3_2_1) - 2019-01-22
- [3.2.0](/releases/3_2_0) - 2019-01-22
- [3.1.0](/releases/3_1_0) - 2018-11-21
- [3.0.0](/releases/3_0_0) - 2018-11-14

### 2.x

- [2.18.1](/releases/2_18_1) - 2018-10-30
- [2.18.0](/releases/2_18_0) - 2018-08-29
- [2.17.0](/releases/2_17_0) - 2018-08-12
- [2.16.1](/releases/2_16_1) - 2018-07-24
- [2.16.0](/releases/2_16_0) - 2018-07-04
- [2.15.0](/releases/2_15_0) - 2018-06-13
- [2.14.3](/releases/2_14_3) - 2018-05-21
- [2.14.2](/releases/2_14_2) - 2018-04-24
- [2.14.1](/releases/2_14_1) - 2018-04-16
- [2.14.0](/releases/2_14_0) - 2018-03-15
- [2.13.7](/releases/2_13_7) - 2018-04-19
- [2.13.6](/releases/2_13_6) - 2018-04-16
- [2.13.5](/releases/2_13_5) - 2018-01-23
- [2.13.4](/releases/2_13_4) - 2018-01-23
- [2.13.3](/releases/2_13_3) - 2018-01-22
- [2.13.2](/releases/2_13_2) - 2018-01-19
- [2.13.1](/releases/2_13_1) - 2017-11-20
- [2.13.0](/releases/2_13_0) - 2017-10-01
- [2.12.5](/releases/2_12_5) - 2017-08-18
- [2.12.4](/releases/2_12_4) - 2017-08-10
- [2.12.3](/releases/2_12_3) - 2017-08-08
- [2.12.2](/releases/2_12_2) - 2017-08-01
- [2.12.1](/releases/2_12_1) - 2017-08-01
- [2.12.0](/releases/2_12_0) - 2017-06-27
- [2.11.3](/releases/2_11_3) - 2017-06-08
- [2.11.2](/releases/2_11_2) - 2017-06-06
- [2.11.1](/releases/2_11_1) - 2017-05-10
- [2.11.0](/releases/2_11_0) - 2017-04-12
- [2.10.3](/releases/2_10_3) - 2017-03-31
- [2.10.2](/releases/2_10_2) - 2017-03-24
- [2.10.1](/releases/2_10_1) - 2017-03-24
- [2.10.0](/releases/2_10_0) - 2017-03-10
- [2.9.1](/releases/2_9_1) - 2017-01-27
- [2.9.0](/releases/2_9_0) - 2016-12-08
- [2.8.5](/releases/2_8_5) - 2016-12-15
- [2.8.4](/releases/2_8_4) - 2016-11-29
- [2.8.3](/releases/2_8_3) - 2016-11-20
- [2.8.2](/releases/2_8_2) - 2016-10-17
- [2.8.1](/releases/2_8_1) - 2016-10-09
- [2.8.0](/releases/2_8_0) - 2016-08-31
- [2.7.3](/releases/2_7_3) - 2016-07-18
- [2.7.2](/releases/2_7_2) - 2016-07-11
- [2.7.1](/releases/2_7_1) - 2016-07-06
- [2.7.0](/releases/2_7_0) - 2016-06-27
- [2.6.3](/releases/2_6_3) - 2016-05-22
- [2.6.2](/releases/2_6_2) - 2016-05-06
- [2.6.1](/releases/2_6_1) - 2016-04-21
- [2.6.0](/releases/2_6_0) - 2016-04-13

### Earlier releases

- [0.4.15 and earlier](/releases/earlier)
