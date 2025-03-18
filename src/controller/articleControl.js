const Article = require('../models/Article');
const supabase = require("../config/supabase")

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

exports.createArticle = async (req, res) => {
  try {
    let imageUrl = null;

    // Jika ada file yang diunggah, upload ke Supabase Storage
    if (req.file) {
      const filePath = `articles/${Date.now()}-${req.file.originalname}`;
      const { data, error } = await supabase.storage
        .from("uploads") // Ganti dengan nama bucket kamu
        .upload(filePath, req.file.buffer, { contentType: req.file.mimetype });

      if (error) throw error;
      imageUrl = `${supabase.storage.from("uploads").getPublicUrl(filePath).data.publicUrl}`;
    }

    const data = {
      title: req.body.title,
      category: req.body.category,
      location: req.body.location,
      image: imageUrl,
    };

    Article.create(data, (err, results) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Article created", id: results.insertId });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.updateArticle = async (req, res) => {
  try {
    // Ambil artikel lama berdasarkan ID
    Article.getById(req.params.id, async (err, results) => {
      if (err) return res.status(500).json(err);
      if (results.length === 0) return res.status(404).json({ message: "Article not found" });

      let imageUrl = results[0].image; // Gambar lama tetap digunakan jika tidak ada gambar baru
      let oldImagePath = imageUrl ? imageUrl.split('/uploads/')[1] : null; // Ambil path gambar lama

      // Jika ada file baru yang diunggah
      if (req.file) {
        const filePath = `articles/${Date.now()}-${req.file.originalname}`;
        const { data, error } = await supabase.storage
          .from("uploads")
          .upload(filePath, req.file.buffer, { contentType: req.file.mimetype });

        if (error) throw error;

        // Dapatkan URL gambar baru
        imageUrl = `${supabase.storage.from("uploads").getPublicUrl(filePath).data.publicUrl}`;

        // Jika ada gambar lama, hapus dari Supabase
        if (oldImagePath) {
          await supabase.storage.from("uploads").remove([oldImagePath]);
        }
      }

      // Data yang akan diperbarui
      const data = {
        title: req.body.title,
        category: req.body.category,
        location: req.body.location,
        image: imageUrl
      };

      // Update artikel dengan data baru
      Article.update(req.params.id, data, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Article updated" });
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


  exports.deleteArticle = (req, res) => {
    Article.delete(req.params.id, (err, results) => {
      if (err) return res.status(500).json(err);
          Article.resetAutoIncrement((err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Article deleted and auto-increment reset" });
          });
      });
    };
  