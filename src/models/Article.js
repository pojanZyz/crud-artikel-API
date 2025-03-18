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
    db.query('SET @max_id = (SELECT IFNULL(MAX(id), 0) FROM articles);', callback);
    db.query('SET @query = CONCAT("ALTER TABLE articles AUTO_INCREMENT = ", @max_id + 1);', callback);
    db.query('PREPARE stmt FROM @query;',callback);
    db.query('EXECUTE stmt;', callback);
    db.query('DEALLOCATE PREPARE stmt;', callback);
  }
};

module.exports = Article;
