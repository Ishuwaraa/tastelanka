const mongoose = require('mongoose');
const User = require('../model/UserModel');
const Restaurant = require('../model/RestaurantModel');
const Review = require('../model/ReviewModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { generateToken, genResetPassToken } = require('../middleware/authMiddleware');
const { getArrayOfImageUrls, getImageUrl } = require('../middleware/awsMiddleware');

const cookieOptions = {
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3 * 24 * 60 * 60 * 1000    //exp in 3d
}

const register = async (req, res) => {
    const { name, email, password } = req.body;
    const convEmail = email.toLowerCase();

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ msg: "All fields are required" });
        }    

        const user = await User.findOne({ email: convEmail });
        if (user) return res.status(400).json({ msg: "Email already exists" });

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email: convEmail,
            password: hash,
        });

        if (newUser) {
            const token = generateToken(newUser._id, newUser.role);
            await newUser.save();

            res.cookie("jwt", token, cookieOptions);
            res.status(201).json({ id: newUser._id, role: newUser.role });            
        } else {
            res.status(500).json({ msg: "Account creation failed" });
        }
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const cookies = req.cookies;
    const convEmail = email.toLowerCase();

    try {
        const user = await User.findOne({ email: convEmail });
        if (!user) return res.status(404).json({ msg: "Invalid credentials" });      
    
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ msg: "Invalid credentials" });      
    
        let token;
        
        if (cookies?.jwt) {
            try{
                jwt.verify(cookies.jwt, process.env.ACCESS_TOKEN_SECRET);
                token = cookies.jwt;
            } catch (err) {
                token = generateToken(user._id, user.role);
                res.cookie("jwt", token, cookieOptions);
            }
        } else {
            token = generateToken(user._id, user.role);
            res.cookie("jwt", token, cookieOptions);
        } 
  
        res.status(200).json({ id: user._id, role: user.role });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

const checkAuth = async (req, res) => {
    const userid = req.userid;
    const role = req.role;

    try {
        res.status(200).json({ id: userid, role });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

const logout = (req, res) => {
    const cookies = req.cookies;

    if(!cookies?.jwt) return res.status(401).json({ msg: 'No token' });

    res.clearCookie('jwt', {
        httpOnly: cookieOptions.httpOnly, 
        secure: cookieOptions.secure,
        sameSite: cookieOptions.sameSite,
    });
    res.status(200).json({ msg: 'logout success' });    
}

//get user data
const getUserData = async (req, res) => {
    const userId = req.userid;

    try{
        if(!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ msg: "Invalid ID" });

        // const user = await User.findById(userId).select('-password');
        const user = await User.findById(userId).select('-password').populate([
            // { path: 'restaurant', select: 'name thumbnail rating'},
            { path: 'favourites', select: 'name thumbnail rating location'}
        ]);
        if(!user) return res.status(404).json({ msg: 'No user found' });

        //need to generate s3 url for thumbnails
        if (user?.favourites?.length > 0) {
            await Promise.all(
                user.favourites.map(async (restaurant) => {
                    if (restaurant.thumbnail !== null) {
                        restaurant.thumbnail = await getImageUrl(restaurant.thumbnail, 3600);
                    }
                })
            );
        }

        if (user?.profilePic) {
            user.profilePic = await getImageUrl(user.profilePic, 3600);
        }
        res.status(200).json({ 
            name: user.name, phone: user.phone, 
            email: user.email, profilePic: user?.profilePic, favs: user.favourites
        });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

//get restaurant id
const checkRestaurantId = async (req, res) => {
    const userId = req.userid;
    const { restaurantId } = req.body;

    try{
        if(!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ msg: "Invalid ID" });
        if(!mongoose.Types.ObjectId.isValid(restaurantId)) return res.status(400).json({ msg: "Invalid ID" });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ msg: 'No user found' });

        const valid = user.restaurant === restaurantId;
        if (!valid) return res.status(401).json({ msg: 'Unauthorized' }); 
        
        res.sendStatus(200);
        
    } catch (err) { 
        res.status(500).json({ msg: err.message });
    }
}

