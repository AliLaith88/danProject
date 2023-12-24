const asyncHandler = require('express-async-handler')
const Post = require('../models/post')

exports.index_page =asyncHandler(async(req, res)=>{
    const post = await Post.find({}).populate('authorID').sort({ date: 'desc' })
  res.render('index_page', { user: req.user , posts:post }) 
}) 