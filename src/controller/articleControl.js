const Article = require('../models/Article');
const supabase = require("../config/supabase");

exports.getArticles = async (req, res) => {
  try {
    const { data, error } = await supabase.from('articles').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getArticleById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', req.params.id)
      .single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createArticle = async (req, res) => {
  try {
    let imageUrl = null;

    if (req.file) {
      console.log('Uploading image to Supabase...');
      const filePath = `articles/${Date.now()}-${req.file.originalname}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(filePath, req.file.buffer, { contentType: req.file.mimetype });

      if (uploadError) {
        console.error('Error uploading image:', uploadError.message);
        throw new Error('Failed to upload image to Supabase.');
      }

      const { data: publicUrlData, error: publicUrlError } = supabase.storage
        .from("uploads")
        .getPublicUrl(filePath);

      if (publicUrlError) {
        console.error('Error generating public URL:', publicUrlError.message);
        throw new Error('Failed to generate public URL for the image.');
      }

      imageUrl = publicUrlData.publicUrl;
      console.log('Public URL generated successfully:', imageUrl);
    }

    const { title, category, location } = req.body;

    console.log('Data to insert:', { title, category, location, image: imageUrl });

    const { error } = await supabase
      .from('articles')
      .insert([{ title, category, location, image: imageUrl }]);

    if (error) throw error;

    res.json({ message: "Article created successfully" });
  } catch (error) {
    console.error('Error in createArticle:', error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.updateArticle = async (req, res) => {
  try {
    const { title, category, location } = req.body;

    let imageUrl = null;
    if (req.file) {
      console.log('Uploading new image to Supabase...');
      const filePath = `article/${Date.now()}-${req.file.originalname}`;
      const { data, error } = await supabase.storage
        .from("uploads")
        .upload(filePath, req.file.buffer, { contentType: req.file.mimetype });

      if (error) {
        console.error('Error uploading image:', error);
        throw error;
      }
      imageUrl = `${supabase.storage.from("uploads").getPublicUrl(filePath).data.publicUrl}`;
      console.log('New image uploaded successfully:', imageUrl);
    }

    console.log('Data to update:', { title, category, location, image: imageUrl });

    const { error } = await supabase
      .from('articles')
      .update({ title, category, location, image: imageUrl })
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: "Article updated successfully" });
  } catch (error) {
    console.error('Error in updateArticle:', error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    console.log(`Deleting article with ID: ${req.params.id}`);

    const { data: article, error: fetchError } = await supabase
      .from('articles')
      .select('image')
      .eq('id', req.params.id)
      .single();

    if (fetchError) {
      console.error('Error fetching article:', fetchError.message);
      throw new Error('Failed to fetch article for deletion.');
    }

    if (article && article.image) {
      const filePath = article.image.split('/').slice(-2).join('/');
      console.log(`Extracted file path: ${filePath}`);

      const { error: deleteError } = await supabase.storage
        .from('uploads')
        .remove([filePath]);

      if (deleteError) {
        console.error('Error deleting image from bucket:', deleteError.message);
        throw new Error('Failed to delete image from bucket.');
      }

      console.log('Image deleted successfully from bucket.');
    } else {
      console.log('No image found for this article.');
    }

    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      console.error('Error deleting article:', error.message);
      throw new Error('Failed to delete article from the database.');
    }

    console.log('Reordering IDs after deletion...');
    await reorderArticleIds();

    res.json({ message: "Article deleted and IDs reordered successfully" });
  } catch (error) {
    console.error('Error in deleteArticle:', error.message);
    res.status(500).json({ error: error.message });
  }
};

async function reorderArticleIds() {
  const { data: articles, error } = await supabase
    .from('articles')
    .select('id')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching articles for reordering:', error.message);
    return;
  }

  for (let i = 0; i < articles.length; i++) {
    const newId = i + 1;
    if (articles[i].id !== newId) {
      await supabase
        .from('articles')
        .update({ id: newId })
        .eq('id', articles[i].id);
    }
  }
}

