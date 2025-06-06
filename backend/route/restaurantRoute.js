const express = require('express');
const router = express.Router();
const restaurants = require('../controller/restaurantController');
const { upload, singleUpload } = require('../middleware/awsMiddleware');
const { verifyJwt } = require('../middleware/authMiddleware');

router.get('/recommend', restaurants.getRestaurantRecommendations);
router.get('/nearby', restaurants.getNearbyRestaurantsGeoSpatial);
router.get('/search', restaurants.searchRestaurants);
router.get('/search/category', restaurants.getRestaurantsByCategory);
router.patch('/edit/:id', verifyJwt, restaurants.updateRestaurant);
router.get('/', restaurants.getAllRestaurants);
router.get('/:id', restaurants.getRestaurantById);
router.post('/', verifyJwt, upload, restaurants.createRestaurant);
router.delete('/:id', verifyJwt, restaurants.deleteRestaurant);

router.post('/promotions/:id', verifyJwt, singleUpload, restaurants.addPromotion);
router.patch('/:restaurantId/promotions/:promotionId', verifyJwt, restaurants.editPromotion);
router.delete('/:restaurantId/promotions/:promotionId', verifyJwt, restaurants.deletePromotion);

module.exports = router;