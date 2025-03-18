const express = require('express');
const router = express.Router();
const articleController = require('../controller/articleControl');
const upload = require('../middleware/upload');

router.get('/', articleController.getArticles);
router.get('/:id', articleController.getArticleById);
router.post('/', upload.single('image'), articleController.createArticle);
router.put('/:id', upload.single('image'), articleController.updateArticle);
router.delete('/:id', articleController.deleteArticle);

module.exports = router;
