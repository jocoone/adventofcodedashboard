locals {
  tags = {
    project = "adventofcode"
    owner   = "joey.comhaire@axxes.com"
  }
}

variable "domain_name" {
  type        = string
  description = "Domain name for the frontend CloudFront"
  default     = "adventofcode.javaxxes.com"
}

variable "hosted_zone_id" {
  type        = string
  description = "Id of the R53 hosted zone for the record mentioned above"
  default     = "Z0507340XJSB3T1IND9D"
}
