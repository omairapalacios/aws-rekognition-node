CREATE DATABASE kamidb;
CREATE TABLE pictures (
  id SERIAL PRIMARY KEY,
  filename TEXT,
  mimeType TEXT,
  bucket TEXT,
  contentType TEXT,
  location TEXT,
  etag TEXT
);
