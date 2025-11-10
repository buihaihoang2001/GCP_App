resource "google_artifact_registry_repository" "repo" {
  location      = var.location
  repository_id = var.repo_name
  description   = "Container images"
  format        = "DOCKER"
  project       = var.project_id
}
