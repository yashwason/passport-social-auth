const multer = require(`multer`),
    Path = require(`path`);

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, file.fieldname + Date.now() + Path.extname(file.originalname))
    }
});

exports.upload = multer({
    storage: storage
});