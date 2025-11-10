resource "google_filestore_instance" "filestore" {
  name     = "${var.project_name}-${var.env}-filestore"
  project  = var.project_id
  location = var.location
  tier     = "BASIC_HDD"

  file_shares {
    name        = "default"
    capacity_gb = 1024
  }

  networks {
    network = "projects/${var.project_id}/global/networks/${var.vpc_name}"  # ✅ sửa dòng này
    modes   = ["MODE_IPV4"]
  }
}