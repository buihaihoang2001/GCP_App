resource "google_compute_address" "bastion" {
  name    = "bastion-ip"
  project = var.project_id
  region  = var.region
}

resource "google_compute_instance" "bastion" {
  name         = "devops-advance-dev-bastion"
  project      = var.project_id
  zone         = var.zone
  machine_type = "e2-medium"

  boot_disk {
    initialize_params {
      image = "ubuntu-os-cloud/ubuntu-minimal-2204-jammy-arm64-v20251022"
      size  = 20
      type  = "pd-balanced"
    }
  }

  network_interface {
    network    = var.network_self
    subnetwork = var.subnet_self
    access_config {
      nat_ip = google_compute_address.bastion.address
    }
  }

  service_account {
    email  = var.service_account_email
    scopes = ["cloud-platform"]
  }

  metadata = {
    enable-oslogin = "TRUE"
  }

  tags = ["bastion"]
}