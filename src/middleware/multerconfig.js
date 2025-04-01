const multer = require('multer');

// Konfigurasi penyimpanan untuk multer (gunakan memori untuk Supabase)
const storage = multer.memoryStorage(); // File akan disimpan di memori, bukan di disk

// Konfigurasi multer
const upload = multer({ storage });

module.exports = { upload };
