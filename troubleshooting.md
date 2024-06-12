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

## Which `hugo` version to run

There's currently an [issue running versions later than `0.123` or later](https://github.com/medic/cht-docs/issues/1302).  You should run `0.122` to avoid the error until this issue is fixed.  Follow these steps to install the older `0.122` version.  While they mention `snap` which is specific to Linux, the install steps should work for macOS and Windows with WSL 2 as well: 

1. Remove the too new version of `hugo`.  If you used `snap`, you can uninstall with: `sudo snap remove hugo`
2. Download the specific `hugo` tarball: `wget https://github.com/gohugoio/hugo/releases/download/v0.122.0/hugo_extended_0.122.0_linux-amd64.tar.gz`
3. Uncompressed it: `tar xvzf hugo_extended_0.122.0_linux-amd64.tar.gz`
4. Move the binary into your `$PATH`: `sudo mv hugo /usr/local/bin`

If you were running the `snap` version of `hugo`, you may need to install `go` now as it was removed with `hugo`.  This should work with `sudo snap install go`. Other platforms that need to install Go should see their [install docs](https://golang.org/doc/install).


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

### Hugo "Error: Error building site: POSTCSS"
MacOS M1 users encountering `Error: Error building site: POSTCSS: failed to transform "scss/main.css" (text/css)` when running `hugo server` need to install `postcss-cli` by running:

```shell
npm install postcss-cli
```
