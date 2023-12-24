var express = require('express');
var router = express.Router();
// const home_controller = require('../controllers/home_controller')
// const login_controller = require('../controllers/login_controller')
// const signup_controller = require('../controllers/signup_controller')
// const admin_controller = require('../controllers/admin_controller')
// const index_controller = require('../controllers/index_controller')
const page_controller = require('../controllers/page_controller')
const passport = require("passport")
const User = require('../models/user')
const Post = require('../models/post')

router.get('/index',page_controller.index_page) 

router.get('/signup' ,page_controller.signup_page_get)
router.post('/signup',page_controller.signup_page_post)

router.get('/login' ,page_controller.login_page)
router.post('/login' , 
passport.authenticate('local', {
    successRedirect:'/home',
    failureRedirect:'/signup'
}))

router.get("/log-out", (req, res, next) => {
  req.logout((err) => {
      if (err) {
          return next(err);
      }
      res.redirect("/login");
  });
});

router.get('/home', isAuthenticated ,page_controller.home_page)
router.post('/home',page_controller.home_post )

router.post('/delete_post', async (req, res) => {
  const postId = req.body.postID;

  try {
    const deletedPost = await Post.findByIdAndDelete(postId);
    if (!deletedPost) {
      return res.status(404).send('Post not found');
    }
    res.redirect('/home');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/member_page' ,isAuthenticated, (req, res , next)=>{
  res.render('member_page')
} )
router.post('/member_page' , async(req, res , next)=>{
  const enteredPassword = req.body.memPassword;
  
  if (enteredPassword !== '12345') {
      res.render('member_page', { errorMessage: 'Invalid password! Please enter the true Password' });
  } else {
      //1 -change status of user
      //2 - render home page
      const user = await User.findById(req.user._id);
      user.status = "member";
      user.save();
      res.redirect('/home');
  }
})

router.get('/admin_page',isAuthenticated,page_controller.admin_page_get )
router.post('/admin_page',page_controller.admin_page_post )

// this method provided by passportJS to check if user is authenticated.
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  }


module.exports = router;
