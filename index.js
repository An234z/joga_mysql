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


/*app.get('/', (req, res) => {
   let query = "SELECT * FROM article";
   let articles = []
   con.query(query, (err, result) => {
       if (err) throw err;
       articles = result
      


   res.render('index', { 
       title: 'Homepage',
       subtitle: 'Yoga Blog',
       articles: articles
   });
 });
});
app.get('/article/:slug', (req, res) => {
   let query = `SELECT * FROM article WHERE slug="${req.params.slug}"`
   let article
   console.log(query)
   con.query(query, (err, result) => {
       if (err) throw err;
       article = result
       console.log(article)
       res.render('article', {
           article: article
       })
   });
}); */
app.get('/article/:slug', (req, res) => {
    let query = `SELECT article.*, author.name AS author_name FROM article 
                 LEFT JOIN author ON article.author_id = author.id 
                 WHERE article.slug="${req.params.slug}"`;
    
    con.query(query, (err, result) => {
        if (err) throw err;
        const article = result[0]; // eeldame, et saame ainult ühe artikli
        console.log(article); // see peaks näitama artikli andmeid koos autori nimega
        res.render('article', {
            article: article
        });
    });
});

app.listen(3004, () => {
   console.log('App is started at http://localhost:3004');
});

