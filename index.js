const express = require('express');
const mongoose = require('mongoose');
const urlRoutes = require('./routes/url');
const connectDB = require('./connect');
const Url = require('./model/url');
const Path = require('path');
const app = express();
const staticRoutes = require('./routes/stacticRoutes');
const UserRoute = require('./routes/user')
const healthRoute = require('./routes/health')
const { checkForAuthentication, restrictTo } = require('./middleware/auth')

const cookieParser = require('cookie-parser')

// Load environment variables
require('dotenv').config();

const PORT = process.env.PORT || 8000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shortUrl';
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

connectDB(MONGODB_URI).then(() => {
    console.log('connected to db')
})

app.set("view engine", "ejs");
app.set("views", Path.resolve("./views"))


app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(checkForAuthentication);
// Make the authenticated user available to all EJS views
app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.baseUrl = BASE_URL;
    next();
});

app.use('/health', healthRoute)
app.use('/url', restrictTo(['NORMAL', 'Admin']), urlRoutes)
app.use('/user', UserRoute)
// Populate req.user if a session exists for all static routes
app.use('/', staticRoutes)


app.use('/g', async (req, res) => {
    const allUrls = await Url.find({});
    return res.render('home', { urls: allUrls })
})


app.get("/:shortId", async (req, res) => {
    const ShortId = req.params.shortId;

    const entry = await Url.findOneAndUpdate(
        { shortId: ShortId },
        { $push: { visitHistory: { timeStamp: Date.now() } } }
    );

    if (!entry) {
        return res.status(404).json({ error: 'Short URL not found' });
    }

    return res.redirect(entry.redirectUrl);
})



app.listen(PORT, () => console.log(`server running on port ${PORT}`));

