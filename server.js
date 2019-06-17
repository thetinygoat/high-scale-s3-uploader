const express = require("express");
const AWS = require("aws-sdk");
const app = express();
const config = require("./config");
const cors = require("cors");
const uuid = require("uuid/v1");
app.use(express.json());
app.use(cors());

const s3 = new AWS.S3({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
  signatureVersion: "v4",
  region: "ap-south-1"
});
app.get("/api/upload", (req, res) => {
  const key = `${uuid()}.jpeg`;
  const signedUrlExpireSeconds = 60 * 60;

  s3.getSignedUrl(
    "putObject",
    {
      Bucket: "sachin-uploader",
      ContentType: "image/jpeg",
      Key: key,
      ACL: "bucket-owner-full-control",
      Expires: signedUrlExpireSeconds
    },
    (err, url) => {
      res.status(200).json({ key, url });
    }
  );
});

app.listen(8080, () => {
  console.log("connected");
});
