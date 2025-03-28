const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Article = sequelize.define(
  "Article",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING, // URL gambar dari Supabase
      allowNull: true,
    },
  },
  {
    tableName: "articles",
    timestamps: true,
  }
);

// Fungsi untuk mengambil semua artikel
Article.getAll = async function () {
  try {
    return await this.findAll();
  } catch (error) {
    console.error("Error in getAll:", error);
    throw error;
  }
};


// Fungsi untuk mengambil artikel berdasarkan ID
Article.getById = async function (id) {
  try{
    return await this.findByPk(id);
  }catch (error) {
    console.error("Error in getById:", error);
    throw error;
  }
};

// Fungsi untuk membuat artikel baru
Article.createArticle = async function (data) {
  try{
    return await this.create(data);
  }catch (error) {
    console.error("Error in createArticle:", error);
    throw error;
  }
  
};

// Fungsi untuk memperbarui artikel
Article.updateArticle = async function (id, data) {
  try{
    return await this.update(data, { where: { id } });
  }catch (error) {
    console.error("Error in updateArticle:", error);
    throw error;
  }
  
};

// Fungsi untuk menghapus artikel
Article.deleteArticle = async function (id) {
  try{
    return await this.destroy({ where: { id } });
  }catch (error) {
    console.error("Error in deleteArticle:", error);
    throw error;
  }
};

module.exports = Article;
