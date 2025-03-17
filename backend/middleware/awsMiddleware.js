const { S3Client, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const multer = require('multer');
const multerS3 = require('multer-s3');

const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.BUCKET_ACCESS_KEY,
        secretAccessKey: process.env.BUCKET_SECRET_ACCESS_KEY,
    },
    region: process.env.S3_BUCKET_REGION
});

const upload = multer({
    storage: multerS3({
        s3,
        bucket: process.env.S3_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (req, file, nextFunc) {
            nextFunc(null, { fieldName: file.fieldname })
        },
        key: function (req, file, nextFunc) {
            nextFunc(null, `${Date.now().toString()}-${file.originalname}`);
        }
    })
}).fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'menuPhotos', maxCount: 2 },
    { name: 'restaurantPhotos', maxCount: 4 },
    { name: 'reviewImages', maxCount: 4 }
]);

const singleUpload = multer({
    storage: multerS3({
        s3,
        bucket: process.env.S3_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (req, file, nextFunc) {
            nextFunc(null, { fieldName: file.fieldname });
        },
        key: function (req, file, nextFunc) {
            nextFunc(null, `${Date.now().toString()}-${file.originalname}`);
        }
    })
}).single('file');


const getArrayOfImageUrls = async (imageArray, expTime) => {
    //creating urls parallely
    //.map creates an array of promisses. promise.all waits for all them to resolve or reject    
    const urls = await Promise.all(imageArray.map(async (image) => {
        const getObjectParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: image
        };
    
        try {
            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3, command, { expiresIn: expTime }); 
            return url;
        } catch (err) {
            console.log(`Error getting signed URL for image ${image}:`, err);
            throw err;
        }
    }));

    return urls;
}

const getImageUrl = async (image, expTime) => {
    const getObjectParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: image
    };

    try {
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: expTime }); 
        return url;
    } catch (err) {
        throw err;
    }
}

const deleteImages = async (imageArray) => {
    await Promise.all(imageArray.map(async (image) => {
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: image
        }

        try{
            const command = new DeleteObjectCommand(params);
            await s3.send(command);
        } catch (err) {
            console.log('Error deleting image ', image);
            throw err;
        }
    }));
}

module.exports = { s3, upload, singleUpload, getImageUrl, getArrayOfImageUrls, deleteImages };