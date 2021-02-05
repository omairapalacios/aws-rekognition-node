require('dotenv').config();

import express from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3-transform';
import { v4 } from 'uuid';
import aws from 'aws-sdk';
import { savePicture } from "./database"

const router = express.Router();

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
console.log('AMAZON S3', s3);

const setMetadata = (file) => ({ filename: file.originalname });
const setKey = (file) =>
  `${v4()}${file.originalname.substring(file.originalname.lastIndexOf('.'))}`;

const upload = () =>
  multer({
    storage: multerS3({
      s3,
      bucket: process.env.AWS_BUCKET,
      acl: 'public-read',
      metadata: (_req, file, cb) => {
        cb(null, setMetadata(file));
      },
      key: (_req, file, cb) => {
        cb(null, setKey(file));
      },
    }),
  });

  router.post("/upload", upload().single("filepond"), savePicture);

function Router(app) {
  app.use(`/api`, router);
}

export default Router;
