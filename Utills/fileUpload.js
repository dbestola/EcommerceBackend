const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log('Destination: upload');
        cb(null, 'upload'); // Ensure the 'upload' folder exists
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname); // Get the file extension
        console.log('Filename:', file.fieldname + '-' + uniqueSuffix + fileExtension);
        cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension); // Include the file extension
    }
});

function fileFilter(req, file, cb) {
    console.log('File type:', file.mimetype); // Log the file type
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'video/mp4') {
        cb(null, true);
    } else {
        console.log('File type not allowed');
        cb(null, false);
    }
}

const upload = multer({ storage: storage, fileFilter });

module.exports = { upload };
