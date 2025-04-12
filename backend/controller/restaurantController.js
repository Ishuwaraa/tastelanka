const mongoose = require('mongoose');
const Restaurant = require('../model/RestaurantModel');
const User = require('../model/UserModel');
const Review = require('../model/ReviewModel');
const { getImageUrl, getArrayOfImageUrls, deleteImages } = require('../middleware/awsMiddleware');
const { cookieOptions } = require('../controller/userController');
const { generateToken } = require('../middleware/authMiddleware');
const axios = require('axios');

//get all restaurants
const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find().sort({ createdAt: -1 });        

        await Promise.all(
            restaurants.map(async (restaurant) => {
                if (restaurant.thumbnail !== null) {
                    restaurant.thumbnail = await getImageUrl(restaurant.thumbnail, 3600);
                }                
            })
        );        

        res.status(200).json({ restaurants });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

//get restaurant by id
const getRestaurantById = async (req, res) => {
    const { id } = req.params;

    try {
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: "Invalid ID" });

        const restaurant = await Restaurant.findById(id);
        if (!restaurant) return res.status(404).json({ msg: 'No restaurant found' });

        if (restaurant.thumbnail !== null) {
            restaurant.thumbnail = await getImageUrl(restaurant.thumbnail, 3600);            
        }
        if (restaurant.menu.length !== 0) {
            restaurant.menu = await getArrayOfImageUrls(restaurant.menu, 3600);
        }
        if (restaurant.images.length !== 0) {
            restaurant.images = await getArrayOfImageUrls(restaurant.images, 3600);
        }

        await Promise.all(
            restaurant.promotions.map(async (promotion) => {
                if (promotion.thumbnail !== null) {
                    promotion.thumbnail = await getImageUrl(promotion.thumbnail, 3600);
                }
            })
        )

        res.status(200).json(restaurant);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

