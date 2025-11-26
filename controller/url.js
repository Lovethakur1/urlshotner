const { nanoid } = require("nanoid");
const Url = require('../model/url')

async function handleGenerateNewsShortUrl(req, res) {
    const body = req.body;
    if (!body.url) return res.status(400).json({ error: 'url is required' })

    const shortid = nanoid(8);

    await Url.create({
        shortId: shortid,
        redirectUrl: body.url,
        visitHistory: [],
        createdBy: req.user._id,
    })

    // return res.json({id: shortid});
    return res.render('home', { id: shortid });


}



async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await Url.findOne({ shortId })

    return res.json({
        visitHistory: result.visitHistory.length,
        analytics: result.visitHistory,
    })

}


async function handleDeleteUrl(req, res) {
    const shortId = req.params.shortId;

    try {
        // Find the URL first
        const url = await Url.findOne({ shortId });

        if (!url) {
            return res.status(404).json({ error: 'URL not found' });
        }

        // Check authorization: user must own the URL or be an admin
        if (url.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
            return res.status(403).json({ error: 'Unauthorized to delete this URL' });
        }

        // Delete the URL
        await Url.deleteOne({ shortId });

        return res.json({ success: true, message: 'URL deleted successfully' });
    } catch (error) {
        console.error('Error deleting URL:', error);
        return res.status(500).json({ error: 'Failed to delete URL' });
    }
}


module.exports = {
    handleGenerateNewsShortUrl,
    handleGetAnalytics,
    handleDeleteUrl
}