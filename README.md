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

