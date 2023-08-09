const mongoose = require('mongoose');
const isProd = process.env.PORT;

mongoose.connect(isProd ? process.env.MONGODB_URL : 'mongodb://127.0.0.1:27017/react_note_api_db');

module.exports = mongoose.connection;