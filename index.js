const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router=  require('./routes/routes')
const dotenv = require('dotenv');
const app = express();
dotenv.config()
const url = process.env.DATABASE_URL;
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('url', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});
app.use('/', router);
// Middleware
app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
