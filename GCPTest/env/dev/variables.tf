variable "project_id"   { 
  type = string 
  default = "devops-advance-477506"
  }
variable "project_name" { 
  type = string 
  default = "devops-advance"
  }
variable "env"          { 
  type = string 
  default = "dev"
  }
variable "region"       { 
  type = string 
  default = "us-central1"
  }
variable "location"     { 
  type = string  
  default = "us-central1-a" 
  } 
variable "tf_state_bucket" { 
  type = string 
  default = "" 
  }           

# VPC
variable "vpc_cidr"       { 
  type = string 
  default = "10.10.0.0/16" 
  }
variable "subnet_cidr"    { 
  type = string 
  default = "10.11.0.0/20" 
  }
variable "enable_gpu_pool" { 
  type = bool   
  default = false 
  }

# Artifact Registry
variable "artifact_repo_name" { 
  type = string 
  default = "devops-advance-dev-repo" 
  }
variable "image_project_repo"  { 
  type = string 
  default = "us-central1-docker.pkg.dev" 
  }

# Buckets
variable "bucket_name" { 
  type = string 
  default = "devops-advance-dev-bucket123123123" 
  }

# Cloud SQL
variable "db_name"     { 
  type = string 
  default = "devops-training-cloudsql" 
  }
variable "db_user"     { 
  type = string 
  default = "postgres" 
  }
variable "db_password" { 
  type = string
  default = "Hoangbh@2134"
   } 