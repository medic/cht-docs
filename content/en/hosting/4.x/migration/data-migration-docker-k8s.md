---
title: "Migration from Docker Compose CHT 4.x to Single-Node CHT 4.x on Kubernetes"
linkTitle: "To  Single-Node Kubernetes"
weight: 100
aliases:
  - /apps/guides/hosting/4.x/docker-kubernetes-migration

---

{{< hextra/hero-subtitle >}}
Guide on how to migrate existing data from CHT 4.x Docker Compose deployment to CHT 4.x single-node Kubernetes deployment
{{< /hextra/hero-subtitle >}}


This guide is oriented towards migrating a docker compose CHT instance hosted on a single machine into a kubernetes cluster. The machine will be enjoined as a node to the cluster.

1. Create a namespace for your project

```shell
kubectl create namespace my_cht_project_namespace
```

2. Setup Credentials

```shell
kubectl -n y_cht_project_namespace apply -f credentials.yaml
```
With credentials.yaml as:
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: cht-couchdb-credentials
type: Opaque
stringData:
  COUCHDB_PASSWORD: <CouchDB password>
  COUCHDB_SECRET: <CouchDB secret>
  COUCHDB_USER: <CouchDB user>
  COUCHDB_UUID: <UUID>
  COUCH_URL: http://<username>:<password>@haproxy.y_cht_project_namespace.svc.cluster.local:5984/medic
```

3. Create Roles & RoleBindings

```shell
kubectl -n my_cht_project_namespace apply -f roles.yaml
```
With roles.yaml as:
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: deployment-manager
rules:
- apiGroups:
  - apps
  resources:
  - deployments
  verbs:
  - get
  - update
  - watch
  - patch
  - list
- apiGroups:
  - ""
  resources:
  - pods
  verbs:
  - get
  - update
  - watch
  - patch
  - list
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: deployment-manager-cht
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: deployment-manager
subjects:
- apiGroup: ""
  kind: ServiceAccount
  name: cht-upgrade-service-user
```

4. Create Services

```shell
kubectl -n my_cht_project_namespace apply -f services.yaml
```
With services.yaml as
```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    cht.service: couchdb
  name: couchdb
spec:
  ports:
    - name: couchdb-service
      port: 5984
      protocol: TCP
      targetPort: 5984
    - name: epmd
      port: 4369
      protocol: TCP
      targetPort: 4369
    - name: erlang
      port: 9100
      protocol: TCP
      targetPort: 9100
  selector:
    cht.service: couchdb
---
apiVersion: v1
kind: Service
metadata:
  labels:
    cht.service: api
  name: api
spec:
  ports:
    - port: 5988
      targetPort: 5988
  selector:
    cht.service: api
---
apiVersion: v1
kind: Service
metadata:
  labels:
    cht.service: haproxy
  name: haproxy
spec:
  ports:
    - name: "5984"
      port: 5984
      targetPort: 5984
  selector:
    cht.service: haproxy
---
apiVersion: v1
kind: Service
metadata:
  name: healthcheck
spec:
  selector:
    cht.service: healthcheck
  ports:
    - protocol: TCP
      port: 5555
      targetPort: 5555
---
apiVersion: v1
kind: Service
metadata:
  name: upgrade-service
spec:
  selector:
    cht.service: upgrade-service
  ports:
    - name: upgrade-service
      port: 5008
      protocol: TCP
      targetPort: 5008
  type: ClusterIP
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: cht-upgrade-service-user
```

5. Setup single-node CouchDB deployment

```shell
kubectl -n my_cht_project_namespace apply -f couchdb-single-deployment.yaml
```
With couchdb-single-deployment.yaml as:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    cht.service: couchdb
  name: cht-couchdb
spec:
  replicas: 1
  selector:
    matchLabels:
      cht.service: couchdb
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        cht.service: couchdb
    spec:
      nodeSelector:
        kubernetes.io/hostname: <node name>
      containers:
        - env:
            - name: COUCHDB_LOG_LEVEL
              value: info
            - name: COUCHDB_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: cht-couchdb-credentials
                  key: COUCHDB_PASSWORD
            - name: COUCHDB_SECRET
              valueFrom:
                secretKeyRef:
                  name: cht-couchdb-credentials
                  key: COUCHDB_SECRET
            - name: COUCHDB_USER
              valueFrom:
                secretKeyRef:
                  name: cht-couchdb-credentials
                  key: COUCHDB_USER
            - name: COUCHDB_UUID
              valueFrom:
                secretKeyRef:
                  name: cht-couchdb-credentials
                  key: COUCHDB_UUID
            - name: SVC_NAME
              value: couchdb.my_cht_project_namespace.svc.cluster.local
          image: public.ecr.aws/medic/cht-couchdb:4.2.2
          name: cht-couchdb
          ports:
            - containerPort: 5984
          resources: {}
          volumeMounts:
            - mountPath: /opt/couchdb/data
              name: local-volume
              subPath: couchdb
            - mountPath: /opt/couchdb/etc/local.d
              name: local-volume
              subPath: local.d
      restartPolicy: Always
      volumes:
        - name: local-volume
          hostPath:
            path: /home/echisadmin/cht/
