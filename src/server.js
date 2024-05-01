const express = require('express');
const path = require('path');
const history = require('express-history-api-fallback');

const app = express();
const root = path.join(__dirname, 'build');

app.use(express.static(root));
app.use(history('index.html', { root }));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
