const cloudinary = require(`cloudinary`).v2;

exports.uploadToCloudinary = async (req, file, folder) => {
    await cloudinary.uploader.upload(file, {
        folder: folder,
        use_filename: true
    }, function(err, response){
        if(err){
            return console.log(`Cloudinary Error: ${err}`);
        }
        
        return req.body.imageUrls.push(response.secure_url);
    });
}