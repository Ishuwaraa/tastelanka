const express = require('express');
const router = express.Router();
const reviews = require('../controller/reviewController');
const { verifyJwt } = require('../middleware/authMiddleware');
const { upload} = require('../middleware/awsMiddleware');

router.get('/:id', reviews.getReviews);
router.patch('/:id/rating/:reviewId', reviews.updateRatings);
router.post('/:id', verifyJwt, upload, reviews.addReview);
router.post('/:id/reply/:reviewId', verifyJwt, reviews.replyToReview);

module.exports = router;