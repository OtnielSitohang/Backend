const db = require('../config'); // Assuming this is the path to your db configuration

const updateProfile = (req, res) => {
    const { foto_base64, email, tempat_tinggal } = req.body;
    const { id } = req.params;
  
    // Construct the update query based on provided fields
    let updateFields = [];
    if (foto_base64) updateFields.push(`foto_base64 = '${foto_base64}'`);
    if (email) updateFields.push(`email = '${email}'`);
    if (tempat_tinggal) updateFields.push(`tempat_tinggal = '${tempat_tinggal}'`);
  
    // Prepare the SQL update statement
    const updateQuery = `UPDATE Pengguna SET ${updateFields.join(', ')} WHERE id = ?`;
    const values = [id];
  
    // Execute the update query
    db.query(updateQuery, values, (err, result) => {
      if (err) {
        console.error('Error updating user profile:', err);
        return res.status(500).json({ message: 'Failed to update user profile' });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Retrieve updated user data from the database
      const retrieveQuery = 'SELECT id, username, nama_lengkap, email, tempat_tinggal, tanggal_lahir, role, foto_base64 FROM Pengguna WHERE id = ?';
      db.query(retrieveQuery, [id], (err, rows) => {
        if (err) {
          console.error('Error retrieving updated user profile:', err);
          return res.status(500).json({ message: 'Failed to retrieve updated user profile' });
        }
  
        if (rows.length === 0) {
          return res.status(404).json({ message: 'User not found' });
        }
  
        // Send updated user data in the response
        const updatedUser = rows[0];
  
        res.json({
          message: 'User profile updated successfully',
          data: updatedUser  // Send updated user data in the response
        });
      });
    });
  };
  
  module.exports = {
    updateProfile
  };
