// routes/author.js
const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');

// Define route for author by ID
router.get('/:author_id', authorController.getAuthorArticles);

module.exports = router;
