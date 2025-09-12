# CHT 4.x to 5.x Helm Charts Migration Guide

This guide covers the migration from CHT 4.x deployments using the legacy Helm charts in the [medic/helm-charts](https://github.com/medic/helm-charts) repository to the new production charts introduced in CHT 5.x within the [medic/cht-core](https://github.com/medic/cht-core) repository.

## Table of Contents

1. [Overview](#overview)
2. [Breaking Changes Summary](#breaking-changes-summary)
3. [Migration Checklist](#migration-checklist)
4. [Step-by-Step Migration Guide](#step-by-step-migration-guide)
5. [Platform-Specific Configurations](#platform-specific-configurations)
6. [Testing & Validation](#testing--validation)
7. [Troubleshooting](#troubleshooting)
8. [Rollback Procedures](#rollback-procedures)
9. [Support Resources](#support-resources)

## Overview

The Community Health Toolkit (CHT) has moved its Helm charts from a separate repository (`medic/helm-charts`) to the main CHT Core repository (`medic/cht-core`).

### Key Differences

#### Chart Naming
- **Old**: `medic/cht-chart-4x`
- **New**: `cht-chart` (local chart from cht-core repository)

## Breaking Changes Summary

**IMPORTANT**: The following breaking changes require updates to your existing `values.yaml` files.

### Critical Breaking Changes (Must Fix)

#### 1. Field Name Changes

| Old (4.x) | New (5.x) | Impact |
|-----------|-----------|---------|
| `clusteredCouch_enabled` | `couchdb.clusteredCouchEnabled` | **CRITICAL** - Must be updated |
| `local.diskPath` | `local_storage.preExistingDiskPath-1` | **CRITICAL** - Must be updated |

#### 2. Storage Configuration Changes

| Change | Impact |
|--------|---------|
| **Removed default storage sizes** | **CRITICAL** - Must explicitly set `couchdb.couchdb_node_storage_size` |
| **No default persistent volume sizes** | **CRITICAL** - Must set platform-specific storage sizes |

#### 3. Values File Structure Changes

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

## Best Practices

> **⚠️ WARNING**:
1. **Test First**: Always test migrations in a non-production environment
2. **Backup Data**: Ensure complete data backup before migration
3. **Monitor Closely**: Watch deployment logs and metrics during migration
4. **Document Changes**: Keep track of any custom configurations
5. **Plan Downtime**: Schedule migrations during maintenance windows

