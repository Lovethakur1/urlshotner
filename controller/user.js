const User = require('../model/user')
const { v4: uuid } = require('uuid')
const { setUser } = require('../service/auth')

async function handleUserSignup(req, res) {
    const { name, email, password } = req.body;

    await User.create({
        name,
        email,
        password
    })
    return res.redirect('/')
}



async function handleUserLogin(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password })
    if (!user) {
        return res.render("login", { error: "invalid username and password" })
    }
    console.log(user)



    const token = setUser(user);
    res.cookie("token", token)
    if (user.role === 'Admin') return res.redirect('/admin/urls');
    return res.redirect('/')
}



async function handleUserLogout(req, res) {
    res.clearCookie('token');
    return res.redirect('/login');
}



module.exports = {
    handleUserSignup, handleUserLogin, handleUserLogout
}