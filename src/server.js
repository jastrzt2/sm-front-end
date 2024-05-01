const express = require('express');
const path = require('path');
const app = express();

// Folder z plikami statycznymi
const publicPath = path.join(__dirname, 'build');
app.use(express.static(publicPath));

// Obsługa wszystkich ścieżek
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
