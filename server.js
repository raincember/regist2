const express = require('express');
const routes = require('./routes');

const app = express();
const port = 3000;

// Middleware untuk parsing request body
app.use(express.json());

// Gunakan router dari routes.js
app.use('/', routes);

// Start server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
