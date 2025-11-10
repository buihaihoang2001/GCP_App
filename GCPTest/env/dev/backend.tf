terraform {
  backend "gcs" {
    bucket = "devops-advance-477506-bucket"
    prefix = "tfstate/dev"
  }
}