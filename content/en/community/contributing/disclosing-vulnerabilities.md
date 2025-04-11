---
title: "Disclosing vulnerabilities"
linkTitle: "Disclosing vulnerabilities"
weight: 300
description: >
  How to help the CHT stay secure
---


We take the security of our systems seriously, and we value the security community. The disclosure of security vulnerabilities helps us ensure the security and privacy of our users.

## Guidelines

We require that all researchers:

- Make every effort to avoid privacy violations, degradation of user experience, disruption to production systems, and destruction of data during security testing;
- Refrain from using any in-scope compromise as a platform to probe or conduct additional research, on any other system, regardless of scope;
- Perform research only within the scope set out below;
- Use the identified communication channels to report vulnerability information to us; and
- Keep information about any vulnerabilities you've discovered confidential between yourself and Medic until all production systems have been patched.

If you follow these guidelines when reporting an issue to us, we commit to:

- Not pursue or support any legal action related to your research;
- Work with you to understand and resolve the issue quickly (including an initial confirmation of your report within 72 hours of submission);
- Recognize your contribution on our Security Researcher Hall of Fame, if you are the first to report the issue and we make a code or configuration change based on the issue.

## In Scope

A local CHT instance is included in the scope. Follow the [manual instructions]({{< relref "hosting/4.x/app-developer" >}}) to set up a CHT instance.

## Out of scope

Any services hosted by 3rd party providers and any and all other services hosted on or beneath the medicmobile.org and hopephones.org domains are excluded from scope.

In the interest of the safety of our users, staff, the Internet at large and you as a security researcher, the following test types are excluded from scope:

- Findings from physical testing such as office access (e.g. open doors, tailgating)
- Findings derived primarily from social engineering (e.g. phishing, vishing)
- Findings from applications or systems not listed in the ‘Scope' section
- UI and UX bugs and spelling mistakes
- Network level Denial of Service (DoS/DDoS) vulnerabilities

Things we do not want to receive:

- Personally identifiable information (PII)
- Any exploits or proofs-of-concept in binary format (e.g. ELF)
