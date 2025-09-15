const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = async(filePath)=>{
    try{
        const result = await cloudinary.uploader.upload(filePath);
        return {
            url : result.secure_url,
            publicId : result.public_id
        }
    }catch(err){
        console.err('Error while uploading file to cloudinary',err);
        throw new Error('Error while uploading file to cloudinary');
    }
}

module.exports = {uploadToCloudinary};