const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviews = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        default: 1
    },
    review: {
        type: String,
        required: true
    },
    helpful: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    images: [String]
}, { timestamps: true });


const reviewSchema = new mongoose.Schema({
    _id: {
        type:String,
        required: true
    },
    reviews: [reviews]
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);