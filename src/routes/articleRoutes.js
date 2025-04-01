const express = require('express');
const router = express.Router();
const articleController = require('../controller/articleControl');
const {adminValidation, accessValidation} = require('../middleware/accessValidation')
const { upload } = require('../middleware/multerconfig');

router.get('/', accessValidation,adminValidation,articleController.getArticles);
router.get('/:id', accessValidation,adminValidation,articleController.getArticleById);
router.post('/', accessValidation,adminValidation,upload.single('image'), articleController.createArticle); // Middleware upload digunakan di sini
router.put('/:id', accessValidation,adminValidation,upload.single('image'), articleController.updateArticle); // Middleware upload digunakan di sini
router.delete('/:id', accessValidation,adminValidation,articleController.deleteArticle);

module.exports = router;
