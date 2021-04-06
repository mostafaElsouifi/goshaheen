const express = require('express');
const router = express.Router();
const passport = require('passport');
const user = require('../controllers/user');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware');

router.route('/register')
      .get(isLoggedIn, user.renderRegisterFrom)
      .post(catchAsync(user.register));


router.route('/login')
      .get(user.renderLoginForm)
      .post(passport.authenticate('local', { failureFlash:true, failureRedirect: '/login'}), user.login);



//controlpanel
router.get('/controlpanel', isLoggedIn, user.renderControlPanelPage);




router.get('/logout', isLoggedIn, user.logout);

module.exports = router;