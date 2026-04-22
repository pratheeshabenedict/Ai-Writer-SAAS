const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:               { type: String, required: true },
  email:              { type: String, required: true, unique: true, lowercase: true },
  password:           { type: String },                  // null for Google OAuth users
  googleId:           { type: String },
  role:               { type: String, enum: ['user', 'admin'], default: 'user' },
  plan:               { type: String, enum: ['free', 'pro'], default: 'free' },
  isVerified:         { type: Boolean, default: false },
  verifyToken:        { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpire:{ type: Date },
  refreshToken:       { type: String },
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);