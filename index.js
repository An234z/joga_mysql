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
    let query = `
        SELECT article.*, author.name AS author_name 
        FROM article 
        JOIN author ON article.author_id = author.id
    `;
    con.query(query, (err, result) => {
        if (err) throw err;
        res.render('index', {
            title: 'Homepage',
            subtitle: 'Yoga Blog',
            articles: result
        });
    });
});

app.get('/article/:slug', (req, res) => {
    let query = `
        SELECT article.*, author.name AS author_name, author.id AS author_id 
        FROM article 
        LEFT JOIN author ON article.author_id = author.id 
        WHERE article.slug = "${req.params.slug}"
    `;
    
    con.query(query, (err, result) => {
        if (err) throw err;
        const article = result[0];
        res.render('article', {
            article: article
        });
    });
});

app.get('/author/:author_id', (req, res) => {
    const authorId = req.params.author_id;

    // Esimene päring autori nime saamiseks
    let authorQuery = `SELECT * FROM author WHERE id = ${authorId}`;
    con.query(authorQuery, (err, authorResult) => {
        if (err) throw err;

        // Teine päring autori artiklite saamiseks
        let articlesQuery = `SELECT * FROM article WHERE author_id = ${authorId}`;
        con.query(articlesQuery, (err, articlesResult) => {
            if (err) throw err;
            res.render('author', {
                author: authorResult[0], // Autor on objekti esimene element
                articles: articlesResult
            });
        });
    });
});


app.listen(3004, () => {
   console.log('App is started at http://localhost:3004');
});
