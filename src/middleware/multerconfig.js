const multer = require('multer');
const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, '../uploads');

// Middleware untuk memastikan folder "uploads" ada sebelum upload dilakukan
function ensureUploadsFolder(req, res, next) {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log('Folder uploads dibuat');
    }
    next();
}

// Konfigurasi penyimpanan untuk multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

module.exports = { upload, ensureUploadsFolder };
