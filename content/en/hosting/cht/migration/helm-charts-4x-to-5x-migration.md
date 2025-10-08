# CHT 4.x to 5.x Helm Charts Migration Guide

## Overview

This guide covers the migration from CHT 4.x deployments using the [legacy Helm charts](https://github.com/medic/helm-charts) to the [new charts](https://github.com/medic/cht-core/tree/master/scripts/build/helm) introduced in CHT 5.x.

## Overview of Changes

CHT 5.x introduces significant changes to the Helm chart structure that require updates to your `values.yaml` files. The migration steps below will guide you through the necessary changes.

## Migration Steps

{{% steps %}}

### Step 1: Prepare Migration Values File

1. Export the values from your existing 4.x deployment into the `migration-5x-values.yaml` file:
   ```bash
   helm get values <your-release-name> --namespace <your-namespace> > migration-5x-values.yaml
   ```

2. Update the `migration-5x-values.yaml` file to be compliant with  5.x deployment requirements:

   ```yaml
   # Change field names
   couchdb:
     clusteredCouchEnabled: false  # was: clusteredCouch_enabled: false
   
   # For most migrations, use "false". Use "true" for pre-created volumes for provisioning
   couchdb_data:
     preExistingDataAvailable: "false"  # Keep using dynamic storage provisioning  
   
   # Add required API service configuration
   api:
     service:
       type: ClusterIP
   
   # Update image versions to 5.x
   chtversion: "5.0.0"  # or "master" for latest development
   cht_image_tag: "5.0.0"  # or "master" for latest development
   ```

3. Depending on the hosting environment, make a final edit to `migration-5x-values.yaml` file:
   
    {{< tabs items="GKE,EKS,K3s-K3d" >}}

        {{< tab >}}
        ```yaml
        couchdb:
          persistent_disk:
            size: <size>  # Set appropriate size for your needs
        ```
        {{< /tab >}}

        {{< tab >}}
        ```yaml
        ebs:
          preExistingEBSVolumeSize: <size>  # Set appropriate size for your needs
        ```
        {{< /tab >}}

        {{< tab >}}
        ```yaml
        couchdb:
          storage_class: local-path  # was: "local-storage"
        ```
        {{< /tab >}}

    {{< /tabs >}}

### Step 2: Perform the Migration

1. **Run the migration upgrade** (from any directory where you have your `migration-5x-values.yaml` file):
   ```bash
   helm upgrade <your-release-name> /path/to/cht-core/scripts/build/helm \
     -f migration-5x-values.yaml \
     --namespace <your-namespace>
   ```

2. **Monitor the upgrade**:
   ```bash
   helm status <your-release-name> --namespace <your-namespace>
   kubectl get pods--namespace <your-namespace>
   ```

### Step 3: Verify Migration Success

1. **Check pod status**:
   ```bash
   kubectl get pods -n <your-namespace>
   ```

2. **Verify new 5.x components**:
   ```bash
   # Look for the new couchdb-nouveau component
   kubectl get pods --namespace <your-namespace> | grep nouveau
   ```

3. **Test data integrity**

4. **Test application access**

{{% /steps %}}

## Best Practices

1. **Test First**: Always test migrations in a non-production environment
2. **Backup Data**: Ensure complete data backup before migration
3. **Monitor Closely**: Watch deployment logs and metrics during migration
4. **Document Changes**: Keep track of any custom configurations
5. **Plan Downtime**: Schedule migrations during maintenance windows

## Breaking Changes Reference

| Change Type | Old (4.x) | New (5.x) | Platform | Impact |
|-------------|-----------|-----------|----------|---------|
| Field Rename | `clusteredCouch_enabled` | `couchdb.clusteredCouchEnabled` | All | Critical |
| Field Rename | `local.diskPath` | `local_storage.preExistingDiskPath-1` | All | Critical |
| New Field | - | `api.service.type: ClusterIP` | All | Critical |
| Storage Config | Default sizes | `couchdb.couchdb_node_storage_size` required | All | Critical |
| Storage Config | Default sizes | `couchdb.persistent_disk.size` required | GKE | Critical |
| Storage Config | Default sizes | `ebs.preExistingEBSVolumeSize` required | EKS | Critical |
| Storage Class | `local-storage` | `local-path` | K3s-K3d | Minor |
| Structure | Flat config | Nested couchdb configuration | All | Medium |

## Getting Help

If you encounter issues during migration:

1. Check the [CHT Documentation](https://docs.communityhealthtoolkit.org/)
2. Review the [CHT Forum](https://forum.communityhealthtoolkit.org/)
3. Open an issue in the [CHT Core Repository](https://github.com/medic/cht-core/issues)

