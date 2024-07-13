const Pengguna = require('../models/Pengguna');

const updateProfile = (req, res) => {
  const { fotoBase64, email, tanggal_lahir } = req.body;
  const { id } = req.params;

  Pengguna.findById(id, (err, pengguna) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (!pengguna) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields based on what's provided in the request body
    if (fotoBase64) {
      pengguna.fotoBase64 = fotoBase64;
    }
    if (email) {
      pengguna.email = email;
    }
    if (tanggal_lahir) {
      pengguna.tanggal_lahir = tanggal_lahir;
    }

    // Update profile in database
    pengguna.updateProfile({ fotoBase64, email, tanggal_lahir }, (err, updatedPengguna) => {
      if (err) {
        console.error('Error updating user profile:', err);
        return res.status(500).json({ message: 'Failed to update user profile' });
      }

      res.json({
        message: 'User profile updated successfully',
        data: updatedPengguna
      });
    });
  });
};

module.exports = {
  updateProfile
};
