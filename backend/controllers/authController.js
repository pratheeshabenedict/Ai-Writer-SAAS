const crypto = require('crypto');
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken, setRefreshCookie } = require('../utils/generateToken');
const { sendEmail } = require('../utils/sendEmail');
const jwt = require('jsonwebtoken');

// REGISTER
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (await User.findOne({ email }))
    return res.status(400).json({ message: 'Email already in use' });

  const verifyToken = crypto.randomBytes(32).toString('hex');
  const user = await User.create({ name, email, password, verifyToken });

  const link = `${process.env.CLIENT_URL}/verify-email/${verifyToken}`;
  await sendEmail({
    to: email, subject: 'Verify your email',
    html: `<p>Click <a href="${link}">here</a> to verify your account.</p>`,
  });

  res.status(201).json({ message: 'Registered! Check your email to verify.' });
};

// VERIFY EMAIL
exports.verifyEmail = async (req, res) => {
  const user = await User.findOne({ verifyToken: req.params.token });
  if (!user) return res.status(400).json({ message: 'Invalid token' });

  user.isVerified = true;
  user.verifyToken = undefined;
  await user.save();
  res.json({ message: 'Email verified! You can now log in.' });
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !user.password || !(await user.matchPassword(password)))
    return res.status(401).json({ message: 'Invalid credentials' });

  if (!user.isVerified)
    return res.status(403).json({ message: 'Please verify your email first' });

  const accessToken  = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  setRefreshCookie(res, refreshToken);
  res.json({ accessToken, user: { id: user._id, name: user.name, role: user.role, plan: user.plan } });
};

// REFRESH TOKEN
exports.refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: 'No refresh token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== token)
      return res.status(403).json({ message: 'Invalid refresh token' });

    const accessToken = generateAccessToken(user._id);
    res.json({ accessToken });
  } catch {
    res.status(403).json({ message: 'Refresh token expired, please login again' });
  }
};

// LOGOUT
exports.logout = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET).id;
    await User.findByIdAndUpdate(decoded, { refreshToken: null });
  }
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out' });
};

// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({ message: 'No account with that email' });

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken  = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
  await user.save();

  const link = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  await sendEmail({
    to: user.email, subject: 'Reset your password',
    html: `<p>Click <a href="${link}">here</a> to reset your password. Link expires in 1 hour.</p>`,
  });

  res.json({ message: 'Reset email sent' });
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
  const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ message: 'Token invalid or expired' });

  user.password            = req.body.password;
  user.resetPasswordToken  = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.json({ message: 'Password reset successful' });
};