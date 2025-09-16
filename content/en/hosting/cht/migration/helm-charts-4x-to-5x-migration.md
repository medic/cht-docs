# CHT 4.x to 5.x Helm Charts Migration Guide

## Overview

This guide covers the migration from CHT 4.x deployments using the [legacy Helm charts](https://github.com/medic/helm-charts) to the [new charts](https://github.com/medic/cht-core/tree/master/scripts/build/helm) introduced in CHT 5.x.

## Breaking Changes

The following breaking changes require updates to your existing `values.yaml` files.

### Critical Breaking Changes (Must Fix)

#### 1. Field Name Changes

| Old (4.x) | New (5.x) | Impact |
|-----------|-----------|---------|
| `clusteredCouch_enabled` | `couchdb.clusteredCouchEnabled` | **CRITICAL** - Must be updated |
| `local.diskPath` | `local_storage.preExistingDiskPath-1` | **CRITICAL** - Must be updated |

#### 2. New Required Fields

| Field | Value | Impact |
|-------|-------|---------|
| `api.service.type` | `ClusterIP` | **CRITICAL** - Must be added to values file |
| `preExistingDataAvailable` | `"true"` | **CRITICAL** - Must be set for existing deployments |

#### 3. Storage Configuration Changes

| Change | Impact |
|--------|---------|
| **Removed default storage sizes** | **CRITICAL** - Must explicitly set `couchdb.couchdb_node_storage_size` |
| **No default persistent volume sizes** | **CRITICAL** - Must set platform-specific storage sizes |

#### 4. Values File Structure Changes

| Change | Impact |
|--------|---------|
| **Hierarchical structure** | **MEDIUM** - May need to restructure flat values files |
| **Nested couchdb configuration** | **MEDIUM** - CouchDB settings now under `couchdb:` section |

### Platform-Specific Storage Changes

#### GKE (Google Kubernetes Engine)
- **Required**: `couchdb.persistent_disk.size` (no default)

#### EKS (Amazon Elastic Kubernetes Service)
- **Required**: `ebs.preExistingEBSVolumeSize` (no default)

### Minor Changes

#### Storage Class Changes
- **K3s-K3d Storage Class**: `local-storage` (4.x) → `local-path` (5.x) - **MINOR CHANGE**
  - **Action Required**: Update K3s-K3d storage class if using defaults

### Getting Help

If you encounter issues during migration:

1. Check the [CHT Documentation](https://docs.communityhealthtoolkit.org/)
2. Review the [CHT Forum](https://forum.communityhealthtoolkit.org/)
3. Open an issue in the [CHT Core Repository](https://github.com/medic/cht-core/issues)

## Migration Steps

{{% steps %}}

### Step 1: Prepare Migration Values File

1. **Get current values** from your existing 4.x deployment:
   ```bash
   helm get values <your-release-name> -n <your-namespace> > migration-5x-values.yaml
   ```

2. **Apply breaking changes** to your values file:

   #### Critical Changes (Must Apply)
   ```yaml
   # Change field names
   couchdb:
     clusteredCouchEnabled: false  # was: clusteredCouch_enabled: false
   
   # Set pre-existing data flag in the case this is a migration
   preExistingDataAvailable: "true"  
   
   # Add required API service configuration
   api:
     service:
       type: ClusterIP
   
   # Update image versions to 5.x
   chtversion: "5.0.0"  # or "master" for latest development
   cht_image_tag: "5.0.0"  # or "master" for latest development
   ```

   #### Platform-Specific Storage Configuration
   
   **For GKE:**
   ```yaml
   couchdb:
     persistent_disk:
       size: "<size>"  # Set appropriate size for your needs
   ```
   
   **For EKS:**
   ```yaml
   ebs:
     preExistingEBSVolumeSize: "<size>"  # Set appropriate size for your needs
   ```
   
   **For K3s-K3d:**
   ```yaml
   couchdb:
     storage_class: "local-path"  # was: "local-storage"
   ```

### Step 2: Perform the Migration

1. **Navigate to your 4.x helm chart directory**:
   ```bash
   cd /path/to/your/4x/helm/charts
   ```

2. **Run the migration upgrade**:
   ```bash
   helm upgrade <your-release-name> /path/to/cht-core/scripts/build/helm \
     -f migration-5x-values.yaml \
     --namespace <your-namespace>
   ```

3. **Monitor the upgrade**:
   ```bash
   helm status <your-release-name> --namespace <your-namespace>
   kubectl get pods -n <your-namespace>
   ```

### Step 3: Verify Migration Success

1. **Check pod status**:
   ```bash
   kubectl get pods -n <your-namespace>
   ```

2. **Verify new 5.x components**:
   ```bash
   # Look for the new couchdb-nouveau component
   kubectl get pods -n <your-namespace> | grep nouveau
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

