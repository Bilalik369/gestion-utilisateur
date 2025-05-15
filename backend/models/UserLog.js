const mongoose = require('mongoose');

const UserLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'register',
      'login',
      'logout',
      'verify_email',
      'forgot_password',
      'reset_password',
      'update_username',
      'request_email_change',
      'confirm_email_change',
      'update_phone',
      'change_password'
    ]
  },
  details: {
    type: String,
    required: true
  },
  ipAddress: String,
  userAgent: String
}, {
  timestamps: true
});

module.exports = mongoose.model('UserLog', UserLogSchema);