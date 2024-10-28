const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');

router.get('/:author_id', authorController.getAuthorArticles);

module.exports = router;
