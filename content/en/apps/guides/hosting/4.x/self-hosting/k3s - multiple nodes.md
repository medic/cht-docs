---
title: "k3s - multiple node deployment for VMware"
linkTitle: "k3s - multiple nodes"
weight: 20
description: >
  Hosting the CHT on self run VMware infrastructure with horizontally scaled CouchDB nodes
---

{{% pageinfo %}}
The clustered multi-node hosting described below is only recommended for deployments that need extreme performance gains. Please see our deploy documentation matrix to identify if multiple couchdb nodes are appropriate for your project and scale.

{{% /pageinfo %}}

### About container orchestration

A container orchestrater has the ability to schedule projects on available resources spread across a datacenter. For national scale projects, or a large number of cht-core deployments to maintain, we recommend and support using a lightweight kubernetes orchestrator called [k3s](https://docs.k3s.io/). The orchestrator will monitor resources across a group of nodes (VMs), place cht-core projects where there is available resource and migrate projects to spare resources if combined utilization is high or there are underlying issues. Instead of provisioning one VM per cht-core project, we will provision larger VMs and deploy multiple cht-core projects on one VM, with each project receiving optional resource limitations.

An example of national scale use-case of an orchestrator is deploying 50 cht-core projects, one for each county. For this scenario, we will provision 9 large VMs, and place 6 cht-core projects on each VM, allowing spare resources to handle failovers, as well as the orchestrator to decide which project is placed on which VM. This enables efficient use of resources without having to manually plan your datacenter resource utilization.

### About clustered deployments

In a clustered CHT setup, there are multiple CouchDB nodes responding to users. The ability to [horizontally scale](https://en.wikipedia.org/wiki/Horizontal_scaling#Horizontal_(scale_out)_and_vertical_scaling_(scale_up)) a CHT instance was added in version CHT 4.0.0. In this document we set up a three node CouchDB cluster.  We require all three CouchDB nodes to be running and healthy before installing the CHT. Our healthcheck service determines the health of the CouchDB nodes and turns off the CHT if any single node is not functional.

### Nodes

* k3s [HA control-plane](https://docs.k3s.io/installation/requirements#cpu-and-memory) nodes - 3 nodes that will enable HA and provide access to kube API. The containers running inside `kube-system` namespace are often associated with the control-plane. They include coreDNS, traefik (ingress), servicelb, VMware Cloud Provisioner Interface (CPI), and VMWare Container Storage Interface (CSI)

* k3s agent/worker nodes - These nodes will run the cht-core containers and projects. They will also run a few other containers that tie in networking, and storage. VMware CSI-node will be running that enables this agent to mount volumes from VMware Virtual-SAN for block data storage. Agents will also run servicelb-traefik containers which allow the nodes to route traffic to correct projects and handle load-balancing, and internal networking.

## Prerequisites

### Servers / Virtual Machines

Provision 3 Ubuntu servers (22.04 as of this writing) that meet k3s specifications for [HA etcd](https://docs.k3s.io/installation/requirements#cpu-and-memory)

4 vCPU, 8GB Ram per control-plane server.

Provision x Ubuntu servers for your k3s agent/worker servers. For a VM that is able to handle 6 cht-core projects, we recommend 48 vCPU, 192 GB Ram, and 50gb server disk-level storage.

For any additional VMs you add to the k3s cluster, you will need to ensure networking, roles, and extra configuration parameters that are noted below are configured on the VM. 

You will need to add VMs to your k3s cluster when you want to deploy more projects than you had initially planned for, or if you are rolling projects out slowly over time, this gives you flexibility of provisioning additional VMs later.

### Network

Please make sure the above provisioned VMs abide by [Inbound Rules for k3s Server Nodes](https://docs.k3s.io/installation/requirements#inbound-rules-for-k3s-server-nodes)

Please note these [firewall considerations for ubuntu](https://docs.k3s.io/advanced#ubuntu--debian) if you are using ufw or another firewall.

As a security measure, be sure to restrict the IP addresses of the nodes only to be able to connect to these ports.

### Add Roles and Permissions to our VMs

We'll be following this document [vSphere Roles and Privileges](https://docs.vmware.com/en/VMware-vSphere-Container-Storage-Plug-in/2.0/vmware-vsphere-csp-getting-started/GUID-0AB6E692-AA47-4B6A-8CEA-38B754E16567.html#GUID-0AB6E692-AA47-4B6A-8CEA-38B754E16567)

First, we will want to create CNS-VM, CNS-DATASTORE, and CNS-SEARCH-AND-SPBM roles.
Now, on the VM settings, we can apply these roles as described in the above document.

Any provisioned VM in the previous step, should recieve CNS-VM role.
The top-level vCenter server will recieve CNS-SEARCH-AND-SPBM role.
Virtual-SAN should recieve CNS-DATASTORE.
And all servers should have the READONLY role (this may already be active)


### Enable Necessary Extra Parameters on all VMs

Following along the above document, we want to verify VM Hardware Version is 15 or greater, and that disk.EnableUUID parameter is configured.

On each node, through vSphere Client (GUI):
1) disk.EnableUUID
  a. In the vSphere Client, right-click the VM and select Edit Settings.
  b. Click the VM Options tab and expand the Advanced menu.
  c. Click Edit Configuration next to Configuration Parameters.
  d. Configure the disk.EnableUUID parameter. If the parameter exists, make sure that its value is set to True. If the parameter is not present, add it and set its value to True.

2) Verify VM hardware version at 15 or higher, and upgrade if necessary
  a. In the vSphere Client, navigate to the virtual machine.
  b. Select Actions > Compatibility > Upgrade VM Compatibility.
  c. Click Yes to confirm the upgrade.
  d. Select a compatibility and click OK.

3) Add VMware Paravirtual SCSI storage controller to the VM
  a. In the vSphere Client, right-click the VM and select Edit Settings.
  b. On the Virtual Hardware tab, click the Add New Device button.
  c. Select SCSI Controller from the drop-down menu.
  d. Expand New SCSI controller and from the Change Type menu, select VMware Paravirtual.
  e. Click OK.


### Identify vSphere Provider IDs, Node IDs, and datacenter name

Bootstrap parameters for k3s on VMware require UUID identification of each node that will join the cluster. 

For each of the provisioned VMs, you can navigate to the VM in vCenter interface and retrieve the UUID.

Another method is to make the following calls to vCenter Server API. You may have a VPN that you connect to first before being able to access your vCenter GUI. These commands should be run from the same network that allows that access.

Please replace your vCenter Server IP, and username/credentials in the commands below.

* First, let's grab a authentication-token:
```
curl -k -X POST https://<vCenter_IP>/rest/com/vmware/cis/session -u '<USERNAME>:<PASSWORD'
ID=<value_above>
```

* List all your VMs and identify the VM-number that was provisioned earlier:
```
curl -k -X GET -H "vmware-api-session-id: $ID" https://<vCenter_IP>/api/vcenter/vm
```
* Retrieve your instance_uuid
```
curl -k -X GET -H "vmware-api-session-id: $ID" https://<vCenter_IP>/api/vcenter/vm/vm-<number>

Inside the response:
"identity":{"name":"k3s_worker_node_4","instance_uuid":"215cc603-e8da-5iua-3333-a2402c05121"
```

* Retrieve your datacenter name, to be used in configuration files for VMware CSI and CPI
```
curl -k -X GET -H "vmware-api-session-id: $ID" https://10.127.106.50/rest/vcenter/datacenter
```
You will want to save the "name" of your datacenter.

* Retrieve your cluster-id, to be used in config file for VMware CSI
```
curl -k -X GET -H "vmware-api-session-id: $ID" https://<vCenter IP>/api/vcenter/cluster
```

You can also [govc cli tool](https://github.com/vmware/govmomi/blob/main/govc/README.md#binaries) to retrieve this information. 
```
export GOVC_INSECURE=1
  $ export GOVC_URL='https://<VC_Admin_User>:<VC_Admin_Passwd>@<VC_IP>'

  $ govc ls
  /<datacenter-name>/vm
  /<datacenter-name>/network
  /<datacenter-name>/host
  /<datacenter-name>/datastore

  // To retrieve all Node VMs
  $ govc ls /<datacenter-name>/vm
  /<datacenter-name>/vm/<vm-name1>
  /<datacenter-name>/vm/<vm-name2>
  /<datacenter-name>/vm/<vm-name3>
  /<datacenter-name>/vm/<vm-name4>
  /<datacenter-name>/vm/<vm-name5>
```


## Install k3s

### First Control-Plane VM

SSH into your first control-plane VM that was provisioned and configured above.
* Install [docker](https://docs.docker.com/engine/install/ubuntu/)

For k3s version compatibiltiy with vCenter and vMware CPI/CSI, we will need to use k3s v1.25, cpi v1.25, and csi v2.7.2

Run the following CLI command inside the control-plane VM, filling out these two specific values:
  - token: Please generate a token ID, and save it. This will be required for the entirety of the k3s cluster existence and required to add additional servers to the k3s cluster
  - VM_UUID: This was the UUID for this specific VM that we identified earlier
```
curl -sfL https://get.k3s.io | K3S_KUBECONFIG_MODE="644" INSTALL_K3S_EXEC="server" INSTALL_K3S_VERSION="v1.25.14+k3s1" sh -s - \
--docker --token <TOKEN> \
--cluster-init --disable-cloud-controller \
--kubelet-arg="cloud-provider=external" \
--kubelet-arg="provider-id=vsphere://<VM_UUID>"
```

### Second and third Control-Plane VMs

SSH into your second/third control-plane VM.

Please fill out these values below and run the cli command:
  - token: Required to be the same token you used in the first control-plane setup
  - CONTROL_PLANE_1_IP: This is the IP of the first control-plane server you setup, and allows this second server to discover the initial one.
  - VM_UUID: This is the UUID for this second VM that we identified earlier. This will be different than the one you used for control plane 1.

```
curl -sfL https://get.k3s.io | K3S_KUBECONFIG_MODE="644" INSTALL_K3S_EXEC="server" INSTALL_K3S_VERSION="v1.25.14+k3s1" sh -s  \
- --docker --token <TOKEN> \
--server https://<CONTROL_PLANE_1_IP:6443 \
--disable-cloud-controller --kubelet-arg="cloud-provider=external" \ 
--kubelet-arg="provider-id=vsphere://<VM_UUID>"

```

You can verify your cluster is working by running this command from inside your control plane VM:
```
/usr/local/bin/k3s kubectl get nodes -o wide
```

### Agent/Worker VMs

Now we will add our k3s agent/worker servers that will handle cht-core projects, workloads, and containers. This process is the same for any additional Agent/Worker servers you want to add to your k3s cluster.

Ensure that the appropriate roles, and extra configuration parameters are set correctly.

Please fill out these values before running the command:
  - token: Required to be the same token you used above
  - CONTROL_PLANE_IP: The IP of one of the control plane servers you set up above
  - VM_UUID: This is the UUID of this VM that we are adding as an agent/worker server in our k3s cluster

```
curl -sfL https://get.k3s.io | K3S_KUBECONFIG_MODE="644" INSTALL_K3S_EXEC="agent" INSTALL_K3S_VERSION="v1.25.14+k3s1" sh -s - \
--docker --token <TOKEN> \
--server https://<CONTROL_PLANE_IP>:6443 \
--kubelet-arg="cloud-provider=external" \
--kubelet-arg="provider-id=vsphere://<VM_UUID>"
```

## Deploy VMware Cloud Provisioner Interface (CPI) to your k3s cluster

SSH into one of your control plane servers. 
Download the template for CPI:
```
VERSION=1.25
wget https://raw.githubusercontent.com/kubernetes/cloud-provider-vsphere/release-1.25/releases/v1.25/vsphere-cloud-controller-manager.yaml
```

Modify the vsphere-cloud-controller-manager.yaml file downloaded above and update vCenter Server information. 

1) Add your vCenter_IP and USERNAME, PASSWORD to the section below inside that yaml:
```
apiVersion: v1
kind: Secret
metadata:
  name: vsphere-cloud-secret
  labels:
    vsphere-cpi-infra: secret
    component: cloud-controller-manager
  namespace: kube-system
  # NOTE: this is just an example configuration, update with real values based on your environment
stringData:
  <vCenter_IP>.username: "<USERNAME>"
  <vCenter_IP>.password: "<PASSWORD>"
```
2) Please add your vCenter_IP, USERNAME, PASSWORD and Datacenter_name_retrieved_earlier to the ConfigMap section inside that yaml.
* Note: If your vCenter actively uses https with valid certificates, then you will want to set insecureFlag: false. Most set-ups will want this to remain true (insecureFlag: true)

```
apiVersion: v1
kind: ConfigMap
metadata:
  name: vsphere-cloud-config
  labels:
    vsphere-cpi-infra: config
    component: cloud-controller-manager
  namespace: kube-system
data:
  # NOTE: this is just an example configuration, update with real values based on your environment
  vsphere.conf: |
    # Global properties in this section will be used for all specified vCenters unless overriden in VirtualCenter section.
    global:
      port: 443
      # set insecureFlag to true if the vCenter uses a self-signed cert
      insecureFlag: true
      # settings for using k8s secret
      secretName: vsphere-cloud-secret
      secretNamespace: kube-system

    # vcenter section
    vcenter:
      my-vc-name:
        server: <vCenter_IP>
        user: <USERNAME>
        password: <PASSWORD>
        datacenters:
          - <Datacenter_name_retrieved_earlier>
```

3) Deploy the template!
```
/usr/local/bin/k3s kubectl -n kube-system apply -f vsphere-cloud-controller-manager.yaml
```

4) Verify CPI containers are running:
```
/usr/local/bin/k3s kubectl -n kube-system get pods -o wide
/usr/local/bin/k3s kubectl -n kube-system logs vsphere-cloud-controller-manager-<id>
```

You will see 3 vsphere-cloud-controller-manager pods running, one per control-plane server.

Take a peak at all 3 vsphere-controller-manager pods logs to ensure nothing is immediately erring. Common errors are using the incorrect datacenter name, UUIDs for VMs in the k3s curl command, or invalid credentials in the configmap and secrets resources created in step 2 above. If one of these errors is displaying in the log, you will want to delete the deployment (in step 3 above, replace `apply` with `delete`, edit the yaml and re-deploy (run step 3 again).


## Deploy VMware Container Storage Interface (CSI) to your k3s cluster

[VMware documentation for CSI](https://docs.vmware.com/en/VMware-vSphere-Container-Storage-Plug-in/2.0/vmware-vsphere-csp-getting-started/GUID-A1982536-F741-4614-A6F2-ADEE21AA4588.html)

We'll be following the guide linked above.

Procedure:

1) Run the following command from inside a control-plane server:
```
/usr/local/bin/k3s kubectl create namespace vmware-system-csi
```

2) Taint your control-lane node servers by running the following command. This taint may already exist, if so, thats okay. Please replace <CONTROL_PLANE_SERVER> with each of your control plane servers. 
```
You can retrieve the names by running `/usr/local/bin/k3s kubectl get nodes -o wide`
/usr/local/bin/k3s kubectl taint node <CONTROL_PLANE_SERVER> node-role.kubernetes.io/control-plane=:NoSchedule
```

3) Create kubernetes secret, which will map authentication credentials and datacenter name to CSI containers.
  a) create a file titled csi-vsphere.conf. In the default values below, be sure to place the following values in the defined place:
    * admin credentials 
    * datacenter name retrieved from earlier
    * vCenter Server IP address (same as used in previous CPI template)
    * vCenter cluster-ID, retrieved from earlier
