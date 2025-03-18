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
  },
  resetAutoIncrement: (callback)=>{
    const query = "SELECT COUNT(*) AS total FROM articles";
    db.query(query, (err, results) => {
      if (err) return callback(err, null);
      callback(null, results[0].total === 0);
    });
  }
};

module.exports = Article;
