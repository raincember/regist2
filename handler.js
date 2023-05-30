const bcrypt = require('bcrypt');
const mysql = require('mysql');

// Buat koneksi pool ke database MySQL di Google Cloud
const connection = mysql.createPool({
  host: 'nama_host',
  user: 'nama_pengguna',
  password: 'kata_sandi',
  database: 'nama_database',
});

function registerUser(req, res) {
  const { id, firstName, lastName, email, password, address, url_photo_profile, phone_number } = req.body;

  if (!id || !firstName || !lastName || !email || !password || !address || !phone_number) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  connection.getConnection((error, conn) => {
    if (error) {
      console.error('Error connecting to database:', error);
      return res.status(500).json({ message: 'Error connecting to database' });
    }

    // Cek apakah email sudah ada dalam database
    conn.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
      if (error) {
        conn.release();
        console.error('Error querying database:', error);
        return res.status(500).json({ message: 'Error querying database' });
      }

      if (results.length > 0) {
        conn.release();
        return res.status(409).json({ message: 'Email already exists' });
      }

      // Cek apakah nomor telepon sudah ada dalam database
      conn.query('SELECT * FROM users WHERE phone_number = ?', [phone_number], (error, results) => {
        if (error) {
          conn.release();
          console.error('Error querying database:', error);
          return res.status(500).json({ message: 'Error querying database' });
        }

        if (results.length > 0) {
          conn.release();
          return res.status(409).json({ message: 'Phone number already exists' });
        }

        // Hash password
        bcrypt.hash(password, 10, (error, hashedPassword) => {
          if (error) {
            conn.release();
            console.error('Error hashing password:', error);
            return res.status(500).json({ message: 'Error hashing password' });
          }

          // Simpan data user baru ke database
          const newUser = {
            id,
            firstName,
            lastName,
            email,
            password: hashedPassword,
            address,
            url_photo_profile,
            phone_number,
          };

          conn.query('INSERT INTO users SET ?', newUser, (error, results) => {
            conn.release();
            if (error) {
              console.error('Error inserting user to database:', error);
              return res.status(500).json({ message: 'Error inserting user to database' });
            }

            res.json({ message: 'Registration successful' });
          });
        });
      });
    });
  });
}

module.exports = {
  registerUser,
};
