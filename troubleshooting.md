# Troubleshooting 

The first thing to check, regardless of your OS, is that you are running the correct version of Hugo and that it's the Extended version:

```shell
hugo version
```  

This will show something like:


```shell
hugo v0.108.0+extended darwin/arm64 BuildDate=unknown VendorInfo=macports
```

In this example, `0.108.0` is the release and `+extended` indicates that it is the extended version.

You can see the list of Hugo releases [here](https://github.com/gohugoio/hugo/releases). 

## MacOS 

### Hugo "fatal error: pipe failed" 
MacOS users encountering the `fatal error: pipe failed` error when running `hugo server` need to run these commands:

```shell
sudo launchctl limit maxfiles 65535 200000
ulimit -n 65535
sudo sysctl -w kern.maxfiles=100000
sudo sysctl -w kern.maxfilesperproc=65535
```

To ensure these calls are made every time before running `hugo server`, consider using this script. Be sure to update the `HUGO_DIRECTORY` to match your install:

```shell
#!/bin/bash
cd /Users/HUGO_DIRECTORY/cht-docs
sudo launchctl limit maxfiles 65535 200000
ulimit -n 65535
sudo sysctl -w kern.maxfiles=100000
sudo sysctl -w kern.maxfilesperproc=65535
hugo server
```

Save this in file with the `.command` suffix (e.g. `cht-docs-server.command`) to enable an easy double clicking to start the server.

Note - be sure to enter your MacOS user password in the terminal when prompted. 

### Hugo "Error: failed to download modules: binary with name "go" not found" 
MacOS M1 users encountering `Error: failed to download modules: binary with name "go" not found` when running `hugo server` need to install Golang by running:

```shell
brew install golang
```

