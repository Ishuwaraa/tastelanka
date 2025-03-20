const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    webUrl: {
        type: String,
        default: null       
    },
    location: {
        type: String,
        required: true
    },
    latitude: {
        type: String
    },
    longitude: {
        type: String
    },
    rating: {
        type: Number,
        default: 0       
    },
    category: [String],
    thumbnail: {
        type: String,
        required: true
    },
    menu: [String],
    images: [String],
    promotions: [{        
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        thumbnail: {
            type: String,
            required: true
        }
    }],
    priceRange: [String],
    embedding: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Restaurant", restaurantSchema);