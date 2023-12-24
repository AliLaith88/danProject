const User = require('../models/user')
const asyncHandler = require('express-async-handler')
exports.admin_page_get = (req, res) => {
    res.render('admin_page')
}
exports.admin_page_post = asyncHandler(async (req, res) => {
    const adminPass = req.body.adminPass
    if (adminPass !== '999921') {
        res.render('admin_page'), { errorMessage: "Invalid Password ! Enter True One" }
    } else {
        const user = await User.findById(req.user._id)
        user.admin = true
        user.status = 'member'
        user.save()
        res.redirect('/home')
    }
})
