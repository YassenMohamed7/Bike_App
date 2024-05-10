const apiError = require("./apiError");
const {bucket} = require("../Config/connection");



const uploadImageToBucket =(file, callback) => {
    const ext = file.mimetype.split('/')[1];
    const imageName = `category/${Date.now()}.${ext}`;
    const imageFile = bucket.file(imageName);
    const fileStream = imageFile.createWriteStream();
    fileStream.on('error', () => {
        callback(new apiError("Error uploading image", 500));
    });
    let ImageUrl = null;
    fileStream.on('finish', async ()=>{
        try {
            const imageUrl = await imageFile.getSignedUrl({
                action: 'read',
                expires: '1-1-2040'
            });
            ImageUrl = imageUrl[0];
            callback(null, ImageUrl);
        }catch (err){
            callback(new apiError("Error uploading image", 500));
        }
    });
    fileStream.end(file.buffer);
}

module.exports = uploadImageToBucket;