```
$ cat /etc/kubernetes/csi-vsphere.conf
[Global]
cluster-id = "<cluster-id>"

[VirtualCenter "<IP or FQDN>"]
insecure-flag = "<true or false>"
user = "<username>"
password = "<password>"
port = "<port>"
datacenters = "<datacenter1-path>, <datacenter2-path>, ..."
```

4) Create the secret resource in the namespace we created in step 1 by running the following command in the same directory you created the csi-vsphere.conf file:
```
/usr/local/bin/k3s kubectl create secret generic vsphere-config-secret --from-file=csi-vsphere.conf --namespace=vmware-system-csi
```

5) Download the [vSphere CSI v2.7.2 template](https://raw.githubusercontent.com/kubernetes-sigs/vsphere-csi-driver/v2.7.2/manifests/vanilla/vsphere-csi-driver.yaml)

There is one minor edit, typically found on line 217-218, under the deployment specification for vsphere-csi-controller. 

Before edit (original value)
```
      nodeSelector:
        node-role.kubernetes.io/control-plane: ""
```

Please add "true" as the value for this key, seen below:
```
      nodeSelector:
        node-role.kubernetes.io/control-plane: "true"
```

Now, let's deploy VMware CSI by running the following command:
```
/usr/local/bin/k3s kubectl -n vmware-system-csi apply -f vsphere-csi-driver.yaml
```

Follow the [verification steps seen here in Step 2 of Procedure](https://docs.vmware.com/en/VMware-vSphere-Container-Storage-Plug-in/2.0/vmware-vsphere-csp-getting-started/GUID-54BB79D2-B13F-4673-8CC2-63A772D17B3C.html)


### Create StorageClass in k3s cluster

We'll need to create a global [StorageClass](https://kubernetes.io/docs/concepts/storage/storage-classes/) resource in our k3s cluster, so cht-core deployments will be able to ask for persistent storage volumes from the k3s cluster.

Inside one of the control-plane servers, please create a file `vmware-storageclass.yaml` with the following contents:
```
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: vmware-sc
  annotations:
    storageclass.kubernetes.io/is-default-class: "true"
provisioner: csi.vsphere.vmware.com
parameters:
  csi.storage.k8s.io/fstype: "ext4" #Optional Parameter
```

Deploy this template to the k3s cluster via:
```
/usr/local/bin/k3s kubectl apply -f vmware-storageclass.yaml
```

## Deploying a CHT-Core Project to your new k3s Cluster running on VMware

This step will neatly fit into helm chart configurations, but here are the manual steps for time being.

In your PVC template (peristent volume), here is a snippet of what it should resemble for all CouchDB's:
* Note the storageClassName parameter should be identical to the storageClass we deployed earlier
```
# Source: cht-chart/templates/couchdb-n-claim0-persistentvolumeclaim.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  labels:
    cht.service: couchdb-1-claim0
  name: couchdb-1-claim0
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 4Gi
  storageClassName: vmware-sc
status: {}
```

## Kubernetes Concepts 
Here are links to docs surrounding the kubernetes concepts that we use in a cht-core project deployed to a k3s cluster.

* [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) - This is the main kubernetes resource that contains information regarding all the cht services that will be deployed.
* [ConfigMaps](https://kubernetes.io/docs/concepts/configuration/configmap/) - This contains configuration files, or credentials that containers can retrieve. If you edit the configmap, you should delete containers, which will trigger a new container to download your new edits to any configrations for that service
* [ServiceAccounts](https://kubernetes.io/docs/concepts/security/service-accounts/) - This is used by the upgrade-service that is running inside the cht-core pods (as a container titled upgrade-service). This serviceAccount restricts the upgrade-service from interacting with any other cht-core projects outside of its namespace, and gives the upgrade-service permissions to talk to kubernetes API to upgrade container images when a CHT ADMIN clicks *upgrade* through the Admin interface.
* [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) - This is what forwards traffic to a particular project or pods. In most use-cases, there is an nginx deployed outside of the k3s cluster than contains DNS entries for existing projects, and contains a proxy_pass parameter to send traffic based on host header to any of the k3s server IPs. Inside the k3s cluster, the traefik container and servicelb-traefik containers in kube-system namespace will handle forwarding traffic to the correct cht-core containers based on url
* [Persistent Volume Claim](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) - This is where our project data will be stored. Important to ensure you have configured this correctly, with retain policies intact so the data is not deleted if the project is removed. It's also vital to ensure you have a backup policy either set-up in VMware vCenter GUI or you have configured the csi-snapshotter that comes with vSphere CSI.
* [Services](https://kubernetes.io/docs/concepts/services-networking/service/) - This is utilized for CouchDB nodes to discover each other through DNS rather than internal IPs, which can change. This is also used in the COUCH_URL so API containers can discover where CouchDB is running.


## k3s Troubleshooting
Another doc to be linked here
