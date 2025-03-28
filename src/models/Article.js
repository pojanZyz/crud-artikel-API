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
  return await this.findAll();
};

// Fungsi untuk mengambil artikel berdasarkan ID
Article.getById = async function (id) {
  return await this.findByPk(id);
};

// Fungsi untuk membuat artikel baru
Article.createArticle = async function (data) {
  return await this.create(data);
};

// Fungsi untuk memperbarui artikel
Article.updateArticle = async function (id, data) {
  return await this.update(data, { where: { id } });
};

// Fungsi untuk menghapus artikel
Article.deleteArticle = async function (id) {
  return await this.destroy({ where: { id } });
};

module.exports = Article;
