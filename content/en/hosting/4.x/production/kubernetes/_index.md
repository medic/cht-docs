---
title: "Kubernetes Production Hosting in CHT 4.x"
linkTitle: "Kubernetes"
weight: 2
description: >
    Production hosting the CHT 
relatedContent: >
    hosting/requirements
    hosting/kubernetes-vs-docker
---
Kubernetes is more complex set up of CHT hosting over [Docker]({{< relref "hosting/4.x/production/docker" >}}) .  It enables maximum scalability for multi-node CouchDB and multi-tenant deployments.

## Introduction

[K3s](https://k3s.io) is a lightweight Kubernetes distribution and has no external dependencies.

However you plan on pushing CHT Core to k3s cluster just make sure all the requirements as per CHT [requirements](https://docs.communityhealthtoolkit.org/hosting/requirements).

## K3s minimal component:

* A fully functional Kubernetes cluster
* Sqlite as storage backend instead of etcd
* Containerd as default container runtime (not Docker)
* Flannel as container network plugin by default
* Traefik as Ingress controller
* Local storage provisioner as default StorageClass for persistent volumes

## Installation Options

#### **Installation Script**

Use the installation script to set up K3s as a service and by using the installation script we install K3s as systemd and openrc based systems.

To install K3s using the installation script, follow these steps:

1. **Download the Installation Script** :

```

   curl -sfL https://get.k3s.io | sh -

```

   This command downloads the script and runs it, installing K3s as a service on your system.

2. **Configuration Options** :

* You can use environment variables prefixed with `K3S_` or pass command flags to configure K3s2.
* For example, to set the server address:

```

  exportK3S_SERVER=https://your-server-address:6443

  curl -sfL https://get.k3s.io | sh -
```


3. **Verify the Installation** :
   The below command checks if K3s is running and lists the nodes in your cluster.

```

   k3s kubectl get nodes

```

#### Installing with binary

The installation script is primarily concerned with configuring K3s to run as a service.

If you choose to not use the script, you can run K3s simply by downloading the binary from our release page, placing it on your path, and executing it.

```

curl -Lo /usr/local/bin/k3s https://github.com/k3s-io/k3s/releases/download/v1.26.5+k3s1/k3s; chmod a+x /usr/local/bin/k3s

```

You can pass configuration by setting K3S_ environment variables:

```

k3s server --write-kubeconfig-mode=644

```

Or command flags:

```

k3s server --write-kubeconfig-mode=644

```

### Advanced Options / Configuration

For more details look [here](https://docs.k3s.io/installation)
