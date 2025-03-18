const db = require('../config/database');
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
    db.query('SET @new_id = 0;', callback);
    db.query('UPDATE articles SET id = (@new_id := @new_id + 1);', callback);
    db.query('ALTER TABLE articles AUTO_INCREMENT = (SELECT MAX(id) + 1 FROM articles);',callback);
  }
};

module.exports = Article;
