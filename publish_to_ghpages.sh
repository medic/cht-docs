#!/bin/sh

# exit when any command fails
set -e

# Base script from https://gohugo.io/hosting-and-deployment/hosting-on-github/#put-it-into-a-script-1

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
