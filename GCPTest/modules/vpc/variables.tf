variable "project_id"   { type = string }
variable "project_name" { type = string }
variable "env"          { type = string }
variable "region"       { type = string }

variable "vpc_cidr" {
  description = "CIDR range for VPC"
  type        = string
}

variable "subnet_cidr" {
  description = "CIDR range for Subnet"
  type        = string
}