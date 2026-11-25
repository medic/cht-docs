---
title: "Local Development with KIND"
linkTitle: "Local KIND Development"
weight: 1
description: >
  Deploy the interoperability stack locally using KIND (Kubernetes in Docker)
---

## Overview

KIND (Kubernetes in Docker) allows you to run a Kubernetes cluster on your local machine using Docker containers. This is perfect for development and testing.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) or Docker Engine
- [KIND](https://kind.sigs.k8s.io/docs/user/quick-start/#installation) installed
- [Helm 3+](https://helm.sh/docs/intro/install/) installed
- kubectl configured

## Quick Start

The fastest way to get started is using our automated setup script:
```bash
# Clone the repository
git clone git@github.com:medic/cht-interoperability.git
cd cht-interoperability

# Run the setup script
chmod +x ./start_local_kubernetes.sh
./start_local_kubernetes.sh
```

The script will:
1. Create a KIND cluster named `cht-interop`
2. Build custom Docker images (configurator and mediator)
3. Load images into the KIND cluster
4. Deploy the Helm chart
5. Set up port forwarding automatically

## Manual Setup

If you prefer to run commands manually:

### 1. Create KIND Cluster
```bash
kind create cluster --name cht-interop
```

### 2. Build Custom Images
```bash
# Build configurator
docker build -f configurator/Dockerfile -t configurator:local .

# Build mediator
docker build -t mediator:local ./mediator
```

### 3. Load Images into KIND
```bash
kind load docker-image configurator:local --name cht-interop
kind load docker-image mediator:local --name cht-interop
```

### 4. Deploy with Helm
```bash
helm install cht-interop ./charts -n cht-interop --create-namespace
```

### 5. Wait for Pods to be Ready
```bash
# Watch pods start
kubectl get pods -n cht-interop -w

# Or wait for specific services
kubectl wait --for=condition=ready pod -l app=openhim-core -n cht-interop --timeout=300s
```

### 6. Set Up Port Forwarding
```bash
# Use the provided script
chmod +x port-forward.sh
./port-forward.sh

# Or manually forward ports
kubectl port-forward svc/openhim-console 9000:80 -n cht-interop &
kubectl port-forward svc/openhim-core 8080:8080 -n cht-interop &
kubectl port-forward svc/api 5988:5988 -n cht-interop &
```

## Accessing Services

Once deployed, access services at these URLs:

| Service              | URL                    | Default Credentials                 |
|----------------------|------------------------|-------------------------------------|
| **OpenHIM Console**  | http://localhost:9000  | root@openhim.org / openhim-password |
| **OpenHIM Core API** | https://localhost:8080 | root@openhim.org / openhim-password |
| **OpenHIM Router**   | http://localhost:5001  | -                                   |
| **CHT API**          | http://localhost:5988  | admin / password                    |
| **Mediator**         | http://localhost:6000  | -                                   |

{{< callout type="info" >}}
OpenHIM Core uses a self-signed certificate. Your browser will show a security warning - this is expected for local development.
{{< /callout >}}

## Configuration

The deployment uses `charts/values.yaml` with these key settings:
```yaml
cluster_type: "kind"
persistence:
  storageClass: standard  # KIND's default storage class
configurator:
  image: configurator:local
  imagePullPolicy: Never  # Don't pull, use local image
mediator:
  image: mediator:local
  imagePullPolicy: Never
```

## Common Operations

### View Logs
```bash
# View logs for a specific service
kubectl logs deployment/openhim-core -n cht-interop

# Follow logs in real-time
kubectl logs -f deployment/mediator -n cht-interop

# View logs for all containers in a pod
kubectl logs deployment/api -n cht-interop --all-containers
```

### Restart a Service
```bash
kubectl rollout restart deployment/openhim-core -n cht-interop
```

### Upgrade Deployment

After making changes to your code or configuration:
```bash
# Rebuild images
docker build -f configurator/Dockerfile -t configurator:local .
docker build -t mediator:local ./mediator

# Reload into KIND
kind load docker-image configurator:local --name cht-interop
kind load docker-image mediator:local --name cht-interop

# Upgrade Helm release
helm upgrade cht-interop ./charts -n cht-interop
```

### Access Kubernetes Dashboard
```bash
# Install K9s for a better CLI experience
brew install k9s  # macOS
# or download from https://k9scli.io/

# Run K9s
k9s --context kind-cht-interop
```

## Troubleshooting

### Pods Stuck in Pending

Check if PVCs are bound:
```bash
kubectl get pvc -n cht-interop
```

If PVCs show `Pending`, check storage class:
```bash
kubectl get storageclass
```

KIND should have a `standard` storage class by default.

### Port Already in Use

If port forwarding fails with "port already in use":
```bash
# Kill existing port forwards
pkill -f 'kubectl port-forward'

# Try again
./port-forward.sh
```

### Images Not Loading

If pods show `ImagePullBackOff`:
```bash
# Verify images are loaded in KIND
docker exec -it cht-interop-control-plane crictl images | grep -E "configurator|mediator"

# Reload images
kind load docker-image configurator:local --name cht-interop
kind load docker-image mediator:local --name cht-interop
```

### Database Connection Issues

If services can't connect to databases:
```bash
# Check if databases are ready
kubectl get pods -n cht-interop -l app=mongo
kubectl get pods -n cht-interop -l app=couchdb

# Test connectivity from a pod
kubectl exec -it deployment/openhim-core -n cht-interop -- nc -zv mongo 27017
```

## Clean Up

### Stop Port Forwarding
```bash
pkill -f 'kubectl port-forward'
```

### Delete Helm Release
```bash
helm uninstall cht-interop -n cht-interop
```

### Delete KIND Cluster
```bash
kind delete cluster --name cht-interop
```
