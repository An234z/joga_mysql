const con = require('../utils/db'); 

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

module.exports = {
    getAllArticles,
    getArticleBySlug
};
