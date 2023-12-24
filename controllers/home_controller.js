const Post = require('../models/post')
const { body, validationResult } = require('express-validator')
const asyncHandler = require("express-async-handler");

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


