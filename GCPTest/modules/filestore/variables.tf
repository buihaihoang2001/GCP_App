variable "project_id" {
  type = string
}

variable "project_name" {
  type = string
}

variable "env" {
  type = string
}

variable "region" {
  type = string
}

variable "location" {
  type = string
}

variable "vpc_self_link" {
  description = "Self link của VPC để gắn vào Filestore"
  type        = string
}

variable "vpc_name" {
  description = "Tên VPC network"
  type        = string
}