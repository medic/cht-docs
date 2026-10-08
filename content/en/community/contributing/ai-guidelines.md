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

## Why This Matters

Disclosure is respectful to the humans reviewing your work, as it helps maintainers understand the context of your contribution, know how much scrutiny to apply during review and provide better feedback when needed. Maintainers have limited time and want to focus on helping you ship great contributions rather than debugging AI-generated issues.

For you as a contributor, transparency sets appropriate expectations with reviewers and helps you get more relevant feedback aligned with your development process. It builds trust with the community and demonstrates your commitment to quality.

{{< callout type="warning" icon="book-open" >}}
  This document is heavily inspired by Digital Ocean's [How to Be an Open Source Hero: Contributing AI-Generated Code with Care](https://www.digitalocean.com/community/tutorials/ai-coding-tools-open-source#a-practical-guide-to-disclosure).
{{< /callout >}}

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
> AI Disclosure: This PR was written primarily by Claude Code.

**Better:**
> AI Disclosure: Used ChatGPT to understand the codebase structure. 
> I implemented the solution manually and wrote all tests myself.

**Detailed:**
> AI Disclosure: GitHub Copilot suggested the initial approach. 
> I adapted it to match our project conventions, simplified the logic, 
> and added comprehensive tests including edge cases.

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
- **Verify dependencies and license compatibility**. Ensure any libraries suggested by AI are appropriate for the CHT context, properly licensed, and compatible with the supported technologies.

## Running AI Agents in a Sandbox

Whether you contribute code, build CHT apps, host CHT instances, or work with program data, you probably have access to information worth protecting. This can include logins for CHT instances and servers, ssh credentials, and data exports that contain personal health information. Communities trust the health programs that use the CHT to protect this information.

AI agents, such as Claude Code, can run commands, install packages, edit files, and connect to the internet on your behalf. Unless you set them up otherwise, they do all of this with the same permissions you have.

> [!NOTE]
> **Remember: AI agents can access everything you can.**

### What could go wrong

Most of the time, agents do what you ask. But because they have the same access as you, a few things can go wrong:

- **Agents can see things you didn't mean to share.** An agent can read your SSH keys, cloud and GitHub credentials, `.env` files, browser data, and any data exports saved on your computer.
- **Agents read untrusted content.** Issues, pull request comments, web pages, package READMEs, and MCP tool results can all contain hidden instructions. This is called _prompt injection_. A successful injection can direct the agent to leak secrets or run harmful commands, and the agent cannot reliably tell these instructions apart from yours.
- **Agents make mistakes.** An agent that misreads a task can delete files, overwrite uncommitted work, force-push a branch, or remove the Docker volumes that hold your local CouchDB data.

#### Why use a sandbox

You could manage these risks by being extra careful: approving every command yourself, keeping sensitive files off the computer you use with agents, and following a security checklist every session. That takes a lot of effort, and it's easy to make a mistake. CHT maintainers have found it quicker and easier to work alongside agents in a _sandbox_. A sandbox lets an agent work freely on your project but blocks it from reaching your credentials and other files unless you allow it.

Built-in agent guardrails are not a security boundary. Permission rules built into an agent are enforced by the agent itself. On the other hand, a sandbox enforced by the operating system applies to the agent and to every process it starts, no matter what the model decides to do.

### Recommended Sandbox: `nono`

The [nono](https://nono.sh/) sandboxing utility offers a good balance of simplicity, functionality, and configurability. To get started with `nono`, follow the [installation guide](https://nono.sh/docs/cli/getting_started/installation) for your platform.

Once `nono` has been installed, running Claude inside the sandbox is as simple as:

```bash
nono pull nolabs-ai/claude
nono run --profile nolabs-ai/claude --allow-cwd -- claude
```

This starts Claude with the `nolabs-ai/claude` profile which gives access to the various necessary Claude configuration directories, full read/write access to the contents of the current directory, and access to the network. Access to sensitive locations such as your SSH keys and cloud credentials is blocked. This is a reasonable default sandbox that balances functionality with security.   

`nono` also makes it easy to [create a custom profile](https://nono.sh/docs/cli/features/profiles-groups#profiles) (e.g. one that extends `nolabs-ai/claude`) with additional configurations.

{{< callout type="warning" >}}
Even inside a sandbox, keep production credentials and personal health information out of the directories you give your agent access to. By default, `nono` gives the agent access to your user's environment variables.

Avoid storing sensitive information such as API keys or passwords on disk or in environment variables. Instead, leverage `nono`'s [credential injection](https://nono.sh/docs/cli/features/credential-injection) to load the necessary credentials from a secure store such as your system keyring or 1Password.
{{< /callout >}}

#### Shell Alias

To avoid typing the full `nono` command every time, add an alias to your shell configuration file. For Bash, add this line to `~/.bashrc`:

```bash
alias claude-sbx='nono run --profile nolabs-ai/claude --allow-cwd -- claude'
```

Reload your configuration with `source ~/.bashrc`, or open a new terminal. Then start a sandboxed Claude session from your project directory:

```bash
claude-sbx
```
