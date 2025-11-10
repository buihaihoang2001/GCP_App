# VPC module
module "vpc" {
  source       = "../../modules/vpc"
  project_id   = var.project_id
  project_name = var.project_name
  env          = var.env
  region       = var.region
  vpc_cidr     = var.vpc_cidr
  subnet_cidr  = var.subnet_cidr
}

# Storage module
module "storage" {
  source      = "../../modules/storage"
  project_id  = var.project_id
  bucket_name = var.bucket_name
  location    = var.region        
}

# IAM module
module "iam" {
  source       = "../../modules/iam"
  project_id   = var.project_id
  project_name = var.project_name
  env          = var.env
}

# GKE module
module "gke" {
  source                = "../../modules/gke"
  project_id            = var.project_id
  project_name          = var.project_name
  env                   = var.env
  location              = var.location            # ✅ GKE là regional
  vpc_self_link         = module.vpc.vpc_self_link
  subnet_self_link      = module.vpc.subnet_self_link
  node_service_account  = module.iam.gke_node_service_account_email
  enable_gpu_pool       = var.enable_gpu_pool

  depends_on = [
    module.vpc,
    module.iam
  ]
}

# Artifact Registry module
module "artifact_registry" {
  source      = "../../modules/artifact_registry"
  project_id  = var.project_id
  repo_name   = var.artifact_repo_name
  location    = var.region                     # ✅ Region chứ không phải location
}

# Bastion Host module
module "bastion" {
  source                 = "../../modules/bastion"
  project_id             = var.project_id
  region                 = var.region          # ✅ region cho static IP
  zone                   = var.location        # ✅ zone cho VM
  network_self           = module.vpc.vpc_self_link
  subnet_self            = module.vpc.subnet_self_link
  service_account_email  = module.iam.bastion_service_account_email

  depends_on = [
    module.vpc,
    module.iam
  ]
}

# Cloud SQL module
module "cloudsql" {
  source        = "../../modules/cloudsql"
  project_id    = var.project_id
  instance_name = "${var.project_name}-${var.env}-postgres"
  region        = var.region
  vpc_self_link = module.vpc.vpc_self_link
  db_name       = var.db_name
  db_user       = var.db_name
  db_password   = var.db_password

  depends_on = [module.vpc]
}

# Filestore module
module "filestore" {
  source        = "../../modules/filestore"
  project_id    = var.project_id
  project_name  = var.project_name
  env           = var.env
  region        = var.region
  location      = var.location
  vpc_self_link = module.vpc.vpc_self_link
  vpc_name      = module.vpc.vpc_name  
}