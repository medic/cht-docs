---
title: "Migrating projects on VMware that were installed via docker-compose to k3s"
linkTitle: "To to k3s (from VMWare)"
weight: 20

---
{{< hextra/hero-subtitle >}}
Here we will outline the process for migrating projects that were installed on VMware by docker-compose on the VM's root disk to a k3s installation that exists in the same VMware datacenter.{{< /hextra/hero-subtitle >}}

### Prerequisites 

This doc will assume you have followed or read over our guides to [self hosting K3s](/hosting/4.x/production/kubernetes/self-hosting-k3s-multinode/) and the [trouble shooting section below](#troubleshooting). Please ensure your terminal is authenticated to your vCenter datacenter by following the govc or curl authentication steps in those docs.

### Current cht-core installation setup

This doc assumes your existing cht-core projects are installed on separate VM's that are launched by a VM template in VMware. Docker compose was used to install cht-core project on each VM, and all data was stored on that VMs root disk. There was also a VMware encyption policy that all above disks mentioned are encrypted.

### Our goal cht-core setup

Our goal is to merge all of our projects into a k3s VMware deployment for ease of maintainability, support of multi-node cht-core projects, and other benefits that are highlighted in our k3s VMware installation docs.

To reach our goal, we will need to complete the following steps:
* Shutting down existing running project, this will mean downtime for the project
* Copy disk from shut-down VM
* Mounting disk to k3s control-plane node
* Decrypting disk
* Copying data via rsync from old disk to a container inside k3s that uses PersistentVolumeClaims
* Using the above PVC inside new cht-core deployment templates to re-deploy the cht-core project inside k3s
* Updating nginx to forward traffic to our project installation
* Verifying all services are running for cht-core
* Taking a backup and verifying backup policy works 

### Shut down existing project VM

Identify which VM you wish to shutdown, by navigating and identifying the VM name that matches your project.

      govc ls /<datacenter_name>/vm/<sub_dir>

*Note* Before powering off the vm, ensure you have access to the vm's terminal to decrypt the root disk if you ever need to re-use this VM, or restart this process.
Power the vm off:
      govc vm.power -off /<datacenter_name>/vm/<sub_dir>

### Copy disk from shut-down VM

We will want to copy the data from the recently shut-down VM above to a new vmdk disk file that we will mount onto our k3s control-plane server. Copying the disk will ensure we have a backup plan if anything goes wrong during our migration process. This will keep the original project data intact.

      govc device.info -vm /<datacenter_name>/vm/<sub_dir>

Example of above output:

```
Name:             disk-1000-0
Type:             VirtualDisk
Label:            Hard disk 1
Summary:          1,048,576,000 KB
Key:              2000
Controller:       lsilogic-1000
Unit number:      0
File:             [<datastore_name>] <specific_san_disk>/<file_name>.vmdk
```

Take note of the .vmdk file name from the above output, as well as the datastore name. 

      govc datastore.ls -ds=<datastore_name> <sub-dir> .

Now run the same `device.info` command above pointing to your k3s control-plane VM. Be sure to take note of the <specific_san_disk> or <sub_dir> of the output.

Let's copy the .vmdk from our shut-down VM to the k3s control-plane server:

      govc datastore.cp --ds=<datastore_name> --ds-target=<datastore_name> <sub_dir_of_shutdown_vm>/<file_name>.vmdk 
      <sub_dir_or_specific_san_disk_of_k3s_control_plane_vm>/<file_name>_clone.vmdk

This process will take some time to complete. We suggest running these commands from a screen session on a server inside the VMware datacenter, such as the k3s control-plane servers.

### Mounting copied disk to k3s control-plane server VM

After successfully copying the disk, we want to mount the copied file onto our k3s control-plane server VM.

      govc vm.disk.attach -vm /<datacenter_name>/vm/<sub_dir>/<k3s_control_plane_vm> -ds=<datastore_name> -disk=<sub_dir_or_specific_san_disk_of_k3s_control_plane_vm>/<file_name>_clone.vmdk

We will have to restart the k3s control plane server VM that we attached the above disk to force VMware SCSI controller to sync. You will notice the disk won't be listed using commands such as `lsblk` until a restart has occurred. Ideally, you would want to mount this disk on an isolated VM and copy k3s credentials to that vm. That step would prevent having to restart a k3s control plane server and waiting for it to resync to the k3s cluster.

### Decrypting disk

Once you've rebooted your k3s server vm, we will need to decrypt the disk, if necessary.
*Note* Your disk may be mounted to a different location than sdb3 below, use `lsblk` to determine the path

      sudo cryptsetup open --type luks /dev/sdb3 <name-of-project-disk>
      # enter encryption password
      sudo vgdisplay #Save UID info
      sudo vgrename <UID> <name-of-project-disk>
      sudo vgchange -a y
      sudo lvdisplay #Note LV_PATH
      sudo mount LV_PATH /srv

Find the location of your couchdb data, most likely located in:
`/srv/home/<username>/cht/couchdb`

### Copying data via rsync

Now that we have our project's data mounted to our k3s vm server, we can create a Pod deployment inside k3s that uses a PersistentVolumeClaim backed by the VMware Container Storage Interface that will provision a Container Network Storage volume inside VMware and manage that storage disk across failovers.

We'll want to save the script from this [serverfault.com rsync q&a](https://serverfault.com/questions/741670/rsync-files-to-a-kubernetes-pod/887402#887402) as `rsync-helper.sh` on our k3s vm server

Launch a busybox pod that uses a pvc resource using the template below:
```
apiVersion: v1
kind: Pod
metadata:
  name: busybox
spec:
  containers:
    - name: busybox
      image: k8s.gcr.io/busybox
      command: [ "/bin/sh", "-c", "tail -f /dev/null" ]
      volumeMounts:
      - name: volume1
        mountPath: "/opt/couchdb/data"
  volumes:
  - name: volume1
    persistentVolumeClaim:
      claimName: busybox-pvc1
  restartPolicy: Never
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: busybox-pvc1
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 100Gi
  storageClassName: vmware-sc
```

Deploy the above template into your k3s cluster:
`kubectl -n apply -f busybox.yaml`

Let's use rsync, with the `rsync-helper.sh` script to move data from our original mounted disk to busybox-pvc1 a provisioned pvc resource inside k3s:

       sudo rsync -av --progress -stats -e './rsync-helper.sh' /srv/home/<user>/cht/couchdb/data/ busybox:/opt/couchdb/data/

* Optional: Depending on if you are moving a project from single-node CouchDB to multi-node CouchDB during this migration into k3s, now would be the point in the process to follow the couchdb-migration steps.

### Using the above PVC inside new cht-core deployment templates to re-deploy the cht-core project inside k3s

We'll have to delete the resources created in the previous step, but ensure to save the volume ID of the pvc that was created. You can identify this by navigating through VMware GUI > Container Network Storage, or by running `kubectl get pvc` and `kubectl describe pvc <pvc_id>` and noting the volumeHandle.

````
```
apiVersion: v1
kind: PersistentVolume
metadata:
  name: <project_name>-pv
  annotations:
    pv.kubernetes.io/provisioned-by: csi.vsphere.vmware.com
spec:
  capacity:
    storage: 50Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: vmware-sc
  claimRef:
    namespace: <namespace>
    name: <project_name>-pvc
  csi:
    driver: csi.vsphere.vmware.com
    fsType: ext4  # Change fstype to xfs or ntfs based on the requirement.
    volumeAttributes:
      type: "vSphere CNS Block Volume"
    volumeHandle: <voluemHandle_from_above_step>  # First Class Disk (Improved Virtual Disk) ID
---
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: <project_name>-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: <storage_size>Gi
  storageClassName: vmware-sc
  volumeName: <project_name>-pv
---
```
````

* Save the above templates to a directory for the project name, such as `/home/ubuntu/cht-projects/project-name`.

* Create a namespace per project in k3s `kubectl create namespace <project_name>`. Ensure you edit your templates created above to reflect the namespace <namespace> you created and want to deploy the project to.


## Troubleshooting 

### Most common tools

- [govc](https://github.com/vmware/govmomi/blob/main/govc/README.md))
- [curl](https://everything.curl.dev/get)

### Setup variables in your current terminal session

We'll need to export authentication variables to vCenter Server:

* govc
  `export GOVC_URL='https://<Admin.loc>:<Password>@<vCenter_IP>'`
  `export GOVC_INSECURE=1`

* curl
  Grab an auth token:
  `curl -k -X POST https://<vCenter_IP>rest/com/vmware/cis/session -u '<Admin>:<Password>'`

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

### If there is a sub-directory that nests our k3s vm's, you may have to run:

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


