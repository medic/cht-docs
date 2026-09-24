---
title: "AWS EKS Deployment"
linkTitle: "EKS Deployment"
weight: 2
description: >
  Deploy the interoperability stack to AWS EKS with Application Load Balancer
---

## Overview

Deploy the CHT Interoperability Stack to Amazon Elastic Kubernetes Service (EKS) for a production-ready, scalable deployment with proper SSL termination and load balancing.

## Prerequisites

### AWS Infrastructure

- AWS account with appropriate permissions
- [AWS CLI](https://aws.amazon.com/cli/) configured
- Existing EKS cluster (or create one)
- [AWS Load Balancer Controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/) installed on the cluster
- Valid SSL certificate in AWS Certificate Manager (ACM) or IAM
- DNS domain for your services

### Local Tools

- kubectl configured for your EKS cluster
- Helm 3+ installed
- Docker for building images

### Required AWS Permissions

You'll need permissions for:
- ECR (create repositories, push images)
- EKS (describe cluster, update kubeconfig)
- EC2 (for load balancers and security groups)
- IAM (for service roles)
- Route53 (optional, for DNS)

## Step 1: Push Images to ECR

### Configure AWS
```bash
export AWS_REGION=eu-west-2  # Change to your region
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
export ECR_REGISTRY=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
```

### Create ECR Repositories
```bash
# Create repositories
aws ecr create-repository \
  --repository-name cht-interop/configurator \
  --region $AWS_REGION

aws ecr create-repository \
  --repository-name cht-interop/mediator \
  --region $AWS_REGION
```

### Authenticate to ECR
```bash
aws ecr get-login-password --region $AWS_REGION | \
  docker login --username AWS --password-stdin $ECR_REGISTRY
```

### Build and Push Images
```bash
# Build images
docker build -f configurator/Dockerfile -t configurator:local .
docker build -t mediator:local ./mediator

# Tag for ECR
docker tag configurator:local $ECR_REGISTRY/cht-interop/configurator:latest
docker tag mediator:local $ECR_REGISTRY/cht-interop/mediator:latest

# Push to ECR
docker push $ECR_REGISTRY/cht-interop/configurator:latest
docker push $ECR_REGISTRY/cht-interop/mediator:latest
```

### Verify Images
```bash
aws ecr list-images \
  --repository-name cht-interop/configurator \
  --region $AWS_REGION

aws ecr list-images \
  --repository-name cht-interop/mediator \
  --region $AWS_REGION
```

## Step 2: Configure values-eks.yaml

Create or update `charts/values-eks.yaml` with your configuration:
```yaml
global:
  namespace: your-namespace

createNamespace: false  # Create namespace manually with proper labels
cluster_type: "eks"

persistence:
  storageClass: gp2  # or gp3 if available

configurator:
  image: 123456789.dkr.ecr.eu-west-2.amazonaws.com/cht-interop/configurator:latest
  imagePullPolicy: Always

mediator:
  image: 123456789.dkr.ecr.eu-west-2.amazonaws.com/cht-interop/mediator:latest
  imagePullPolicy: Always

ingress:
  annotations:
    groupname: "your-alb-group-name"
    tags: "Environment=prod,Team=Platform"
    certificate: "arn:aws:acm:eu-west-2:123456789:certificate/your-cert-id"
  
  chtHost: "cht.yourdomain.com"
  openhimConsoleHost: "openhim-console.yourdomain.com"
  openhimCoreHost: "openhim-api.yourdomain.com"
  openhimRouterHost: "openhim-router.yourdomain.com"

resources:
  requests:
    memory: "512Mi"
    cpu: "250m"
  limits:
    memory: "2Gi"
    cpu: "1000m"
```

### Configuration Options

| Field          | Description                                    | Example                                     |
|----------------|------------------------------------------------|---------------------------------------------|
| `namespace`    | Kubernetes namespace                           | `cht-interop-prod`                          |
| `storageClass` | EBS storage class                              | `gp2` or `gp3`                              |
| `groupname`    | ALB group name (must match existing ALB group) | `prod-alb`                                  |
| `certificate`  | ACM/IAM certificate ARN                        | `arn:aws:acm:region:account:certificate/id` |
| `*Host`        | Domain names (must match certificate)          | `*.yourdomain.com`                          |

## Step 3: Deploy to EKS

### Prepare Namespace
```bash
# Create namespace with Helm labels
kubectl create namespace your-namespace
kubectl label namespace your-namespace app.kubernetes.io/managed-by=Helm
kubectl annotate namespace your-namespace meta.helm.sh/release-name=cht-interop
kubectl annotate namespace your-namespace meta.helm.sh/release-namespace=your-namespace
```

### Install with Helm
```bash
helm install cht-interop ./charts \
  -n your-namespace \
  -f charts/values-eks.yaml
```

### Monitor Deployment
```bash
# Watch pods start
kubectl get pods -n your-namespace -w

# Check all resources
kubectl get all -n your-namespace

# Check PVCs are bound
kubectl get pvc -n your-namespace

# Check ingress status
kubectl get ingress -n your-namespace
```

## Step 4: Configure DNS

### Get Load Balancer Address
```bash
kubectl get ingress -n your-namespace -o wide
```

Look for the `ADDRESS` column, which will show your ALB hostname (e.g., `k8s-groupname-xxx.region.elb.amazonaws.com`).

### Create DNS Records

In your DNS provider (Route53, Cloudflare, etc.), create CNAME records:
```
cht.yourdomain.com                  → k8s-groupname-xxx.region.elb.amazonaws.com
openhim-console.yourdomain.com      → k8s-groupname-xxx.region.elb.amazonaws.com
openhim-api.yourdomain.com          → k8s-groupname-xxx.region.elb.amazonaws.com
openhim-router.yourdomain.com       → k8s-groupname-xxx.region.elb.amazonaws.com
```

### Wait for DNS Propagation
```bash
# Test DNS resolution
nslookup cht.yourdomain.com

# Test HTTPS access
curl -I https://cht.yourdomain.com
```

## Accessing Services

Once DNS is configured, access services at:

| Service              | URL                                    | Purpose                       |
|----------------------|----------------------------------------|-------------------------------|
| **CHT**              | https://cht.yourdomain.com             | Main CHT application          |
| **OpenHIM Console**  | https://openhim-console.yourdomain.com | OpenHIM management UI         |
| **OpenHIM Core API** | https://openhim-api.yourdomain.com     | OpenHIM management API        |
| **OpenHIM Router**   | https://openhim-router.yourdomain.com  | Health data exchange endpoint |

Default credentials:
- OpenHIM: `root@openhim.org` / `openhim-password`
- CHT: `admin` / `password`

## Common Operations

### View Logs
```bash
# View logs for a specific service
kubectl logs deployment/openhim-core -n your-namespace

# Follow logs in real-time
kubectl logs -f deployment/mediator -n your-namespace --tail=100

# View logs from all containers
kubectl logs deployment/api -n your-namespace --all-containers
```

### Scale Services
```bash
# Scale a deployment
kubectl scale deployment openhim-core --replicas=3 -n your-namespace

# Or update Helm values and upgrade
```

### Upgrade Deployment

After pushing new images or changing configuration:
```bash
# Push new images to ECR (if needed)
docker push $ECR_REGISTRY/cht-interop/configurator:latest
docker push $ECR_REGISTRY/cht-interop/mediator:latest

# Upgrade Helm release
helm upgrade cht-interop ./charts \
  -n your-namespace \
  -f charts/values-eks.yaml

# Monitor rollout
kubectl rollout status deployment/mediator -n your-namespace
```

### Restart a Service
```bash
kubectl rollout restart deployment/openhim-core -n your-namespace
```

## Troubleshooting

### Pods Stuck in Pending (Storage Issues)

Check storage class and PVC status:
```bash
# Check available storage classes
kubectl get storageclass

# Check PVC status
kubectl get pvc -n your-namespace

# Describe PVC to see errors
kubectl describe pvc couchdb-data -n your-namespace
```

If using `gp3` storage class but it doesn't exist, change to `gp2` in `values-eks.yaml`.

### Ingress Not Creating Load Balancer

Check AWS Load Balancer Controller:
```bash
# Verify controller is running
kubectl get deployment -n kube-system aws-load-balancer-controller

# Check controller logs
kubectl logs -n kube-system deployment/aws-load-balancer-controller

# Describe ingress to see events
kubectl describe ingress -n your-namespace
```

Common issues:
- Missing IAM permissions for the controller
- Incorrect subnet tags (`kubernetes.io/role/elb=1`)
- Security group issues

### SSL/TLS Certificate Issues
```bash
# Verify certificate ARN
aws acm describe-certificate \
  --certificate-arn your-cert-arn \
  --region $AWS_REGION

# Check if domains match
# Certificate must cover all ingress hostnames
```

### Image Pull Errors

If pods show `ImagePullBackOff`:
```bash
# Check if images exist in ECR
aws ecr describe-images \
  --repository-name cht-interop/configurator \
  --region $AWS_REGION

# Verify EKS node has ECR permissions
# Nodes need AmazonEC2ContainerRegistryReadOnly policy
```

### Database Connection Issues
```bash
# Check if databases are ready
kubectl get pods -n your-namespace -l app=mongo

# Test connectivity from a pod
kubectl exec -it deployment/openhim-core -n your-namespace -- \
  nc -zv mongo 27017

# Check service endpoints
kubectl get endpoints -n your-namespace
```

### 502 Bad Gateway Errors

Check target health and service configuration:
```bash
# Check pod health
kubectl get pods -n your-namespace

# Check service endpoints
kubectl describe svc nginx -n your-namespace

# Check ingress configuration
kubectl describe ingress -n your-namespace

# View ALB target groups in AWS Console
# Look for unhealthy targets
```

## Monitoring and Logging

### Application Logs
```bash
# Export logs to local file
kubectl logs deployment/mediator -n your-namespace > mediator.log

# Search logs
kubectl logs deployment/openhim-core -n your-namespace | grep ERROR
```

## Security Best Practices

1. **Change default passwords** before deployment change the default passwords as they are public
2. **Use AWS Secrets Manager** or Kubernetes Secrets for sensitive data
3. **Enable Pod Security Standards** for your namespace
4. **Restrict network access** using Network Policies
5. **Enable audit logging** on your EKS cluster
6. **Regularly update** images and Helm charts
7. **Use least-privilege IAM roles** for service accounts

## Clean Up

### Delete Helm Release
```bash
helm uninstall cht-interop -n your-namespace
```

### Delete PVCs
```bash
# List PVCs
kubectl get pvc -n your-namespace

# Delete all PVCs (this deletes data!)
kubectl delete pvc --all -n your-namespace
```

### Delete ECR Images
```bash
aws ecr delete-repository \
  --repository-name cht-interop/configurator \
  --region $AWS_REGION \
  --force

aws ecr delete-repository \
  --repository-name cht-interop/mediator \
  --region $AWS_REGION \
  --force
```

{{< callout type="warning" >}}
Deleting PVCs will permanently delete all data including databases. Make sure to backup data before cleaning up.
{{< /callout >}}
