resource "google_compute_network" "vpc" {
  name                    = "${var.project_name}-${var.env}-vpc"
  project                 = var.project_id
  auto_create_subnetworks = false
  routing_mode            = "REGIONAL"
}

resource "google_compute_subnetwork" "subnet" {
  name                     = "${var.project_name}-${var.env}-subnet"
  project                  = var.project_id
  region                   = var.region
  network                  = google_compute_network.vpc.id
  ip_cidr_range            = var.subnet_cidr
  private_ip_google_access = true
}

# 🔒 Firewall: allow internal communication
resource "google_compute_firewall" "internal_allow" {
  name    = "${var.project_name}-${var.env}-allow-internal"
  project = var.project_id
  network = google_compute_network.vpc.name

  allow {
    protocol = "all"
  }

  source_ranges = [var.vpc_cidr]
  target_tags   = ["internal"]
  direction     = "INGRESS"
  priority      = 1000
  description   = "Allow all internal traffic within the VPC"
}

resource "google_compute_global_address" "private_ip_range" {
  name          = "${var.project_name}-${var.env}-private-ip-range"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = google_compute_network.vpc.id
}

resource "google_service_networking_connection" "private_vpc_connection" {
  network                 = google_compute_network.vpc.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_ip_range.name]
}