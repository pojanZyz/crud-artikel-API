const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { upload, ensureUploadsFolder } = require('./middleware/multerconfig');
const bodyParser = require('body-parser');

const articleRoutes = require('./routes/articleRoutes');

dotenv.config();

const app = express();
app.use(ensureUploadsFolder);
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('./img', express.static('./img'));
app.use('/articles', articleRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
