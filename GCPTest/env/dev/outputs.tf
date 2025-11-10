output "vpc_name"           { value = module.vpc.vpc_name }
output "subnet_name"        { value = module.vpc.subnet_name }
output "vpc_self_link"      { value = module.vpc.vpc_self_link }
output "subnet_self_link"   { value = module.vpc.subnet_self_link }

output "artifact_repo"      { value = module.artifact_registry.repo_id }
output "gke_cluster_name"   { value = module.gke.cluster_name }
output "gke_endpoint"       { value = module.gke.endpoint }

output "cloudsql_connection_name" { value = module.cloudsql.connection_name }
output "cloudsql_private_ip"      { value = module.cloudsql.private_ip }

output "bastion_name"       { value = module.bastion.instance_name }
output "bastion_nat_ip"     { value = module.bastion.nat_ip }

output "image_bucket"       { value = module.storage.bucket_name }
output "filestore_ip" {
  value = module.filestore.filestore_ip
}