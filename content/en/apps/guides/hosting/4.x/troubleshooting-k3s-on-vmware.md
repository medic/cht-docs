---
title: "Troubleshooting k3s on a VMware datacenter"
linkTitle: "k3s - multiple nodes"
weight: 20
description: >
  Here we will outline common VMware datacenter troubleshooting with a specific perspective of k3s cht-core deployments inside that environment.
---

### Most common tools

- [govc](https://github.com/vmware/govmomi/blob/main/govc/README.md))
- [curl](https://everything.curl.dev/get)

### Setup variables in your current terminal session

We'll need to export authentication variables to vCenter Server:

* govc
      export GOVC_URL='https://<Admin.loc>:<Password>@<vCenter_IP>'
      export GOVC_INSECURE=1

* curl
Grab an auth token:
       curl -k -X POST https://<vCenter_IP>rest/com/vmware/cis/session -u '<Admin>:<Password>' 

### Mapping VMware Storage to k3s PersistentVolumeClaim

Since we are using VMware SAN, it's important to identify the IDs that VMware gives to a storage disk, and how to identify the k3s PersistentVolume resource that is linked.

      kubectl -n <namespace> get volumeattachments -o wide
      kubectl -n <namespace> get volumeattachments csi-<id> -o yaml

At the bottom of the above output please note:
      specs.source.persistentVolumeName = k3s pvc id
      status.attachmentMetadata.diskUUID = VMware storage disk ID 

### Perform failover or send all cht-core projects to another k3s worker server

If you are receiving multiple alerts for one particular k3s worker VM, you can drain all the projects to a spare VM, and investigate or restart the original k3s worker server to fix any underlying issues. *Note*: This incurs downtime of projects running on that k3s worker server

     kubectl get nodes -o wide
     # identify which ip address of the vm you wish to drain all projects from. The next command will cause downtime for all projects on that node, so please use in emergencies or during maintenance windows

     kubectl drain --ignore-daemonsets <node_name>
     # Wait a few minutes as k3s evicts/moves all pods gracefully to a spare worker server
     # This ensures graceful failover and will avoid any multi-attach error when trying to attach storage disks to multiple VMs, and helps to avoid couchdb data corruption. 

### Failover occurred and some projects are not coming back

Say one of your k3s worker server VMs failed or was restarted before a system-administrator was able to run the above section and gracefully failover all running projects. When checking status of pods, some are stuck in ContainerCreating. Running a describe on that particular pod, displays a "Multi-Attach Error", because the storage disk is still attached to the previous VM. 

Describe the pod, and read the Events section at the bottom of the output:
      kubectl -n <namespace> describe <pod_name>

Next, identify which VMware Storage disk id is mapped to that particular cht-core project's PersistentVolumeClaim. Since we are running multiple cht-core projects on each k3s worker VM, we want to ensure we are looking at the correct project. Save this information for the next few steps. 

We will want to investigate the old failed k3s worker VM that was previously running this project, and force-detach the storage disk from that VM and restart the k3s deployment process, which will mount the project's storage disk to an active k3s worker VM.

We'll use govc in the examples below, to list our datacenter's VMs:
      govc ls /<datacenter_name>/vm/
      # If there is a sub-directory that nests our k3s vm's, you may have to run:
      govc ls /<datacenter_name>/vm/<k3s_dir_vms>

Now we'll retrieve device info about which disks are mounted to the k3s worker VM that failed or was drained in the previous step:

      govc device.info -vm /<datacenter_name>/vm/<k3s_subdir>/<vm_name> -json
      # Now, ensure that disk UUID is the same as the one identified running that cht-core project. 
      # You will need jq installed for this next step to work
      govc device.info -vm /<datacenter_name>/vm/<k3s_subdir>/<vm_name> -json diks-* | jq -r .Devices[].backing.uuid
      # From the two outputs above, identify what disk number our storage disk is attached as.
      # This should be similar to disk-1002

Let's remove that disk device from the failed k3s worker VM:
      govc device.remove -vm /<datacenter_name>/vm/<k3s_subdir>/<vm_name> -keep disk-<number 

Based on these [workarounds for VMware CSI](https://docs.vmware.com/en/VMware-vSphere-Container-Storage-Plug-in/2.5/rn/vmware-vsphere-container-storage-plugin-25-release-notes/index.html), we will want to ensure all volumeattachments in k3s that maybe mapped to the old node are deleted:

      kubectl patch volumeattachments.storage.k8s.io csi-<uuid> -p '{"metadata":{"finalizers":[]}}' --type=merge -n <namespace>
      kubectl delete volumeattachments.storage.k8s.io csi-<uuid> -n <namespace>

Now the container network storage volume on that failed k3s worker vm's can be available for mounting by k3s to other available k3s worker vm's. *Note* Default configuration for Container Storage Interface (CSI) is set to wait for 7 minutes after multiple multi-attach errors, before it tries to force-detach storage disks. You may run into this during drained k3s node or accidental k3s vm termination and after following above steps. 


