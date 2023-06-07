import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk-core'

const ATTACHMENT_S3_BUCKET = process.env.ATTACHMENT_S3_BUCKET
const SIGNED_URL_EXPIRATION = parseInt(process.env.SIGNED_URL_EXPIRATION)

const XAWS = AWSXRay.captureAWS(AWS)

const s3 = new XAWS.S3({
    signatureVersion: 'v4'
})

// TODO: Implement the fileStogare logic
export function getUploadUrl(imageId: string) : string {
    return s3.getSignedUrl('putObject', {
        Bucket: ATTACHMENT_S3_BUCKET,
        Key: imageId,
        Expires: SIGNED_URL_EXPIRATION
    })
}

export async function deleteImageFromS3(imageId: string) {
    await s3.deleteObject({
        Bucket: ATTACHMENT_S3_BUCKET,
        Key: imageId
    }).promise()
}