```

6. Create HAproxy deployment

```shell
kubectl -n my_cht_project_namespace apply -f haproxy-deployment.yaml
```
With haproxy-deployment.yaml as:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    cht.service: haproxy
  name: cht-haproxy
spec:
  replicas: 1
  selector:
    matchLabels:
      cht.service: haproxy
  strategy: {}
  template:
    metadata:
      labels:
        cht.service: haproxy
    spec:
      nodeSelector:
        kubernetes.io/hostname: <node name>
      containers:
        - env:
            - name: COUCHDB_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: cht-couchdb-credentials
                  key: COUCHDB_PASSWORD
            - name: COUCHDB_SERVERS
              valueFrom:
                configMapKeyRef:
                  name: couchdb-servers-configmap
                  key: COUCHDB_SERVERS
            - name: COUCHDB_USER
              valueFrom:
                secretKeyRef:
                  name: cht-couchdb-credentials
                  key: COUCHDB_USER
            - name: HAPROXY_IP
              value: 0.0.0.0
            - name: HAPROXY_PORT
              value: "5984"
            - name: HEALTHCHECK_ADDR
              value: healthcheck.my_cht_project_namespace.svc.cluster.local
          image: public.ecr.aws/medic/cht-haproxy:4.2.2
          name: cht-haproxy
          ports:
            - containerPort: 5984
          resources: {}
      hostname: haproxy
      restartPolicy: Always
```

7. Create Healthcheck deployment

```shell
kubectl -n my_cht_project_namespace apply -f healthcheck-deployment.yaml
```
With healthcheck-deployment.yaml as:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    cht.service: healthcheck
  name: cht-haproxy-healthcheck
spec:
  replicas: 1
  selector:
    matchLabels:
      cht.service: healthcheck
  strategy: {}
  template:
    metadata:
      labels:
        cht.service: healthcheck
    spec:
      nodeSelector:
        kubernetes.io/hostname: <node name>
      containers:
        - env:
            - name: COUCHDB_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: cht-couchdb-credentials
                  key: COUCHDB_PASSWORD
            - name: COUCHDB_SERVERS
              valueFrom:
                configMapKeyRef:
                  name: couchdb-servers-configmap
                  key: COUCHDB_SERVERS
            - name: COUCHDB_USER
              valueFrom:
                secretKeyRef:
                  name: cht-couchdb-credentials
                  key: COUCHDB_USER
          image: public.ecr.aws/medic/cht-haproxy-healthcheck:4.2.2
          name: cht-haproxy-healthcheck
          resources: {}
          ports:
            - containerPort: 5555
      restartPolicy: Always
```

8. Create CHT API deployment

```shell
kubectl -n my_cht_project_namespace apply -f api-deployment.yaml
```
With api-deployment.yaml as:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    cht.service: api
  name: cht-api
spec:
  replicas: 1
  selector:
    matchLabels:
      cht.service: api
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 0
      maxUnavailable: 1
  template:
    metadata:
      labels:
        cht.service: api
    spec:
      nodeSelector:
        kubernetes.io/hostname: <node name>
      containers:
        - env:
            - name: BUILDS_URL
              value: "https://staging.dev.medicmobile.org/_couch/builds_4"
            - name: COUCH_URL
              valueFrom:
                secretKeyRef:
                  name: cht-couchdb-credentials
                  key: COUCH_URL
            - name: UPGRADE_SERVICE_URL
              value: http://upgrade-service.my_cht_project_namespace.svc.cluster.local:5008
            - name: API_PORT
              value: "5988"
          image: public.ecr.aws/medic/cht-api:4.2.2
          name: cht-api
          ports:
            - containerPort: 5988
          resources: {}
      restartPolicy: Always
```

9. Create CHT Sentinel deployment

```shell
kubectl -n my_cht_project_namespace apply -f sentinel-deployment.yaml
```
With sentinel-deployment.yaml as:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    cht.service: sentinel
  name: cht-sentinel
spec:
  replicas: 1
  selector:
    matchLabels:
      cht.service: sentinel
  strategy: {}
  template:
    metadata:
      labels:
        cht.service: sentinel
    spec:
      containers:
        - env:
            - name: API_HOST
              value: api.my_cht_project_namespace.svc.cluster.local
            - name: COUCH_URL
              valueFrom:
                secretKeyRef:
                  name: cht-couchdb-credentials
                  key: COUCH_URL
            - name: API_PORT
              value: '5988'
          image: public.ecr.aws/medic/cht-sentinel:4.2.2
          name: cht-sentinel
          resources: {}
      restartPolicy: Always
status: {}
```

10. Create Ingress

```shell
kubectl -n my_cht_project_namespace apply -f ingress.yaml
```
With ingress.yaml as:
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-ingress
spec:
  rules:
  - host: <my domain>
    http:
      paths:
      - pathType: Prefix
        path: "/"
        backend:
          service:
            name: api
            port:
              number: 5988
  - host: <my domain>
    http:
      paths:
      - pathType: Prefix
        path: "/"
        backend:
          service:
            name: api
            port:
              number: 5988
```

### Using Helm
