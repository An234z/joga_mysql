// routes/article.js
const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');

// Define routes related to articles
router.get('/', articleController.getAllArticles);
router.get('/article/:slug', articleController.getArticleBySlug);

module.exports = router;
