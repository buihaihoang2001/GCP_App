output "instance_name" { value = google_compute_instance.bastion.name }
output "nat_ip"        { value = google_compute_address.bastion.address }