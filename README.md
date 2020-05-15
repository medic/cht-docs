# Documentation for the Community Health Tookit

## About

This repo contains documentation for the Community Health Toolkit (CHT), and how to build digital health applications with [CHT Core](https://github.com/medic/cht-core).

The documentation is built using Markdown pages, which can be converted into a navigatable website using a static-site-generator. The Hugo static-site-generator is being used with the Docsy theme as an example for now. To maintain portability content should be written in plain Markdown with limited use of HTML, custom shortcodes, and modifications to the theme. 

## Building the documentation

1. Get local copies of the project submodules so you can build and run your site locally:
   - `git submodule update --init --recursive`

2. Build your site:
   - `hugo server`

3. Preview your site in your browser at: http://localhost:1313/

## Publishing the documentation

**Prerequisite**: Hugo installed with the "extended" Sass/SCSS version

### Manual 
1. Follow [the Docsy instructions](https://www.docsy.dev/docs/getting-started/#install-postcss) to install postcss
   1. `sudo npm install -D --save autoprefixer`
   2. `sudo npm install -D --save postcss-cli`

2. Follow [the Hugo intructions](https://gohugo.io/hosting-and-deployment/hosting-on-github/#build-and-deployment) for publishing a project to GitHub pages using the `gh-pages` branch
   1. `rm -rf public`
   2. `git worktree add -B gh-pages public upstream/gh-pages`
   3. `hugo`
   4. `cd public && git add --all && git commit -m "Publishing to gh-pages" && cd ..` Feel free to make a pertinent commit message!
   5. `git push upstream gh-pages`
3. Repeat step 2 to update after any changes to master.

### Scripted
1. Run the script to publish to GitHub Pages
   1. `./publish_to_ghpages.sh`
