require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser')
const db = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3333;
const isProd = process.env.PORT;

const api_routes = (require('./routes/api_routes'));

// Load middleware
if (isProd) {
    app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(express.json());
// Automatically parses cookies and lets you access additional cookie tools on the route request object
app.use(cookieParser());
// Load routes
app.use('/api', api_routes);

// Ensure the db connection is open and start the express server
db.once('open', () => {
    app.listen(PORT, () => console.log('Server started on port %s, PORT'));
});