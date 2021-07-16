---
title: "Obtaining Logs"
linkTitle: "Obtaining Logs"
weight: 
description: >
  How to obtain logs from an instance
relatedContent: >
  
---

There are many places where useful logs reside. This details all those places, and the easiest way to get a hold of them.

## Browser logs

To check if there are relevant logs open up the developer console. The shortcut is probably COMMAND+ALT+I on MacOS, or CTRL+ALT+I on Linux and Windows. Click the console tab and copy out any errors or logging that you think is relevant.

## Server logs

The easiest way is to use `cht-logs`, a tool that comes with [`cht-conf`](https://github.com/medic/cht-conf):

```
cht-logs anInstance gardener
```

See [cht-logs documentation](https://github.com/medic/cht-conf#user-content-fetching-logs) for more details.

This will download logs to your current directory. You will need to look through these logs to work out what is relevant.