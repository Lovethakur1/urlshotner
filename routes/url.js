const express = require('express');
const { handleGenerateNewsShortUrl, handleGetAnalytics, handleDeleteUrl } = require('../controller/url')

const router = express.Router();

router.post('/', handleGenerateNewsShortUrl)

router.get('/analytics/:shortId', handleGetAnalytics)

router.delete('/:shortId', handleDeleteUrl)

module.exports = router;