const User = require('../models/user')
const bcrypt = require('bcrypt')
const asyncHandler = require('express-async-handler')

exports.signup_page_get = (req, res) => {
    res.render('signup_form')
}
exports.signup_page_post = asyncHandler(async (req, res) => {

    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const newUser = new User({
        userName: req.body.username,
        password: hashedPassword,
        email: req.body.email,
        status: req.body.status
    })
    newUser.save()
    res.redirect("/login")

})

