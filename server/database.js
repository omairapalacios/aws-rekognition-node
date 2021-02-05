require('dotenv').config();
import { Pool } from 'pg';
import { addImageToCollection } from './faceRekognition';

const db = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

const savePicture = async (req, res) => {
  try {
    console.log('REQ IMAGE', req);
    const originalFile = req.file;

    if (!originalFile) {
      throw new Error('Unable to find original file!');
    }

    const { originalname, mimetype } = originalFile;

    const values = [
      originalname,
      mimetype,
      originalFile.bucket,
      originalFile.contentType,
      originalFile.location,
      originalFile.etag,
    ];

    console.log('DATABASE', db);
    const result = await db.query(
      'INSERT INTO pictures (filename, mimeType, bucket, contentType, location, etag) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      values
    );
    console.log('INSERT MESSAGE', result);
    console.log('ID INSERTED', result.rows[0].id);
    //Add to AWS Rekognition
    await addImageToCollection(
      originalFile.bucket,
      result.rows[0].id,
      originalFile.key
    );

    return res.status(200).json({ success: true, data: 'Upload complete' });
  } catch (e) {
    return res.status(500).json({
      success: false,
      data: e,
    });
  }
};
const getPictures = async ids => {
  console.log('IDDDDDDDDS', ids)
  const result = await db.query(
    'SELECT * FROM table WHERE id = ANY($1::int[])',
    [ids]
  );
  console.log('IMAGES FOUNDED', result.rows)
  return result.rows;
}

export { db, savePicture, getPictures };
