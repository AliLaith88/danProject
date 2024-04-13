const User = require('../models/user')
const Post = require('../models/post')
const bcrypt = require('bcrypt')
const asyncHandler = require('express-async-handler')

const { body, validationResult } = require('express-validator')

exports.admin_page_get = (req, res) => {
    res.render('admin_page', { errorMessage: "" })
}
exports.admin_page_post = asyncHandler(async (req, res) => {
    const adminPass = req.body.adminPass
    if (adminPass !== '999921') {
        res.render('admin_page', { errorMessage: "Invalid Password ! Enter True One" })
    } else {
        const user = await User.findById(req.user._id)
        user.admin = true
        user.status = 'member'
        user.save()
        res.redirect('/home')
    }
})

//--------------

exports.home_page = asyncHandler(async (req, res) => {
    const post = await Post.find({}).populate('authorID').sort({ date: 'desc' })
    res.render('home_page', { user: req.user, posts: post, errors: null })
})
exports.home_post = [
    body('title').trim().isLength({ min: 1, max: 50 }).withMessage('minimum title length = 1 and max = 50').escape(),
    body('txt').trim().isLength({ min: 1, max: 1000 }).withMessage('minimum story length length = 1 and max = 1000').escape(),

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
            res.render('home_page', { user: req.user, posts: post, errors: errors.array() })
            return

        } else {
            await newPost.save()
            res.redirect('/home')
        }



    })
]

//--------------


exports.index_page = asyncHandler(async (req, res) => {
    const post = await Post.find({}).populate('authorID').sort({ date: 'desc' })
    res.render('index_page', { user: req.user, posts: post })
})

//--------------

exports.signup_page_get = (req, res) => {
    res.render('signup_form', { errorMessage: null })
}
exports.signup_page_post = asyncHandler(async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const newUser = new User({
        userName: req.body.username,
        password: hashedPassword,
        email: req.body.email,
        status: req.body.status
    })
    await newUser.save()
    res.redirect("/login")
})

//--------------

exports.login_page = (req, res) => {
    res.render('login_form')
}

//--------------
exports.member_page_get = (req, res) => {
    res.render('member_page', { errorMessage: '' })
}
exports.member_page_post = asyncHandler(async (req, res, next) => {
    const enteredPassword = req.body.memPassword;

    if (enteredPassword !== '12345') {
        res.render('member_page', { errorMessage: 'Invalid password! Please enter the true Password' });
    } else {
        const user = await User.findById(req.user._id);
        user.status = "member";
        user.save();
        res.redirect('/home');
    }
})
//--------------

exports.delete_post = asyncHandler(async (req, res) => {
    const postId = req.body.postID;
    const deletedPost = await Post.findByIdAndDelete(postId);
    if (!deletedPost) {
        return res.status(404).send('Post not found');
    }
    res.redirect('/home');
}
) 