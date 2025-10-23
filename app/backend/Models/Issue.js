const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const IssueSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['road', 'infrastructure', 'public-spaces', 'public-safety', 'utilities', 'other']
    },
    location: {
        type: String,
        required: false
    },
    coordinates: {
        lat: {
            type: Number,
            required: false
        },
        lng: {
            type: Number,
            required: false
        }
    },
    images: [{
        type: String, // Store image URLs or base64 strings
        required: false
    }],
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'in-progress', 'resolved', 'rejected']
    },
    priority: {
        type: String,
        default: 'medium',
        enum: ['low', 'medium', 'high', 'urgent']
    },
    issueId: {
        type: String,
        unique: true,
        required: true
    },
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: false // For now, making it optional for anonymous submissions
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: false
    },
    resolvedAt: {
        type: Date,
        required: false
    },
    comments: [{
        text: String,
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
});

// Update the updatedAt field before saving
IssueSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const IssueModel = mongoose.model('issues', IssueSchema);
module.exports = IssueModel;
