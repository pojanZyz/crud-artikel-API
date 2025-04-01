const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

const articleRoutes = require('./routes/articleRoutes');

dotenv.config();

const app = express();

// Middleware untuk mengaktifkan CORS
app.use(cors());

// Middleware untuk mem-parsing JSON
app.use(bodyParser.json());

// Rute untuk artikel
app.use('/articles', articleRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
console.log('Server initialized successfully.');
