const express = require('express');
const { handleUserSignup, handleUserLogin, handleUserLogout } = require('../controller/user');

const router = express.Router();

router.post('/', handleUserSignup)
router.post('/login', handleUserLogin)
router.post('/logout', handleUserLogout)


module.exports = router;