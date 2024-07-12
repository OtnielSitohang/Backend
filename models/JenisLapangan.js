const db = require('../config');

class JenisLapangan {
    static create(nama, callback) {
        const query = 'INSERT INTO jenis_lapangan (nama) VALUES (?)';
        db.query(query, [nama], (err, result) => {
          if (err) {
            console.error('Error creating jenis lapangan:', err);
            return callback(err, null);
          }
          callback(null, result.insertId);
        });
      }
      
  
    static getAll(callback) {
      const query = 'SELECT * FROM jenis_lapangan';
      db.query(query, (err, results) => {
        if (err) {
          return callback(err, null);
        }
        callback(null, results);
      });
  }

  static getAll(callback) {
    const query = 'SELECT * FROM jenis_lapangan';
    db.query(query, (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  }
}

module.exports = JenisLapangan;
