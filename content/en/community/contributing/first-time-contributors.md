---
title: "First time Contributors Guide"
linkTitle: "First time Contributors"
weight: 1
description: >
  
---


## Who this is for

Documentation exists for everything from how to [compile]({{% ref "community/contributing/code/core/dev-environment" %}}) the CHT from source to how to [build](https://github.com/medic/cht-docs/blob/main/README.md) the docs site locally.  However, where do you start?  What if you've never contributed to an open source project before? This guide helps the newcomer make their first contribution.

If this isn't you, head over to our [Community section]({{% ref "community" %}}) where list out other actions for new community members who are not developers.

## What is the CHT

Before you write a line of code or help improve the documentation, it's important to understand the larger picture of the CHT. Read up on why you [might use the CHT]({{% ref "why-the-cht" %}}) and visit the [CHT home page](https://communityhealthtoolkit.org/). If you've never seen or used the CHT, it can be really helpful to [sign up for a demo](https://communityhealthtoolkit.org/contact).

Diving more into the technical aspects of what the CHT is, see the [technologies and tools]({{% ref "technical-resources" %}}) used by the CHT. Additionally, the [Technology Radar for CHT Contributors](https://docs.communityhealthtoolkit.org/cht-tech-radar-contributors/) gives an overview of the technologies used to build the CHT tools.

The CHT is [open source](https://en.wikipedia.org/wiki/Open_source). Any code you commit will be freely available for other CHT users and they can improve and customize it just as you might choose to do so with the code others have written.

## How code gets written

Over the years the process for writing the CHT has been codified in the [development workflow]({{% ref "community/contributing/code/workflow" %}}).  Skim this so you're aware of the basics. Check out the CHT code  [style guide]({{% ref "community/contributing/code/style-guide" %}}) as well. You don't have to memorize everything here, but it's important to know about and refer back to when the time comes to actually write code.

A good rule of thumb is to mimic the processes you see and the styles already present in the source code.

If you have never used `git` or GitHub, check out the [Get started using GitHub in less than an hour](https://github.com/skills/introduction-to-github) guide. This will help you set up a GitHub account, which you'll also need. If you haven't worked on a pull request before, check out [How to Contribute to an Open Source Project](https://egghead.io/lessons/javascript-introduction-to-github) and [How to Contribute to Open Source](https://firstcontributions.github.io/contribute-to-opensource/).

## Your first issue

Issue marked [Good first issue](https://github.com/medic/cht-core/issues?q=is%3Aopen%20is%3Aissue%20label%3A%22Good%20first%20issue%22) could be a great start if you are new to the CHT. Feel free to pick an issue that looks easy for you! An easy-looking issue will better set you up for successfully merging the code. Easy merges are our goal here!

Make a comment on the issue asking for the issue to be assigned to you.

**Note** -  [Help Wanted](https://github.com/medic/cht-core/issues?q=is%3Aopen%20is%3Aissue%20label%3A%22Help%20Wanted%22) issues do not have the extra introduction that `Good first issues` have. While you're welcome to work on them, they'll be more of a challenge for first-time contributors that likely will want some guidance found in the `Good first issues`.

## Fork the CHT

Good work! if you've gotten this far you understand what the CHT is and you know how code is written for the CHT. Now it's time to set up your very own copy of the CHT, called a fork.

Follow these steps to set up a copy of the code ("fork") which you have on your computer ("git clone"). _If you're not comfortable with the command line, [see tutorials using GUI tools.](#tutorials-using-other-tools)_


If you do not have a GitHub account, [please create one now](https://github.com/signup) as it's a requirement to fork and contribute code.


1. Create a Fork

   Fork this repository by clicking on the fork button on the top of this page.
   This will create a copy of this repository in your account.

2. Clone the repository

    <img align="right" width="300" src="https://firstcontributions.github.io/assets/Readme/clone.png" alt="clone CHT Core repository on Github" />

   Now clone the forked repository to your machine. Go to your GitHub account, open the forked repository, click on the code button, then on SSH tab and then click the _copy to clipboard_ icon.

   Open a terminal and run the following git command:

    ```bash
    git clone "url you just copied"
    ```
    <img align="right" width="300" src="https://firstcontributions.github.io/assets/Readme/copy-to-clipboard.png" alt="copy URL to clipboard" />

   where "url you just copied" (without the quotation marks) is the url to the repository (your fork of the CHT Core). See the previous steps to obtain the url.

   &nbsp; &nbsp;  <!-- avoid having clone line obscured by screenshot -->

   For example:

    ```bash
    git clone git@github.com:this-is-you/cht-core.git
    ```

   where `this-is-you` is your GitHub username. Here you're copying the contents of the first-contributions repository on GitHub to your computer.

3.  Create a branch

    Change to the repository directory on your computer (if you are not already there):

    ```bash
    cd cht-core
    ```

    Now create a branch using the `git switch` command:

    ```bash
    git switch -c TICKET-NUMBER-your-new-branch-name
    ```

    For example:

    ```bash
    git switch -c 1234-add-alonzo-church
    ```

    <details>
    <summary> <strong>If you get any errors using git switch, click here:</strong> </summary>

    If the error message "Git: `switch` is not a git command. See `git –help`" appears, it's likely because you're using an older version of git.

    In this case, try to use `git checkout` instead:

    ```bash
    git checkout -b your-new-branch-name
    ```

    </details>

## Development environment

Now that you have an idea of what the CHT is and how code gets written, go set up [your development environment]({{% ref "community/contributing/code/core/dev-environment" %}}).  Move intentionally, being sure to follow each step carefully.  If you get stuck here - or anywhere - [reach out on the forums](https://forum.communityhealthtoolkit.org/)!

Spend some time understanding how to start up and stop the development environment.


## Make necessary changes and commit those changes

Following the suggestions on the Good first issue, make the changes to the code.  Be sure the app still works and compiles with out errors.

<img align="right" width="450" src="https://firstcontributions.github.io/assets/Readme/git-status.png" alt="git status" />

If you go to the project directory and execute the command `git status`, you'll see there are changes. In this example, the `Contributors.md` file has been modified

Add any changes to the branch you just created using the `git add` command. In this example we're adding just one file, but you add multiple seperated by spaces:

```bash
git add Contributors.md
```

Now commit those changes using the `git commit` command. On your first commit, be sure reference the original ticket as shown with the `#1234` at the end:

```bash
git commit -m "Updating Contributors list per #1234"
```

## Push changes to GitHub

Push your changes using the command `git push`:

```bash
git push -u origin your-branch-name
```

replacing `your-branch-name` with the name of the branch you created earlier.

<details>
<summary> <strong>If you get a `Authentication failed` error while pushing, click here:</strong> </summary>

- ## Authentication Error
     <pre>remote: Support for password authentication was removed on August 13, 2021. Please use a personal access token instead.
  remote: Please see https://github.blog/2020-12-15-token-authentication-requirements-for-git-operations/ for more information.
  fatal: Authentication failed for 'https://github.com/<your-username>/first-contributions.git/'</pre>
  Go to [GitHub's tutorial](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account) on generating and configuring an SSH key to your account.

  Also, you might want to run 'git remote -v' to check your remote address.

  If it looks anything like this:
  <pre>origin	https://github.com/your-username/your_repo.git (fetch)
  origin	https://github.com/your-username/your_repo.git (push)</pre>

  change it using this command:
  ```bash
  git remote set-url origin git@github.com:your-username/your_repo.git
  ```
  Otherwise you'll still get prompted for username and password and get authentication error.
</details>

### Submit your changes for review

If you go to your repository on GitHub, you'll see a `Compare & pull request` button. Click on that button.

<img style="float: right;" src="https://firstcontributions.github.io/assets/Readme/compare-and-pull.png" alt="create a pull request" />

Now submit the pull request.

<img style="float: right;" src="open.pr.png" alt="submit pull request" />

You will get a notification email once the changes have been merged or when changes are requested.

Content from this section is taken from the [first-contributions](https://github.com/firstcontributions/first-contributions) which is under the [MIT License]({{% ref "./mit" %}}).

### Tutorials Using Other Tools

* [GitHub Desktop](https://github.com/firstcontributions/first-contributions/blob/main/docs/gui-tool-tutorials/github-desktop-tutorial.md)
* [Visual Studio 2017](https://github.com/firstcontributions/first-contributions/blob/main/docs/gui-tool-tutorials/github-windows-vs2017-tutorial.md)
* [GitKraken](https://github.com/firstcontributions/first-contributions/blob/main/docs/gui-tool-tutorials/gitkraken-tutorial.md)
* [Visual Studio Code](https://github.com/firstcontributions/first-contributions/blob/main/docs/gui-tool-tutorials/github-windows-vs-code-tutorial.md)
* [Atlassian Sourcetree](https://github.com/firstcontributions/first-contributions/blob/main/docs/gui-tool-tutorials/sourcetree-macos-tutorial.md)
* [IntelliJ IDEA](https://github.com/firstcontributions/first-contributions/blob/main/docs/gui-tool-tutorials/github-windows-intellij-tutorial.md)
