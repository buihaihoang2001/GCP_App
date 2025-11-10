output "filestore_ip" {
  value = google_filestore_instance.filestore.networks[0].ip_addresses[0]
}