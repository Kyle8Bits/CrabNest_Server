const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = './uploads/';
        if (file.fieldname === 'avatar') {
            uploadPath += 'avatar';
        }else if (file.fieldname === 'banner') {
            uploadPath += 'banner';
        }else if (file.fieldname === 'post'){
            console.log("Post go here")
            uploadPath += 'post'
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
    }
});

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 100000000 }, // Set file size limit (optional)
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/; // Allowed extensions
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            return cb(new Error('Only .jpeg, .jpg, and .png files are allowed!'));
        }
    }
});


module.exports = upload;
