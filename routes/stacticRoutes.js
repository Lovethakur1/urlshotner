const express = require('express');
const URL = require('../model/url');
const { restrictTo } = require('../middleware/auth');

const router = express.Router();

router.get('/admin/urls', restrictTo(['Admin']), async (req, res) => {
    // Ensure only logged-in users can access the home page listing
    if (!req.user) return res.redirect('/login');

    const allurls = await URL.find({}).populate('createdBy', 'name email');
    return res.render('home', {
        urls: allurls,
    });
});

router.get('/', restrictTo(['NORMAL']), async (req, res) => {
    // Ensure only logged-in users can access the home page listing
    if (!req.user) return res.redirect('/login');

    const allurls = await URL.find({ createdBy: req.user._id }).populate('createdBy', 'name email');
    return res.render('home', {
        urls: allurls,
    });
});


router.get('/signup', (req, res) => {
    // If user is already logged in, redirect to home
    if (req.user) {
        if (req.user.role === 'Admin') return res.redirect('/admin/urls');
        return res.redirect('/');
    }
    return res.render('signup');
})

router.get('/login', (req, res) => {
    // If user is already logged in, redirect to home
    if (req.user) {
        if (req.user.role === 'Admin') return res.redirect('/admin/urls');
        return res.redirect('/');
    }
    return res.render('login')
})

router.get('/stats/:shortId', restrictTo(['NORMAL', 'Admin']), async (req, res) => {
    if (!req.user) return res.redirect('/login');

    const { shortId } = req.params;
    const url = await URL.findOne({ shortId });

    if (!url) {
        return res.status(404).send('URL not found');
    }

    // Check authorization
    if (url.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
        return res.status(403).send('Unauthorized');
    }

    return res.render('stats', { url });
});



module.exports = router;