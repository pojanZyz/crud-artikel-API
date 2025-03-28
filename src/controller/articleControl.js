const Article = require("../models/Article");
const supabase = require("../config/supabase");

// Ambil semua artikel
exports.getArticles = async (req, res) => {
  try {
    const articles = await Article.getAll();
    console.log("Fetched Articles:", articles); // Debugging log
    res.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error); // Logging error
    res.status(500).json({ error: error.message });
  }
};


// Ambil artikel berdasarkan ID
exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.getById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });
    res.json(article);
  } catch (error) {
    console.error("Error fetching articles:", error); // Logging error
    res.status(500).json({ error: error.message });
  }
};

// Buat artikel baru
exports.createArticle = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);
    console.log("REQ FILE:", req.file); // Cek apakah file masuk

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    let imageUrl = null;
    const filePath = `articles/${Date.now()}-${req.file.originalname}`;
    const { error } = await supabase.storage
      .from("uploads")
      .upload(filePath, req.file.buffer, { contentType: req.file.mimetype });

    if (error) throw error;
    imageUrl = supabase.storage.from("uploads").getPublicUrl(filePath);

    const newArticle = await Article.create({
      title: req.body.title,
      category: req.body.category,
      location: req.body.location,
      image: imageUrl,
    });

    res.json({ message: "Article created", article: newArticle });
  } catch (error) {
    console.error("ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
};


// Update artikel
exports.updateArticle = async (req, res) => {
  try {
    const article = await Article.getById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });

    let imageUrl = article.image;
    let oldImagePath = imageUrl ? imageUrl.split("/uploads/")[1] : null;

    if (req.file) {
      const filePath = `articles/${Date.now()}-${req.file.originalname}`;
      const { data, error } = await supabase.storage
        .from("uploads")
        .upload(filePath, req.file.buffer, { contentType: req.file.mimetype });

      if (error) throw error;
      imageUrl = supabase.storage.from("uploads").getPublicUrl(filePath).data.publicUrl;

      if (oldImagePath) {
        await supabase.storage.from("uploads").remove([oldImagePath]);
      }
    }

    await Article.updateArticle(req.params.id, {
      title: req.body.title,
      category: req.body.category,
      location: req.body.location,
      image: imageUrl,
    });

    res.json({ message: "Article updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Hapus artikel
exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.getById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });

    if (article.image) {
      let oldImagePath = article.image.split("/uploads/")[1];
      await supabase.storage.from("uploads").remove([oldImagePath]);
    }

    await Article.deleteArticle(req.params.id);
    res.json({ message: "Article deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
