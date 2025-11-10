resource "google_container_cluster" "main" {
  name     = "${var.project_name}-${var.env}-gke"
  project  = var.project_id
  location = var.location

  network    = var.vpc_self_link
  subnetwork = var.subnet_self_link

  remove_default_node_pool = true
  initial_node_count       = 1

  ip_allocation_policy {}

  workload_identity_config {
    workload_pool = "${var.project_id}.svc.id.goog"
  }

  deletion_protection = false
}

resource "google_container_node_pool" "cpu_general" {
  name     = "${var.project_name}-${var.env}-cpu-general"
  project  = var.project_id
  location = var.location
  cluster  = google_container_cluster.main.name

  node_count = 1

  node_config {
    machine_type    = "e2-medium"
    disk_type       = "pd-standard"
    disk_size_gb    = 20
    preemptible     = false
    service_account = var.node_service_account

    oauth_scopes = ["https://www.googleapis.com/auth/cloud-platform"]

    labels = { pool = "general", env = var.env }
    tags   = ["gke-node","cpu-general"]
  }
}

resource "google_container_node_pool" "cpu_worker" {
  name     = "${var.project_name}-${var.env}-cpu-worker"
  project  = var.project_id
  location = var.location
  cluster  = google_container_cluster.main.name

  node_count = 2

  node_config {
    machine_type    = "e2-standard-2"
    disk_type       = "pd-standard"
    disk_size_gb    = 15
    preemptible     = false
    service_account = var.node_service_account

    oauth_scopes = ["https://www.googleapis.com/auth/cloud-platform"]

    labels = { pool = "worker", env = var.env }
    tags   = ["gke-node","cpu-worker"]
  }
}

resource "google_container_node_pool" "gpu_pool" {
  count    = var.enable_gpu_pool ? 1 : 0
  name     = "${var.project_name}-${var.env}-gpu-pool"
  project  = var.project_id
  location = var.location
  cluster  = google_container_cluster.main.name

  node_count = 1

  node_config {
    machine_type    = "n1-standard-4"
    disk_type       = "pd-standard"
    disk_size_gb    = 20
    preemptible     = true
    service_account = var.node_service_account

    guest_accelerator {
      type  = "nvidia-tesla-p4"
      count = 1
    }

    metadata = { "install-nvidia-driver" = "true" }

    oauth_scopes = ["https://www.googleapis.com/auth/cloud-platform"]

    labels = { pool = "gpu", env = var.env }
    tags   = ["gke-node","gpu-node"]
  }

  depends_on = [
    google_container_cluster.main,
    google_container_node_pool.cpu_general,
    google_container_node_pool.cpu_worker
  ]
}