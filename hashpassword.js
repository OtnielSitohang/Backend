const mysql = require('mysql');
const bcrypt = require('bcryptjs');

// Konfigurasi koneksi MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Sesuaikan dengan username MySQL Anda
    password: '', // Sesuaikan dengan password MySQL Anda
    database: 'skripsibadmin' // Sesuaikan dengan nama database Anda
});

// Koneksi ke MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL database');
    hashPasswords();
});

// Fungsi untuk melakukan hashing password
async function hashPassword(password) {
    try {
        const salt = await bcrypt.genSalt(10); // Generate salt
        const hashedPassword = await bcrypt.hash(password, salt); // Hash password
        return hashedPassword;
    } catch (error) {
        throw error;
    }
}

// Fungsi untuk mengambil dan meng-hash password
function hashPasswords() {
    const selectQuery = 'SELECT id, password FROM pengguna'; // Query untuk mengambil semua pengguna

    connection.query(selectQuery, async (err, users) => {
        if (err) {
            console.error('Error querying users:', err);
            return;
        }

        // Loop melalui setiap pengguna dan hash password jika belum di-hash
        for (let user of users) {
            if (!user.hashedPassword && user.password) { // Jika password belum di-hash
                try {
                    const hashedPassword = await hashPassword(user.password); // Hash password

                    // Update kolom hashedPassword di database
                    const updateQuery = 'UPDATE pengguna SET hasedpassword = ? WHERE id = ?';
                    connection.query(updateQuery, [hashedPassword, user.id], (err, result) => {
                        if (err) {
                            console.error(`Error updating user ${user.id}:`, err);
                            return;
                        }
                        console.log(`Password hashed for user ${user.id}`);
                    });
                } catch (error) {
                    console.error(`Error hashing password for user ${user.id}:`, error);
                }
            }
        }

        console.log('All passwords hashed successfully');
        connection.end(); // Tutup koneksi setelah selesai
    });
}
