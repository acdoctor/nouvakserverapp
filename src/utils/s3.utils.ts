import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  region: process.env.AWS_REGION as string,
});

const s3 = new AWS.S3();

export const uploadToS3 = (
  params: AWS.S3.PutObjectRequest,
): Promise<AWS.S3.ManagedUpload.SendData> => {
  return s3.upload(params).promise();
};
