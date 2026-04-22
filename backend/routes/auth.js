const express  = require('express');
const router   = express.Router();
const passport = require('passport');
const ctrl     = require('../controllers/authController');
const { generateAccessToken, generateRefreshToken, setRefreshCookie } = require('../utils/generateToken');

router.post('/register',            ctrl.register);
router.get ('/verify-email/:token', ctrl.verifyEmail);
router.post('/login',               ctrl.login);
router.post('/refresh-token',       ctrl.refreshToken);
router.post('/logout',              ctrl.logout);
router.post('/forgot-password',     ctrl.forgotPassword);
router.post('/reset-password/:token', ctrl.resetPassword);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  async (req, res) => {
    const accessToken  = generateAccessToken(req.user._id);
    const refreshToken = generateRefreshToken(req.user._id);
    req.user.refreshToken = refreshToken;
    await req.user.save();
    setRefreshCookie(res, refreshToken);
    res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${accessToken}`);
  }
);

module.exports = router;