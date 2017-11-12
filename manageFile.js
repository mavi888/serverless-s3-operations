'use strict';

const AWS = require('aws-sdk');
const S3 = new AWS.S3();

const BUCKET = 'serverless-s3-operations-bucket';
const OBJECTKEY = 'file.txt';

module.exports.appendText = text => {
  return getS3Object(BUCKET, OBJECTKEY).then(data => appendText(data.Body, text)).then(buffer => putS3Object(BUCKET, OBJECTKEY, buffer)).then(() => getSignedUrl(BUCKET, OBJECTKEY));
};

function getS3Object(bucket, key) {
  return S3.getObject({
    Bucket: bucket,
    Key: key,
    ResponseContentType: 'text/plain'
  })
    .promise()
    .then(file => {
      return file;
    })
    .catch(error => {
      //file not found
      return putS3Object(bucket, key, '');
    });
}

function appendText(data, text) {
  if (data === undefined) {
    return text;
  }
  return data.toString('ascii') + '\n' + text;
}

function putS3Object(bucket, key, body) {
  return S3.putObject({
    Body: body,
    Bucket: bucket,
    ContentType: 'text/plain',
    Key: key
  }).promise();
}

function getSignedUrl(bucket, key) {
  const params = { Bucket: bucket, Key: key };
  return S3.getSignedUrl('getObject', params);
}
