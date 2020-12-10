provider "aws" {
  version = "~> 3.0"
  region  = "us-east-1"
}

terraform {
  backend "s3" {
    bucket  = "axxes-terraform-eu-west-1"
    key     = "adventofcodedashboard/terraform.tfstate"
    region  = "eu-west-1"
    encrypt = true
  }
}
