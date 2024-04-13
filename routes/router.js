var express = require('express');
var router = express.Router();
const page_controller = require('../controllers/page_controller')
const passport = require("passport")

router.get('/index',page_controller.index_page) 

router.get('/signup' ,page_controller.signup_page_get)
router.post('/signup',page_controller.signup_page_post)

router.get('/' ,page_controller.login_page)
router.get('/login' ,page_controller.login_page)

router.post('/login' , passport.authenticate('local', {
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

router.post('/delete_post', page_controller.delete_post);

router.get('/member_page' ,isAuthenticated, page_controller.member_page_get)
router.post('/member_page' ,page_controller.member_page_post)

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
