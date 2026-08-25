# 🚀 EKS Microservices Platform

A production-style microservices application deployed on **Amazon EKS (Elastic Kubernetes Service)** using **Docker, Amazon ECR, Kubernetes, Helm, GitHub Actions, AWS IAM, and OIDC-based authentication**.

The project demonstrates how a containerized frontend and backend application can be built, stored, deployed, and managed on Kubernetes using an automated CI/CD pipeline.

---

## 🏗️ Architecture

```text
                         ┌──────────────────┐
                         │      GitHub      │
                         │   Source Code    │
                         └────────┬─────────┘
                                  │
                              git push
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ GitHub Actions   │
                         │     CI/CD        │
                         └────────┬─────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
              Docker Build                  Automated
                    │                         Testing
                    ▼
              Amazon ECR
             ┌──────┴──────┐
             │             │
        Frontend Image  Backend Image
             │             │
             └──────┬──────┘
                    │
                    ▼
             Amazon EKS Cluster
                    │
          ┌─────────┴─────────┐
          │                   │
          ▼                   ▼
     Frontend Pods       Backend Pods
          │                   │
          ▼                   ▼
    Frontend Service    Backend Service
          │                   │
          └─────────┬─────────┘
                    │
                    ▼
                  User
```

---

## ✨ Features

* Containerized frontend and backend applications
* Kubernetes-based microservices deployment
* Amazon EKS cluster deployment
* Docker image management using Amazon ECR
* Helm-based Kubernetes deployments
* Kubernetes Deployments and Services
* Namespace-based environment separation
* Configurable replica counts and container resources
* Readiness and liveness health checks
* Rolling updates and rollback support
* GitHub Actions CI/CD pipeline
* GitHub OIDC authentication with AWS IAM
* Versioned Docker image tags
* AWS VPC-based networking
* Multi-Availability Zone EKS architecture

---

## 🛠️ Tech Stack

### Application

* React
* Vite
* Node.js
* Express

### Containers

* Docker
* Docker Compose

### Kubernetes

* Kubernetes
* Amazon EKS
* Helm
* Pods
* Deployments
* ReplicaSets
* Services
* Namespaces
* ConfigMaps
* Secrets
* Readiness Probes
* Liveness Probes
* Resource Requests and Limits

### AWS

* Amazon EKS
* Amazon ECR
* Amazon VPC
* EC2
* IAM
* IAM OIDC
* Internet Gateway
* NAT Gateway
* AWS Load Balancing

### CI/CD

* GitHub Actions
* GitHub OIDC
* AWS STS

---

# 📁 Project Structure

```text
eks-microservices-platform/
│
├── microservices-app/
│   │
│   ├── frontend/
│   │   ├── src/
│   │   ├── public/
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── ...
│   │
│   └── backend/
│       ├── src/
│       ├── Dockerfile
│       ├── package.json
│       └── ...
│
├── helm/
│   │
│   ├── frontend/
│   │   ├── Chart.yaml
│   │   ├── values.yaml
│   │   └── templates/
│   │
│   └── backend/
│       ├── Chart.yaml
│       ├── values.yaml
│       └── templates/
│
├── .github/
│   └── workflows/
│       └── cd.yml
│
└── README.md
```

---

# 🔄 CI/CD Pipeline

The deployment pipeline is triggered when changes are pushed to the `main` branch.

```text
Developer
    │
    │ git push
    ▼
GitHub Repository
    │
    ▼
GitHub Actions
    │
    ├── Checkout Source
    │
    ├── Configure AWS
    │
    ├── Authenticate using OIDC
    │
    ├── Build Docker Images
    │
    ├── Tag Images
    │
    ├── Push Images to Amazon ECR
    │
    └── Deploy using Helm
             │
             ▼
          Amazon EKS
```

---

# 🔐 AWS Authentication

The project uses **GitHub OIDC with AWS IAM** instead of storing long-lived AWS access keys inside GitHub Secrets.

