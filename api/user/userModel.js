const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'manager', 'owner']
  },
  organization: {
    type: Schema.Types.ObjectId,
    ref: 'Organization'
  },
  status: {
    type: String,
    default: 'confirmed'
  }
});

module.exports = UserModel = mongoose.model('User', UserSchema);
