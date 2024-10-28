// index.js
const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();

// Database connection setup
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "qwerty",
    database: 'joga_mysql',
});

con.connect(err => {
    if (err) throw err;
    console.log('Connected to joga_mysql db');
});

// Handlebars setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
}));

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Import routers
const articleRouter = require('./routes/article');
const authorRouter = require('./routes/author');  // Add this line for the author router

// Use routers
app.use('/', articleRouter);
app.use('/author', authorRouter);  // Add this line to handle all /author routes

// Start server
const PORT = 3004; 
app.listen(PORT, () => {
    console.log(`App is started at http://localhost:${PORT}`);
});