```text
GitHub Actions
      │
      │ OIDC Token
      ▼
AWS STS
      │
      ▼
IAM Role
      │
      ▼
AWS Resources
```

This provides temporary AWS credentials to the GitHub Actions workflow.

The IAM role is restricted through a trust policy so that only authorized GitHub Actions workflows can assume it.

---

# 🐳 Docker

Both services are containerized independently.

### Frontend

```text
React/Vite
    ↓
Dockerfile
    ↓
Frontend Docker Image
```

### Backend

```text
Node.js + Express
    ↓
Dockerfile
    ↓
Backend Docker Image
```

Images are tagged using versioned tags instead of relying on the `latest` tag.

Example:

```text
frontend:v1
frontend:v2

backend:v1
backend:v2
```

This makes deployments traceable and allows previous versions to be identified for rollback.

---

# 📦 Amazon ECR

Docker images are pushed to Amazon Elastic Container Registry.

```text
Amazon ECR
│
├── frontend
│   ├── v1
│   └── v2
│
└── backend
    ├── v1
    └── v2
```

EKS worker nodes pull the required images from ECR when Kubernetes creates Pods.

---

# ☸️ Kubernetes Architecture

The applications run inside an Amazon EKS cluster.

```text
EKS Cluster
│
├── Frontend Deployment
│   │
│   ├── Frontend Pod
│   └── Frontend Pod
│
├── Backend Deployment
│   │
│   ├── Backend Pod
│   └── Backend Pod
│
├── Frontend Service
│
└── Backend Service
```

Kubernetes Deployments maintain the desired number of replicas and automatically replace failed Pods.

---

# 🌐 Kubernetes Services

Services provide stable networking for Pods.

The frontend communicates with the backend through the backend Kubernetes Service rather than directly depending on individual Pod IP addresses.

```text
Frontend Pod
     │
     ▼
Backend Service
     │
 ┌───┴────┐
 ▼        ▼
Backend  Backend
 Pod      Pod
```

This allows Pods to be replaced or rescheduled without breaking service discovery.

---

# 📊 Helm

Helm is used to package and deploy the Kubernetes resources.

Each microservice has its own Helm chart.

```text
helm/
│
├── frontend/
│   ├── Chart.yaml
│   ├── values.yaml
│   └── templates/
│
└── backend/
    ├── Chart.yaml
    ├── values.yaml
    └── templates/
```

Helm separates application configuration from Kubernetes templates.

Example configuration:

```yaml
replicaCount: 2

image:
  repository: <ECR_REPOSITORY>
  tag: v1
```

The same Helm chart can be deployed with different configuration values for different environments.

---

# 🌎 Environment Management

The architecture supports separate Kubernetes environments such as:

```text
Development
     │
     ▼
Staging
     │
     ▼
Production
```

Each environment can have different:

* Replica counts
* Resource requests
* Resource limits
* Image versions
* Environment variables
* Application configuration

Namespaces can be used to provide logical separation between environments.

---

# 🔄 Deployment Strategy

Kubernetes Deployments support rolling updates.

For example:

```text
Current

backend:v1
├── Pod 1
└── Pod 2
```

After deploying a new version:

```text
backend:v2
├── Pod 1
└── Pod 2
```

Kubernetes gradually replaces the old Pods with new Pods rather than requiring the entire application to stop.

Helm also provides release history that can be used to inspect and roll back deployments.

---

# ❤️ Health Checks

The application can use Kubernetes health probes to improve reliability.

### Readiness Probe

Determines whether a Pod is ready to receive traffic.

```text
Pod starting
    ↓
Not Ready
    ↓
Application initialized
    ↓
Ready
    ↓
Receive traffic
```

### Liveness Probe

Determines whether the application is still functioning.

If a container becomes unhealthy, Kubernetes can restart it.

---

# 📈 Resource Management

Kubernetes resource requests and limits can be configured for workloads.

