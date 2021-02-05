require('dotenv').config();

import AWS from 'aws-sdk';

const rekognition = new AWS.Rekognition({ region: process.env.AWS_REGION });
const collectionName = 'my-rekognition-collection';

async function listCollections() {
  return new Promise((resolve, reject) => {
    rekognition.listCollections((err, collections) => {
      if (err) {
        return reject(err);
      }

      return resolve(collections);
    });
  });
}

async function createCollection(collectionName) {
  console.log('COLLECTION NAME', collectionName);
  return new Promise((resolve, reject) => {
    rekognition.createCollection(
      { CollectionId: collectionName },
      (err, data) => {
        if (err) {
          return reject(err);
        }

        return resolve(data);
      }
    );
  });
}
async function addImageToCollection(bucket, pictureId, s3Filename) {
  console.log('DATA TO SAVE COLLECT', bucket,pictureId, s3Filename)
  return new Promise((resolve, reject) => {
    rekognition.indexFaces(
      {
        CollectionId: collectionName,
        ExternalImageId: pictureId,
        Image: {
          S3Object: {
            Bucket: bucket,
            Name: s3Filename,
          },
        },
      },
      (err) => {
        if (err) {
          return reject(err);
        }
        return resolve();
      }
    );
  });
}

async function recogniseFromBuffer(image) {
  console.log('IMAGE BUFFER', image)
    return new Promise((resolve, reject) => {
      rekognition.searchFacesByImage(
        {
          CollectionId: collectionName,
          FaceMatchThreshold: 95,
          Image: { Bytes: image },
          MaxFaces: 5
        },
        async (err, data) => {
          console.log('DATA REKOGNITION', data)
          if (err) {
            return reject(err)
          }
  
          if (data.FaceMatches && data.FaceMatches.length > 0 && data.FaceMatches[0].Face) {
            const sorted = data.FaceMatches.sort(
              (a, b) => b.Face.Confidence - a.Face.Confidence
            )
  
            const matchSet = new Set()
            sorted.forEach(match => {
              matchSet.add(Types.ObjectId(match.Face.ExternalImageId.toString()))
            })
  
            const pictures = getPictures(Array.from(matchSet).map(c => Types.ObjectId(c)))
  
            return resolve(pictures)
          }
          return reject('Not recognized')
        }
      )
    })
}

async function initialise() {
  AWS.config.region = process.env.AWS_REGION;

  const collections = await listCollections();
  console.log('COLECCTION REKOG', collections)
  const hasCollections =
    collections &&
    collections.CollectionIds &&
    collections.CollectionIds.length;
  const collectionIds = hasCollections ? collections.CollectionIds : [];
  const hasCollection = collectionIds.find((c) => c === collectionName);

  if (!hasCollection) {
    await createCollection(collectionName);
  }

}
export { initialise, addImageToCollection, recogniseFromBuffer };
