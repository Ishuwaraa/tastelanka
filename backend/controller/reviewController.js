const Review = require('../model/ReviewModel');
const Restaurant = require('../model/RestaurantModel');
const User = require('../model/UserModel');
const mongoose = require('mongoose');
const { getArrayOfImageUrls } = require('../middleware/awsMiddleware');

//get all reviews
const getReviews = async (req, res) => {
    const restaurantId = req.params.id;

    try {
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) return res.status(404).json({ msg: "No restaurant found" });

        const reviewDoc = await Review.findById(restaurant._id).populate('reviews.user', '-password');
        const reviewsArray = reviewDoc? reviewDoc.reviews : [];

        //directly modifies reviewDoc.reviews cuz reviewsArray is not a copy but a reference
        await Promise.all(reviewsArray.map(async (review) => {
            review.images = await getArrayOfImageUrls(review.images, 3600);
        }))

        res.status(200).json(reviewDoc);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

//update likes, dislikes
const updateRatings = async (req, res) => {
    const restaurantId = req.params.id;
    const reviewId = req.params.reviewId;
    const data = req.body;

    try {
        //$ to update the correct review inside the array
        const reviewDoc = await Review.findOneAndUpdate(
            { _id: restaurantId, "reviews._id": reviewId }, 
            { 
                $set: { 
                    "reviews.$.likes": data.likes, 
                    "reviews.$.dislikes": data.dislikes, 
                    "reviews.$.helpful": data.helpful 
                } 
            },
            { new: true }
        );        

        res.status(200).json(reviewDoc);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }    
}

//restaurant reply to review
const replyToReview = async (req, res) => {
    const userId = req.userid;
    const role = req.role;
    const restaurantId = req.params.id;
    const reviewId = req.params.reviewId;
    const data = req.body;

    try {
        if (role !== 'owner') return res.status(401).json({ msg: 'Not allowed' });

        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) return res.status(404).json({ msg: "No restaurant found" });

        //checking if the restaurant does belong to the logged in user
        const user = await User.findOne({ _id: userId, restaurant: restaurantId });
        if (!user) return res.status(401).json({ msg: 'No allowed' });

        const reviewDoc = await Review.findOneAndUpdate(
            { _id: restaurantId, "reviews._id": reviewId }, 
            { $set: { "reviews.$.reply": data.reply } },
            { new: true }   
        );
        if (!reviewDoc) return res.status(500).json({ msg: 'Error adding the reply' });

        res.status(200).json(reviewDoc);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

const addReview = async (req, res) => {
    const userId = req.userid;
    const restaurantId = req.params.id;
    const data = req.body;

    try {
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) return res.status(404).json({ msg: "No restaurant found" });

        const user = await User.findById(userId);
        if (!user) return res.status(401).json({ msg: 'No user found' });

        //blocking owner adding reviews to their own        
        if (user?.restaurant?.equals(restaurant._id)) return res.status(401).json({ msg: 'Not allowed' });

        let reviewDoc = await Review.findById(restaurantId);

        //if no doc found, create one
        if (!reviewDoc) {
            reviewDoc = new Review({
                _id: restaurant._id,
                reviews: []
            });
        }

        const reviewImages = req.files.reviewImages ? req.files.reviewImages.map(file => file.key) : [];        

        //pushing to the doc
        reviewDoc.reviews.push({
            user: userId,
            rating: data.rating,
            review: data.review,
            helpful: data.helpful,
            likes: data.likes,
            dislikes: data.dislikes,
            images: reviewImages
        });
        const updateDoc = await reviewDoc.save();

        const reviewsArray = updateDoc? updateDoc.reviews : [];        
        await Promise.all(reviewsArray.map(async (review) => {
            review.images = await getArrayOfImageUrls(review.images, 3600);
        }))

        if (updateDoc.reviews.length > 0) {
            const reviewRatings = updateDoc.reviews;
            let wholeRate = 0;

            reviewRatings.forEach((review) => {
                wholeRate += review.rating
            })

            const finalRate = wholeRate / reviewRatings.length;
            await Restaurant.findByIdAndUpdate(restaurantId, {
                rating: Math.round(finalRate)
            });
        }

        res.status(200).json(updateDoc);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

module.exports = { getReviews, updateRatings, replyToReview, addReview }