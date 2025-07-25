const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: false 
  },
  role: {
    type: String,
    required: true,
    enum: ['admin','donor','ngo','volunteer']
  },
  phone: {
    type: String
  },
  address: {
    type: String
  },
  assignedArea: { 
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpire: {
    type: Date
  }
});

module.exports = mongoose.model('user', UserSchema);