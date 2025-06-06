const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
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
    profilePic: {
        type: String,
        default: null
    },
    phone: {
        type: String,
        default: null,
    },
    role: {
        type: String,
        required: true,
        enum: ["customer", "owner"],
        default: 'customer'
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        default: null,
    },
    favourites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant"
    }]
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);