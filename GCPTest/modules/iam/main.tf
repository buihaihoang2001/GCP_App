# SA cho node GKE (kéo image + truy cập metrics/log + đọc secrets)
resource "google_service_account" "gke_node" {
  account_id   = "gke-node-sa"
  display_name = "GKE Node Service Account"
}

# SA cho workload/app (Workload Identity)
resource "google_service_account" "workload" {
  account_id   = "${var.project_name}-${var.env}-gsa"
  display_name = "Service Account for ${var.project_name}-${var.env}"
}

# SA cho Bastion (deploy quyền rộng)
resource "google_service_account" "bastion" {
  account_id   = "bastion-deployer-sa"
  display_name = "Bastion Deployer SA"
}

# Bind roles (project-level)
resource "google_project_iam_member" "node_artifact_reader" {
  project = var.project_id
  role    = "roles/artifactregistry.reader"
  member  = "serviceAccount:${google_service_account.gke_node.email}"
}

resource "google_project_iam_member" "node_logging" {
  project = var.project_id
  role    = "roles/logging.logWriter"
  member  = "serviceAccount:${google_service_account.gke_node.email}"
}
resource "google_project_iam_member" "node_monitoring" {
  project = var.project_id
  role    = "roles/monitoring.metricWriter"
  member  = "serviceAccount:${google_service_account.gke_node.email}"
}
resource "google_project_iam_member" "node_storage_viewer" {
  project = var.project_id
  role    = "roles/storage.objectViewer"
  member  = "serviceAccount:${google_service_account.gke_node.email}"
}

# Workload SA có quyền đọc secret & GCS (nếu app cần)
resource "google_project_iam_member" "workload_secret_accessor" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.workload.email}"
}
resource "google_project_iam_member" "workload_storage_rw" {
  project = var.project_id
  role    = "roles/storage.objectAdmin"
  member  = "serviceAccount:${google_service_account.workload.email}"
}

# Bastion: quyền deploy (container.admin) + compute.admin + artifact admin
resource "google_project_iam_member" "bastion_deploy" {
  project = var.project_id
  role    = "roles/container.admin"
  member  = "serviceAccount:${google_service_account.bastion.email}"
}
resource "google_project_iam_member" "bastion_compute" {
  project = var.project_id
  role    = "roles/compute.admin"
  member  = "serviceAccount:${google_service_account.bastion.email}"
}
resource "google_project_iam_member" "bastion_artifact" {
  project = var.project_id
  role    = "roles/artifactregistry.admin"
  member  = "serviceAccount:${google_service_account.bastion.email}"
}