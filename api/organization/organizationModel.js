const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const OrganizationSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  image: {
    type: String
  },
  direction: {
    type: String
  },
  startTime: {
    type: String
  },
  endTime: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  managers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  status: {
    type: String,
    default: 'confirmed'
  }
});

module.exports = OrganizationModel = mongoose.model('Organization', OrganizationSchema );
