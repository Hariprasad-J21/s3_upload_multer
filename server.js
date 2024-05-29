const express = require("express");
const multer = require("multer");
const AWS = require("aws-sdk");
const fs = require("fs");
require("dotenv").config();

const app = express();
const port = 3000;

// AWS S3 configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Upload file to S3
app.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: file.originalname, // or you can use a custom key
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error uploading file");
    } else {
      res.status(200).send(`File uploaded successfully. ${data.Location}`);
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
