variable "project_id"         { type = string }
variable "project_name"       { type = string }
variable "env"                { type = string }
variable "location"           { type = string }
variable "vpc_self_link"      { type = string }
variable "subnet_self_link"   { type = string }
variable "node_service_account" { type = string }
variable "enable_gpu_pool"    { 
  type = bool 
  default = false 
  }