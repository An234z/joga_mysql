const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const mysql = require('mysql');
const bodyParser = require('body-parser');


const app = express();


app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts'), 
}));

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "qwerty",
    database: 'joga_mysql',
});

con.connect(function(err) {
    if (err) throw err;
    console.log('Connected to joga_mysql db');
});

app.get('/', (req, res) => {
    let query = "SELECT * FROM article";
    let articles = []
    con.query(query, (err, result) => {
        if (err) throw err;
        articles = result
        

    res.render('layouts/index', {  
        title: 'Homepage',
        subtitle: 'Yoga Blog',
        articles: articles
    });
  });
});


app.listen(3004, () => {
    console.log('App is started at http://localhost:3004');
});

