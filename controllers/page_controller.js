const User = require('../models/user')
const bcrypt = require('bcrypt')
const asyncHandler = require('express-async-handler')
const Post = require('../models/post')
const { body, validationResult } = require('express-validator')

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

//--------------

exports.home_page =asyncHandler(async (req, res) => {
    const post = await Post.find({}).populate('authorID').sort({ date: 'desc' })
    res.render('home_page', { user: req.user, posts: post, errors:null })
}) 
exports.home_post = [
    body('title').trim().isLength({ min: 1 , max:50 }).withMessage('minimum title length = 1 and max = 50').escape(),
    body('txt').trim().isLength({ min: 1 , max:1000 }).withMessage('minimum story length length = 1 and max = 1000').escape(),

    asyncHandler(async (req, res, next) => {

        const errors = validationResult(req)
        const newPost = new Post({
            authorID: req.body.authorID,
            title: req.body.title,
            content: req.body.txt,
        })
        
        if (!errors.isEmpty()) {
            const post = await Post.find({}).populate('authorID').sort({ date: 'desc' })
            console.log(errors.array())
            res.render('home_page', { user:req.user,posts:post, errors:errors.array()})
            return

        } else {
            await newPost.save()
            res.redirect('/home')
        }



    })
]

//--------------


exports.index_page =asyncHandler(async(req, res)=>{
    const post = await Post.find({}).populate('authorID').sort({ date: 'desc' })
  res.render('index_page', { user: req.user , posts:post }) 
}) 

//--------------

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

//--------------

exports.login_page = (req, res) => {
    res.render('login_form')
}

