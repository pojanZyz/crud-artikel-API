const db = require('../config/database');

const query = `
SET @new_ai = (SELECT COALESCE(MAX(id), 0) + 1 FROM articles);
ALTER TABLE articles AUTO_INCREMENT = @new_ai;
`;

const Article = {
  getAll: (callback) => {
    db.query('SELECT * FROM articles', callback);
  },
  getById: (id, callback) => {
    db.query('SELECT * FROM articles WHERE id = ?', [id], callback);
  },
  create: (data, callback) => {
    db.query('INSERT INTO articles SET ?', data, callback);
  },
  update: (id, data, callback) => {
    db.query('UPDATE articles SET ? WHERE id = ?', [data, id], callback);
  },
  delete: (id, callback) => {
    db.query('DELETE FROM articles WHERE id = ?', [id], callback);
    db.query(query, callback);
  }
};

module.exports = Article;
