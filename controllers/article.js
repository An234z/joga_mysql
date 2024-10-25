
const mysql = require('mysql');

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
        SELECT article.*, author.name AS author_name
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

module.exports = {
    getAllArticles,
    getArticleBySlug,
    getAuthorArticles
};
