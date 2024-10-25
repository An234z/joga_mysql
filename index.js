const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();


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


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
}));

app.use(express.static('public'));


app.use(bodyParser.urlencoded({ extended: true }));


const getAllArticles = (req, res) => {
    const query = `
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
};


const getArticleBySlug = (req, res) => {
    const query = `
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
};


const getAuthorArticles = (req, res) => {
    const authorId = req.params.author_id;

    const authorQuery = `SELECT * FROM author WHERE id = ${authorId}`;
    const articlesQuery = `SELECT * FROM article WHERE author_id = ${authorId}`;

    con.query(authorQuery, (err, authorResult) => {
        if (err) throw err;
        if (authorResult.length === 0) {
            return res.status(404).send('Author not found');
        }
        con.query(articlesQuery, (err, articlesResult) => {
            if (err) throw err;
            res.render('author', {
                author: authorResult[0],
                articles: articlesResult,
                title: `${authorResult[0].name}'s Articles`
            });
        });
    });
};


app.get('/', getAllArticles);
app.get('/article/:slug', getArticleBySlug);
app.get('/author/:author_id', getAuthorArticles);


const PORT = 3004; 
app.listen(PORT, () => {
    console.log(`App is started at http://localhost:${PORT}`);
});

