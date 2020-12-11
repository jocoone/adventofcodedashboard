resource "aws_s3_bucket" "frontend" {
  bucket = "axxes-advent-of-code-dashboard"
  acl    = "private"

  website {
    index_document = "index.html"
    error_document = "404.html"
  }

  tags = local.tags
}

resource "aws_cloudfront_origin_access_identity" "origin_access_identity" {
  comment = "Origin access identity for AOC Dashboard"
}

data "aws_iam_policy_document" "s3_policy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.frontend.arn}/*"]

    principals {
      type = "AWS"
      identifiers = [
      aws_cloudfront_origin_access_identity.origin_access_identity.iam_arn]
    }
  }

  statement {
    actions = ["s3:ListBucket"]
    resources = [
    aws_s3_bucket.frontend.arn]

    principals {
      type = "AWS"
      identifiers = [
      aws_cloudfront_origin_access_identity.origin_access_identity.iam_arn]
    }
  }
}

resource "aws_s3_bucket_policy" "frontend_bucket_policy" {
  bucket = aws_s3_bucket.frontend.id
  policy = data.aws_iam_policy_document.s3_policy.json
}
