const Article = require('../models/Article');

exports.getArticles = (req, res) => {
  Article.getAll((err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.getArticleById = (req, res) => {
  Article.getById(req.params.id, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results[0]);
  });
};

exports.createArticle = (req, res) => {
  const data = {
    title: req.body.title,
    category: req.body.category,
    location: req.body.location,
    image: req.file ? req.file.filename : null
  };
  
  Article.create(data, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Article created", id: results.insertId });
  });
};

exports.updateArticle = (req, res) => {
    // Ambil artikel lama berdasarkan ID
    Article.getById(req.params.id, (err, results) => {
      if (err) return res.status(500).json(err);
      if (results.length === 0) return res.status(404).json({ message: "Article not found" });
  
      // Ambil gambar lama
      const oldImage = results[0].image;
  
      // Jika tidak ada gambar baru, gunakan gambar lama
      const data = {
        title: req.body.title,
        category: req.body.category,
        location: req.body.location,
        image: req.file ? req.file.filename : oldImage
      };
  
      // Update artikel dengan data baru
      Article.update(req.params.id, data, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Article updated" });
      });
    });
  };

exports.deleteArticle = (req, res) => {
  Article.delete(req.params.id, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Article deleted" });
  });
};