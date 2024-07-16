const db = require('../config');

class Voucher {
  constructor(kode, diskon, status) {
    this.kode = kode;
    this.diskon = diskon;
    this.status = status;
  }

  static create(newVoucher, result) {
    db.query("INSERT INTO voucher SET ?", newVoucher, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      result(null, { id: res.insertId, ...newVoucher });
    });
  }

  static findById(voucherId, result) {
    db.query(`SELECT * FROM voucher WHERE id = ${voucherId}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      if (res.length) {
        result(null, res[0]);
        return;
      }
      result({ kind: "not_found" }, null);
    });
  }

  static getAll(result) {
    db.query("SELECT * FROM voucher", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      result(null, res);
    });
  }
}

module.exports = Voucher;
