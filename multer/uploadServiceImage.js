const multer = require('multer');
const path = require('path');
const fs = require('fs');


var storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        const dir = `./uploaded/services`
        const pathExist = fs.existsSync(dir);
        if (!pathExist) {
            return fs.mkdirSync(dir, { recursive: true })
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
    },
});

var upload = multer({
    storage: storage, preservePath: true, limits: { fileSize: 1024 * 1024 },
    fileFilter: function (req, file, callback) {

        if (file.mimetype != 'image/png' && file.mimetype != 'image/jpeg' && file.mimetype != 'image/jpg') {
            req.fileValidationError = "Invalid file type";
            return callback(new Error('Invalid file type, file must be png, jpg or jpeg'), false);
        }
        callback(null, true);
    },
});

module.exports = upload;