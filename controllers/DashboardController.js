const db = require('../config'); 
const bcrypt = require('bcryptjs');


exports.getAllUsersWithCounts = (req, res) => {
  const query = `
    SELECT 
      role,
      COUNT(*) AS total
    FROM pengguna
    GROUP BY role;
  `;

  db.query(query, (err, countsResults) => {
    if (err) {
      console.error('Error fetching user counts:', err);
      return res.status(500).json({ message: 'Failed to fetch user counts' });
    }

    const countData = countsResults.reduce((acc, row) => {
      acc[row.role] = row.total;
      return acc;
    }, {});

    const userQuery = `
      SELECT 
        id,
        username,
        nama_lengkap,
        email,
        tempat_tinggal,
        role
      FROM pengguna
      ORDER BY 
        CASE 
          WHEN role = 'admin' THEN 1
          ELSE 2
        END;
    `;

    db.query(userQuery, (err, usersResults) => {
      if (err) {
        console.error('Error fetching users:', err);
        return res.status(500).json({ message: 'Failed to fetch users' });
      }

      res.status(200).json({
        counts: countData,
        users: usersResults
      });
    });
  });
};



// Fungsi untuk mereset password pengguna
exports.resetPassword = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const newPassword = 'password'; // Password baru yang di-reset
    const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash password

    // Update password di database
    const query = 'UPDATE pengguna SET password = ? WHERE id = ?';
    db.query(query, [hashedPassword, userId], (err, results) => {
      if (err) {
        console.error('Error updating password:', err);
        return res.status(500).json({ message: 'Failed to reset password' });
      }
      res.status(200).json({ message: 'Password reset successfully' });
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
