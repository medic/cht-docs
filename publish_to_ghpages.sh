#!/bin/sh

# exit when any command fails
set -e

# Base script from https://gohugo.io/hosting-and-deployment/hosting-on-github/#put-it-into-a-script-1

# Run the script to publish to GitHub Pages
#
# **Prerequisite**: Hugo installed with the "extended" Sass/SCSS version
#
# This script is the equivalent to the following manual instructions:
#
# 1. Follow [the Docsy instructions](https://www.docsy.dev/docs/getting-started/#install-postcss) to install postcss
#    1. `sudo npm install -D --save autoprefixer`
#    2. `sudo npm install -D --save postcss-cli`

# 2. Follow [the Hugo instructions](https://gohugo.io/hosting-and-deployment/hosting-on-github/#build-and-deployment) for publishing a project to GitHub pages using the `gh-pages` branch
#    1. `rm -rf public`
#    2. `git worktree add -B gh-pages public upstream/gh-pages`
#    3. `hugo`
#    4. `cd public && git add --all && git commit -m "Publishing to gh-pages" && cd ..` Feel free to make a pertinent commit message!
#    5. `git push upstream gh-pages`
# 3. Repeat step 2 to update after any changes to main.
#

if [ "`git status -s`" ]
then
    echo "The working directory is dirty! Please commit any pending changes."
    exit 1;
fi

echo "Deleting old publication"
rm -rf public
mkdir public
git worktree prune
rm -rf .git/worktrees/public/

echo "Checking out gh-pages branch into public"
git worktree add -B gh-pages public origin/gh-pages

echo "Removing existing files"
rm -rf public/*

echo "Generating site"
hugo

echo "Updating gh-pages branch"
cd public && git add --all && git commit -m "Publishing to gh-pages (via script)"

echo "Pushing to github"
git push --all
