const express = require('express');
const { registerUser } = require('./handler');
const mysql = require('mysql');
const users = require('./register'); // Import modul users

const router = express.Router();

// Route POST untuk endpoint '/register'
router.post('/register', registerUser);

// Route GET untuk endpoint '/user'
router.get('/user/:id', (req, res) => {
  const userId = req.params.id;

  // Cari pengguna berdasarkan ID
  const user = users.find((user) => user.id === userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user);
});

// Route GET untuk endpoint '/users'
router.get('/users', (req, res) => {
  res.json(users);
});

module.exports = router;
