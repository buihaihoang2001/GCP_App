variable "project_id"           { type = string }
variable "region"               { type = string }
variable "zone"                 { type = string }
variable "network_self"         { type = string }
variable "subnet_self"          { type = string }
variable "service_account_email"{ type = string }
variable "ssh_users"            { 
    type = list(string) 
    default = [] 
    }