---
title: "AI Assistance Guidelines"
linkTitle: "AI Guidelines"
weight: 4
description: >
  AI assistance guidelines for CHT contributors
relatedContent: >
  community/contributing/code-of-conduct
---

AI coding tools can help contributors explore unfamiliar codebases, draft solutions quickly, and learn new frameworks and technologies. In the CHT Community, we recognize that AI assistance can accelerate contributions and lower barriers to participation. These guidelines help ensure that AI-assisted contributions maintain the CHT quality standards while respecting the time and expertise of the maintainers and community members.

To make the review process smooth and transparent, we ask that you follow the following guidelines.

## Disclosure Guidelines

{{< callout >}}
If you use AI assistance for your contribution, kindly disclose it in your pull request description.
{{< /callout >}}

Transparency helps maintainers understand your development process and adjust their review approach accordingly. A simple disclosure takes just a moment but provides valuable context.

Include:
- Which tool you used (for example, "Claude Code", "GitHub Copilot", "ChatGPT")
- How you used it (for example, "generated initial code", "helped understand the codebase", "wrote documentation")

Examples of helpful disclosure: 

**Simple:**
```
AI Disclosure: This PR was written primarily by Claude Code.
```

**Better:**
```
AI Disclosure: Used ChatGPT to understand the codebase structure. 
I implemented the solution manually and wrote all tests myself.
```

**Detailed:**
```
AI Disclosure: GitHub Copilot suggested the initial approach. 
I adapted it to match our project conventions, simplified the logic, 
and added comprehensive tests including edge cases.
```

### What Needs Disclosure?

Disclose code generation or significant rewrites, help with debugging or understanding architecture, documentation or comment writing. No disclosure needed for simple tab-completion, minor syntax fixes or refactoring suggested by your IDE. 

{{< callout type="warning" icon="users" >}}
**When in doubt, disclose.** It takes a moment and helps reviewers understand your contribution. 
{{< /callout >}}

## Your Responsibility

AI assistance is a tool, not a substitute for your judgment and understanding. When using AI assistance, you remain fully accountable for the contribution you submit:

- **Understand the code.** You should be able to explain what it does and why you made specific choices during the review process.
- **Review thoroughly.** Check for correctness, security implications, and performance considerations. Remove placeholders, TODO comments, or generic error messages. Ensure the code follows CHT coding conventions and style guidelines.
- **Test comprehensively.** Add tests for edge cases, not just the happy path. If you fixed a bug, include a regression test. AI-generated tests can miss corner cases that human reviewers will catch.
- **Own the quality.** Treat AI like a junior collaborator who needs supervision; you are the one signing off on the work. The CHT community and end users depend on the reliability of your contribution.

## Why This Matters

Disclosure is respectful to the humans reviewing your work, as it helps maintainers understand the context of your contribution, know how much scrutiny to apply during review and provide better feedback when needed. Maintainers have limited time and want to focus on helping you ship great contributions rather than debugging AI-generated issues.

For you as a contributor, transparency sets appropriate expectations with reviewers and helps you get more relevant feedback aligned with your development process. It builds trust with the community and demonstrates your commitment to quality.

{{< callout type="warning" icon="book-open" >}}
  This document is heavily inspired by Digital Ocean's [How to Be an Open Source Hero: Contributing AI-Generated Code with Care](https://www.digitalocean.com/community/tutorials/ai-coding-tools-open-source#a-practical-guide-to-disclosure).
{{< /callout >}}