```yaml
resources:
  requests:
    cpu: 100m
    memory: 128Mi

  limits:
    cpu: 500m
    memory: 512Mi
```

Requests help Kubernetes schedule Pods appropriately while limits prevent individual containers from consuming uncontrolled resources.

---

# 🔒 Security

The project follows several cloud-native security practices:

* GitHub OIDC instead of long-lived AWS credentials
* AWS IAM roles
* Kubernetes RBAC
* Kubernetes Secrets for sensitive configuration
* Private networking for internal workloads
* Versioned container images
* Environment isolation using namespaces
* Least-privilege IAM policies where applicable

---

# 🚀 Local Development

## Clone the repository

```bash
git clone https://github.com/<your-username>/eks-microservices-platform.git

cd eks-microservices-platform
```

## Run Backend

```bash
cd microservices-app/backend

npm install
npm start
```

## Run Frontend

```bash
cd microservices-app/frontend

npm install
npm run dev
```

---

# 🐳 Build Docker Images

### Backend

```bash
docker build -t microservices-backend:v1 ./microservices-app/backend
```

### Frontend

```bash
docker build -t microservices-frontend:v1 ./microservices-app/frontend
```

---

# ☸️ Helm Deployment

After configuring AWS credentials and connecting to the EKS cluster:

```bash
aws eks update-kubeconfig \
  --region <AWS_REGION> \
  --name <EKS_CLUSTER_NAME>
```

Deploy the backend:

```bash
helm upgrade --install backend ./helm/backend
```

Deploy the frontend:

```bash
helm upgrade --install frontend ./helm/frontend
```

Check deployments:

```bash
kubectl get deployments
```

Check Pods:

```bash
kubectl get pods
```

Check Services:

```bash
kubectl get services
```

---

# 🔍 Useful Kubernetes Commands

### View Pods

```bash
kubectl get pods
```

### View Services

```bash
kubectl get svc
```

### View Deployments

```bash
kubectl get deployments
```

### View Namespaces

```bash
kubectl get namespaces
```

### View Helm Releases

```bash
helm list
```

### View Helm History

```bash
helm history frontend
```

### Rollback

```bash
helm rollback frontend <REVISION>
```

---

# 🎯 Learning Objectives

This project was built to gain practical experience with:

* Kubernetes container orchestration
* Amazon EKS
* Docker containerization
* Amazon ECR
* Helm
* Kubernetes networking
* Kubernetes Services
* Ingress
* Namespaces
* ConfigMaps and Secrets
* Kubernetes health checks
* Resource management
* AWS IAM
* GitHub OIDC
* CI/CD automation
* Rolling deployments
* Deployment rollback
* Cloud networking
* Microservices architecture

---

# 📌 Future Improvements

Potential improvements include:

* Terraform-based infrastructure provisioning
* AWS Load Balancer Controller
* External DNS
* TLS/HTTPS with ACM or cert-manager
* Horizontal Pod Autoscaler
* Cluster Autoscaler or Karpenter
* Prometheus and Grafana monitoring
* Centralized logging
* Argo CD / GitOps deployment
* AWS CloudWatch observability
* Network policies
* Production-grade secrets management using AWS Secrets Manager
* Automated security scanning for container images

---

## 👨‍💻 Author

**Ahmad Ali Javed**

BS Data Science — NUST SEECS

Focused on AI Engineering, Generative AI, Cloud Infrastructure, MLOps, Kubernetes, and production-ready AI systems.

---

## ⭐ Project Goal

The goal of this project is to demonstrate a complete cloud-native deployment workflow:

```text
Application Development
        ↓
Containerization
        ↓
Container Registry
        ↓
CI/CD Automation
        ↓
Kubernetes Deployment
        ↓
Cloud Infrastructure
        ↓
Scalable Microservices
```

This project combines **software engineering, DevOps, cloud infrastructure, Kubernetes, and CI/CD** into a complete end-to-end deployment architecture.
