resource "google_storage_bucket" "bucket-devops_advance" {
  project  = var.project_id
  name     = var.bucket_name
  location = var.location

  uniform_bucket_level_access = true
  force_destroy               = true   
}