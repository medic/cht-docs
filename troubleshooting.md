# Troubleshooting 

## MacOS 

### Hugo "fatal error: pipe failed" 
MacOS users encountering the `fatal error: pipe failed` error when running `hugo server` need to run these commands:

```shell
sudo launchctl limit maxfiles 65535 200000
ulimit -n 65535
sudo sysctl -w kern.maxfiles=100000
sudo sysctl -w kern.maxfilesperproc=65535
```

To ensure these calls are made every time before runing `hugo server`, consider using this script. Be sure to update the `HUGO_DIRECTORY` to match your install:

```shell
#!/bin/bash
cd /Users/HUGO_DIRECTORY/cht-docs
sudo launchctl limit maxfiles 65535 200000
ulimit -n 65535
sudo sysctl -w kern.maxfiles=100000
sudo sysctl -w kern.maxfilesperproc=65535
hugo server
```

Save this in file with the `.commmand` suffix (e.g. `cht-docs-server.command`) to enable an easy double clicking to start the server.

Note - be sure to enter your MacOS user password in the terminal when prompted. 

### Hugo "Error: failed to download modules: binary with name "go" not found" 
MacOS M1 users encountering `Error: failed to download modules: binary with name "go" not found` when running `hugo server` need to install Golang by running:

```shell
brew install golang
```

### Hugo "Error: Error building site: POSTCSS"
MacOS M1 users encountering `Error: Error building site: POSTCSS: failed to transform "scss/main.css" (text/css)` when running `hugo server` need to install `postcss-cli` by running:

```shell
npm install postcss-cli
```