const getUserRestaurant = async (req, res) => {
    const userId = req.userid;
    const role = req.role;

    try {
        if (role !== 'owner') return res.status(401).json({ msg: 'Not allowed' });

        const user = await User.findById(userId).select('-password');
        
        const restaurant = await Restaurant.findById(user.restaurant);
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
                
        const reviewDoc = await Review.findById(user.restaurant).populate('reviews.user', '-password');
        const reviewsArray = reviewDoc? reviewDoc.reviews : [];
        await Promise.all(reviewsArray.map(async (review) => {
            review.images = await getArrayOfImageUrls(review.images, 3600);

            if (review.user?.profilePic !== null) {
                review.user.profilePic = await getImageUrl(review.user.profilePic, 3600)
            }
        }))


        res.status(200).json({ restaurant, reviewDoc })
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

//add to user favs
const addToFavs = async (req, res) => {
    const userId = req.userid;
    const { restaurantId } = req.body;

    try {
        if(!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ msg: "Invalid ID" });
        if(!mongoose.Types.ObjectId.isValid(restaurantId)) return res.status(400).json({ msg: "Invalid ID" });

        //using set to avoid duplicates
        const user = await User.findByIdAndUpdate(userId, {
            $addToSet: { favourites: restaurantId }
        }, { new: true });
        if (!user) return res.status(500).json({ msg: 'Error adding to favourites' });

        res.status(200).json({ msg: "Added to favourites successfully" });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

//remove from favs
const removeFromFavs = async (req, res) => {
    const userId = req.userid;
    const { restaurantId } = req.body;

    try {
        if(!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ msg: "Invalid ID" });
        if(!mongoose.Types.ObjectId.isValid(restaurantId)) return res.status(400).json({ msg: "Invalid ID" });
        
        const user = await User.findByIdAndUpdate(userId, {
            $pull: { favourites: restaurantId }
        }, { new: true });
        if (!user) return res.status(500).json({ msg: 'Error removing favourites' });

        res.status(200).json({ msg: "Removed from favourites successfully" });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

//update profile pic
const updateProfilePic = async (req, res) => {
    const userId = req.userid;

    try {
        const user = await User.findByIdAndUpdate(userId, {
            profilePic: req.file?.key
        }, { new: true });

        if(!user) return res.status(500).json({ msg: 'Update failed' });

        user.profilePic = await getImageUrl(user.profilePic, 3600);
        res.status(200).json({ 
            name: user.name, phone: user.phone, 
            email: user.email, profilePic: user.profilePic 
        });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }

}

//update user data
const updateUserData = async (req, res) => {
    const userId = req.userid;
    const { name, phone } = req.body;

    try{
        if(!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ msg: "Invalid ID" });

        const user = await User.findByIdAndUpdate(userId, {
            name, phone
        }, { new: true }); 

        if(!user) return res.status(500).json({ msg: 'Update failed' });

        res.status(200).json({ name: user.name, phone: user.phone });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

//update pass
const updatePass = async (req, res) => {
    const userId = req.userid;
    const { currPass, newPass } = req.body;

    try{
        if(!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ msg: "Invalid ID" });

        const user = await User.findById(userId);
        if(!user) return res.status(404).json({ msg: 'No user found' });

        const match = await bcrypt.compare(currPass, user.password);
        if(!match) return res.status(400).json({ msg: 'Incorrect password' });
        
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPass, salt);

        const newUser = await User.findByIdAndUpdate(userId, { password: hash });
        if(!newUser) return res.status(500).json({ msg: 'Error updating password' });

        // res.clearCookie('jwt', {
        //     httpOnly: cookieOptions.httpOnly, 
        //     secure: cookieOptions.secure,
        //     sameSite: cookieOptions.sameSite,
        // });
        res.status(200).json({ msg: 'Password updated successfully' });

    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

//delete acc
const deleteAcc = async (req, res) => {
    const userId = req.userid;
    const { password } = req.body;
    
    try{
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({ msg: 'No user found' });

        const match = await bcrypt.compare(password, user.password);
        if(!match) return res.status(400).json({ msg: 'Incorrect passwrord' });

        //TODO: delete images from s3, delete restaurant, delete restaurant reviews, delete user posted reviews
                
        const deleted = await User.findByIdAndDelete(userId);
        if(!deleted) return res.status(500).json({ msg: 'Error deleting account' });

        res.clearCookie('jwt', {
            httpOnly: cookieOptions.httpOnly, 
            secure: cookieOptions.secure,
            sameSite: cookieOptions.sameSite,
        });
        res.status(200).json({ msg: 'Your account has been deleted successfully.' });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

//forgot pass 
//TODO: needs to change the email client in the env file
const forgotPass = async (req, res) => {
    const { email } = req.body;
    const convEmail = email.toLowerCase();

    try{
        const user = await User.findOne({ email: convEmail });
        if(!user) return res.status(404).json({ msg: 'Invalid email' });

        const resetPassToken = genResetPassToken(user._id);

        //sending token to the user's email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_CLIENT,
                pass: process.env.EMAIL_PASS,
            }
        });

        //email configuration
        const mailOptions = {
            from: process.env.EMAIL_CLIENT,
            to: convEmail,
            subject: 'Reset Password',
            html: `<h1>Reset Your Password</h1>
            <p>Click on the following link to reset your password:</p>
            <a href="http://localhost:3000/reset-password?token=${resetPassToken}">http://localhost:3000/reset-password?token=${resetPassToken}</a>
            <p>This link will expire in 10 minutes.</p>
            <p>If you didn't request a password reset, please ignore this email.</p>`,
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if(err) return res.status(500).json({ msg: err.message });
            res.status(200).json({ msg: 'Email sent' });
        });
        
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

//reset pass
const resetPass = async (req, res) => {
    const token = req.params.token;
    const { password } = req.body;

    try{
        const decoded = jwt.verify(token, process.env.RESET_PASS_TOKEN_SECRET);
        if(!decoded) return res.status(401).json({ msg: 'Invalid token' });

        const user = await User.findById(decoded.id);
        if(!user) return res.status(404).json({ msg: 'No user found' });

        const salt = await bcrypt.genSalt(10);  
        const hash = await bcrypt.hash(password, salt);  

        const updated = await User.findByIdAndUpdate(decoded.id, { password: hash }, { new: true });
        if(!updated) return res.status(500).json({ msg: 'Error updating password' });
        
        res.status(200).json({ msg: 'Password updated successfully' });

    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

module.exports = { cookieOptions, register, login, checkAuth, logout, getUserData, getUserRestaurant, addToFavs, removeFromFavs,
    updateUserData, updatePass, updateProfilePic, deleteAcc, forgotPass, resetPass };