//get restaurant by name, location etc.
const searchRestaurants = async (req, res) => {
    const { query } = req.query;

    if (!query) return res.status(400).json({ msg: "Search query is required" });    

    try {
        const restaurants = await Restaurant.find({
            $or: [
                { name: { $regex: query, $options: "i" } },  //case insensitive partial match
                { location: { $regex: query, $options: "i" } } 
            ]
        });

        const restaurantDoc = []

        await Promise.all(
            restaurants.map(async (restaurant) => {
                if (restaurant.thumbnail !== null) {
                    restaurant.thumbnail = await getImageUrl(restaurant.thumbnail, 3600);
                }                
                const review = await Review.findById(restaurant._id)
                restaurantDoc.push({ restaurant, review });
            })
        );        

        res.status(200).json(restaurantDoc);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getRestaurantsByCategory = async (req, res) => {
    const { query } = req.query;

    if (!query) return res.status(400).json({ msg: "Category is required" });    

    try {
        const restaurants = await Restaurant.find({
            category: { $regex: `^${query}$`, $options: "i" } //case insensitive match
        });

        const restaurantDoc = []

        await Promise.all(
            restaurants.map(async (restaurant) => {
                if (restaurant.thumbnail !== null) {
                    restaurant.thumbnail = await getImageUrl(restaurant.thumbnail, 3600);
                }                
                const review = await Review.findById(restaurant._id)
                restaurantDoc.push({ restaurant, review });
            })
        );  

        res.status(200).json(restaurantDoc);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

//get restaurant recommendations
const getRestaurantRecommendations = async (req, res) => {
    const { query } = req.query;

    try {
        if (!query) return res.status(400).json({ error: 'No search query provided' });        
                
        const flaskResponse = await axios.post('http://localhost:5000/recommend', {
            query: query
        });
        
        const recommendedIds = flaskResponse.data.recommended_ids.map(id => new mongoose.Types.ObjectId(id));
            
        const restaurants = await Restaurant.find({
            _id: { $in: recommendedIds }
        });
                
        //preserve the order of recommendations
        // const sortedRestaurants = recommendedIds.map(id => 
        //     restaurants.find(restaurant => restaurant._id.toString() === id)
        // ).filter(Boolean);

        const restaurantDoc = []

        await Promise.all(
            restaurants.map(async (restaurant) => {
                if (restaurant.thumbnail !== null) {
                    restaurant.thumbnail = await getImageUrl(restaurant.thumbnail, 3600);
                }                
                const review = await Review.findById(restaurant._id)
                restaurantDoc.push({ restaurant, review });
            })
        );  
        
        res.status(200).json(restaurantDoc);
        
    } catch (err) {        
        res.status(500).json({ msg: err.message });
    }
}

const getNearbyRestaurantsGeoSpatial = async (req, res) => {
    try {
        const { latitude, longitude, radius = 5 } = req.query; // radius in km. default 5km
        
        //convert coordinates to numbers
        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);
        
        // Validate coordinates
        if (isNaN(lat) || isNaN(lng)) return res.status(400).json({ msg: 'Invalid coordinates provided' });      
                
        //for this to work, need to add a 2dsphere index. didn't work the code to automatically create. manually create the index
        //convert coordinates to GeoJSON format
        const restaurants = await Restaurant.find({
            geoLocation: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [lng, lat] 
                    },
                    $maxDistance: radius * 1000 //convert km to meters
                }
            }
        });

        const restaurantDoc = []

        await Promise.all(
            restaurants.map(async (restaurant) => {
                if (restaurant.thumbnail !== null) {
                    restaurant.thumbnail = await getImageUrl(restaurant.thumbnail, 3600);
                }                
                const review = await Review.findById(restaurant._id)
                restaurantDoc.push({ restaurant, review });
            })
        );  
  
        return res.status(200).json(restaurantDoc);
        
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};

const generateDescription = (restaurant) => {
    //Known for ${restaurant.menu.slice(0, 3).join(", ")}.
    //${restaurant?.promotions?.length > 0 ? "Special promotions include " + restaurant.promotions.map(p => p.title).join(", ") + "." : ""}
    //It offers ${restaurant?.priceRange.join(", ")} 
    return `${restaurant.name} is a ${restaurant.category.join(", ")} restaurant located in ${restaurant.location}. It offers 2000-8000 price range dishes and has a rating of ${Math.floor(Math.random() * 6)}.`;
}

//create restaurant
const createRestaurant = async (req, res) => {
    const userId = req.userid;
    const role = req.role;
    const data = req.body;

    try {
        const thumbnailFilename = req.files.thumbnail ? req.files.thumbnail[0].key : null;        
        const menuFilenames = req.files.menuPhotos ? req.files.menuPhotos.map(file => file.key) : [];            
        const imageFilenames = req.files.restaurantPhotos ? req.files.restaurantPhotos.map(file => file.key) : [];

        //TODO: UNCOMMENT THIS
        // if (role !== 'customer') {
        //     const allImages = [
        //         ...(thumbnailFilename ? [thumbnailFilename] : []), 
        //         ...menuFilenames,
        //         ...imageFilenames
        //     ];
        //     await deleteImages(allImages);            
        //     return res.status(401).json({ msg: 'You can only add upto 1 restaurant' });
        // }

        const description = generateDescription(data);

        const restaurant = await Restaurant.create({
            name: data.name,
            owner: userId,
            contact: data.contact,
            webUrl: data.webUrl,
            location: data.location,
            latitude: data.latitude,
            longitude: data.longitude,            
            category: data.category,
            thumbnail: thumbnailFilename,
            menu: menuFilenames,
            images: imageFilenames,
            promotions: [],
            priceRange: [],
            embedding: description,
            openHours: JSON.parse(data.openHours),
            geoLocation: {
                type: 'Point',
                coordinates: [data.longitude, data.latitude]
            }
        });
        if (!restaurant) return res.status(500).json({ msg: 'Error creating the restaurant' });

        const user = await User.findByIdAndUpdate(userId, {
            restaurant: restaurant._id,
            role: 'customer'
        }, { new: true })
        if (!user) return res.status(500).json({ msg: 'Restaurant created. Error updating user' });  
        
        //update the cookie cuz role got updated
        const token = generateToken(user._id, user.role);        
        res.cookie("jwt", token, cookieOptions);

        res.status(201).json(restaurant);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

//add promotions
const addPromotion = async (req, res) => {
    const { id } = req.params;
    const userId = req.userid;
    const role = req.role;
    const data = req.body;

    try {
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: "Invalid ID" });

        if (role !== 'owner') return res.status(401).json({ msg: 'Not allowed' });        
            
        const promotion = {            
            title: data.title,
            description: data.description,
            thumbnail: req.file?.key
        }

        //id gets assigned automatically
        const restaurant = await Restaurant.findByIdAndUpdate(id, {
            $push: { promotions: promotion }
        }, { new: true });
        if (!restaurant) return res.status(500).json({ msg: 'Error adding the promotion' });

        res.status(200).json(restaurant);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }

}

//edit promotion
const editPromotion = async (req, res) => {
    const restaurantId = req.params.restaurantId;
    const promotionId = req.params.promotionId;
    const role = req.role;
    const data = req.body;

    try {
        if (role !== 'owner') return res.status(401).json({ msg: 'Not allowed' });
        if(!mongoose.Types.ObjectId.isValid(restaurantId)) return res.status(404).json({ msg: "Invalid ID" });
        if(!mongoose.Types.ObjectId.isValid(promotionId)) return res.status(404).json({ msg: "Invalid ID" });

        const restaurant = await Restaurant.findOneAndUpdate(
            { _id: restaurantId, 'promotions._id': promotionId },
            {
                $set: {
                    'promotions.$.title': data.title,
                    'promotions.$.description': data.description
                }
            },
            { new: true }
        );
        if (!restaurant) return res.status(500).json({ msg: 'error updating the promotion' });

        res.status(200).json(restaurant);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

//delete promotion
const deletePromotion = async (req, res) => {
    const restaurantId = req.params.restaurantId;
    const promotionId = req.params.promotionId;
    const role = req.role;

    try {
        if (role !== 'owner') return res.status(401).json({ msg: 'Not allowed' });

        const restaurant = await Restaurant.findByIdAndUpdate(restaurantId, {
            $pull: { 
                promotions: { _id: promotionId }
            }
        }, { new: true });
        if (!restaurant) return res.status(500).json({ msg: 'Error deleting the promotion' });

        res.status(200).json(restaurant);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

//update restaurant w new images

//update restaurant

//delete restaurant
const deleteRestaurant = async (req, res) => {
    const { id } = req.params;
    const userId = req.userid;
    const role = req.role;

    try {
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: "Invalid ID" });

        if (role !== 'owner') return res.status(401).json({ msg: 'Not allowed' });

        const restaurant = await Restaurant.findById(id);
        if (!restaurant) return res.status(404).json({ msg: 'No restaurant found' });

        const promotionThumbnails = [];
        restaurant.promotions.forEach((promotion) => {
            promotionThumbnails.push(promotion.thumbnail);
        });

        const allImages = [
            ...(restaurant.thumbnail ? [restaurant.thumbnail] : []), 
            ...restaurant.menu,
            ...restaurant.images,
            ...promotionThumbnails
        ];
        await deleteImages(allImages);        

        const user = await User.findByIdAndUpdate(userId, {
            restaurant: null,
            role: 'customer'
        }, { new: true })
        if (!user) return res.status(500).json({ msg: 'Error updating user' });  

        await Review.findByIdAndDelete(id);
        await Restaurant.findByIdAndDelete(id);
            
        const token = generateToken(user._id, user.role);        
        res.cookie("jwt", token, cookieOptions);
        res.status(200).json({ msg: 'Restaurant deleted successfully' });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

module.exports = { getAllRestaurants, getRestaurantById, searchRestaurants, getRestaurantsByCategory, 
    getRestaurantRecommendations, getNearbyRestaurantsGeoSpatial, createRestaurant, addPromotion, editPromotion, deletePromotion, deleteRestaurant };