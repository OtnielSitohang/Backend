const db = require('../config');

class PenggunaVoucher {
  constructor(penggunaId, voucherId) {
    this.penggunaId = penggunaId;
    this.voucherId = voucherId;
  }

  static create(newPenggunaVoucher, result) {
    db.query("INSERT INTO pengguna_voucher SET ?", newPenggunaVoucher, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      result(null, { id: res.insertId, ...newPenggunaVoucher });
    });
  }

  static findById(penggunaVoucherId, result) {
    db.query(`SELECT * FROM pengguna_voucher WHERE id = ${penggunaVoucherId}`, (err, res) => {
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
    db.query("SELECT * FROM pengguna_voucher", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      result(null, res);
    });
  }
}

module.exports = PenggunaVoucher;
