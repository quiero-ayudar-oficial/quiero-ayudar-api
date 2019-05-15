const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const EventSchema = new Schema({
    organization: {
        type: Schema.Types.ObjectId,
        ref: 'organization'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    direction: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    contact: {
        phone: {
            type: Number
        },
        mail: {
            type: String
        }
    },
    status: {
        type: Boolean
    },
    image: {
        type: String
    }
    
});

module.exports = Event = mongoose.model('event', EventSchema);