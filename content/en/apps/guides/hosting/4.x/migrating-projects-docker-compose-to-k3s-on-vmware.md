---
title: "Migrating projects on VMware that were installed via docker-compose to k3s"
linkTitle: "migrating projects on VMware from docker-compose to k3s"
weight: 20
description: >
  Here we will outline the process for migrating projects that were installed on VMware by docker-compose on the VM's root disk to a k3s installation that exists in the same VMware datacenter.
---

### Prerequisites 

This doc will assume you have followed or read over our guides to [self-hosting-k3s-multinode.md]() and [troubleshooting-k3s-on-vmware.md](). Please ensure your terminal is authenticated to your vCenter datacenter by following the govc or curl authentication steps in those docs.

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

      Name:             disk-1000-0
      Type:             VirtualDisk
      Label:            Hard disk 1
      Summary:          1,048,576,000 KB
      Key:              2000
      Controller:       lsilogic-1000
      Unit number:      0
      File:             [<datastore_name>] <specific_san_disk>/<file_name>.vmdk

Take note of the .vmdk file name from the above output, as well as the datastore name. 

      govc datastore.ls -ds=<datastore_name> <sub-dir> .

Now run the same `device.info` command above pointing to your k3s control-plane VM. Be sure to take note of the <specific_san_disk> or <sub_dir> of the output.

Let's copy the .vmdk from our shut-down VM to the k3s control-plane server:

      govc datastore.cp --ds=<datastore_name> --ds-target=<datastore_name> <sub_dir_of_shutdown_vm>/<file_name>.vmdk 
      <sub_dir_or_specific_san_disk_of_k3s_control_plane_vm>/<file_name>_clone.vmdk

This process will take some time to complete. We suggest running these commands from a screen session on a server inside the VMware datacenter, such as the k3s control-plane servers.

### Mounting copied disk to k3s control-plane server VM

After succesfully copying the disk, we want to mount the copied file onto our k3s control-plane server VM.

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


