import React from 'react';
import Footer from "../components/shared/Footer";
import Navbar from "../components/shared/Navbar";
import RestaurantThumbnail from '../assets/restaurant.png';
import Promotion1 from '../assets/promotion1.png';
import Compass from '../assets/compass.png';
import Globe from '../assets/globe.png';
import Phone from '../assets/phone-call.png';
import Rating from "../components/shared/Rating";
import ReviewCard from "../components/ReviewCard";
import MapImg from '../assets/map.png';
import { useState } from "react";
import PreviewImagesModal from '../components/PreviewImagesModal';
import Restaurant1 from '../assets/restaurant1.png';
import FoodPic from '../assets/food1.png';
import PromotionsCard from '../components/PromotionsCard';

const MyRestaurant = () => {
    const [images , setImages] = useState(Array(4).fill(null)); //initializing array with 4 null elements
    const [openAllPhotos, setOpenAllPhotos] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);

    const handleOpenAllPics = () => setOpenAllPhotos(true);
    const handleCloseAllPics = () => setOpenAllPhotos(false); 
    const handleOpenMenu = () => setOpenMenu(true);
    const handleCloseMenu = () => setOpenMenu(false);
    const allPhotos = [Restaurant1, RestaurantThumbnail];
    const menuPhotos = [RestaurantThumbnail];
    const reviewPhotos = [FoodPic, RestaurantThumbnail];

    return ( 
        <>
        <Navbar />
        <div className="page">
            <div className="mx-auto">
                {/* Hero Section */}
                <div className="relative h-72">
                    <img src={RestaurantThumbnail} alt="Restaurant" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50"></div>
                    
                    {/* Content overlay */}
                    <div className="absolute bottom-0 left-0 p-6 text-white">
                        <h1 className="text-4xl font-bold mb-2">King of the Mambo | here let the owner reply to the reviews</h1>
                        
                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-2">
                            <Rating rating={3} />
                            <span className="text-sm ml-2">593 reviews</span>
                        </div>
                        
                        {/* Category and Hours */}
                        <div className="flex flex-col gap-1">
                            <p className="text-sm">Bakeries, Cafes, Coffee & Tea</p>
                            <p className="text-sm">
                                <span className="text-green-400">Open</span> 8:00 AM - 2:00 PM
                            </p>
                        </div>
                        
                        {/* Photos Link */}
                        <div className="absolute bottom-6 right-6">
                            <button className="text-white text-sm border p-2 rounded-md" onClick={handleOpenAllPics}>See all 55 photos</button>
                        </div>
                        <PreviewImagesModal 
                            open={openAllPhotos}
                            handleClose={handleCloseAllPics}
                            images={allPhotos}                            
                        />
                    </div>
                </div>            

                {/* Action Buttons */}
                <div className="flex gap-4 p-4 border-b">
                    <button className="bg-primary text-white px-6 py-2 rounded-md">Edit Restaurant</button>

                    <button className="border px-6 py-2 rounded-md flex items-center gap-2"  onClick={handleOpenMenu}>
                        View Menu
                    </button>
                    <PreviewImagesModal
                        open={openMenu}
                        handleClose={handleCloseMenu}
                        images={menuPhotos}
                    />                    
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-4 mt-12">
                    {/* Left Column */}
                    <div className="md:col-span-2 overflow-y-auto">

                        {/* Promotions Section */}
                        <div>
                            <div className="flex gap-5 mb-3">
                                <h2 className="text-xl font-semibold mb-4">Available Promotions</h2>
                                <button className="border border-primary text-primary px-2 py-1 rounded-md">Add Promotions</button>
                            </div>
                            
                            {/* Promotion Cards */}
                            <div className="space-y-4 md:w-3/4 h-80 overflow-y-scroll">                                
                                {Array(6).fill(0).map((_, index) => (
                                    <PromotionsCard 
                                        key={index}
                                        thumbnail={Promotion1}
                                        title="20% OFF"
                                        description="for all combank credit card users"
                                    />
                                ))}
                            </div>                            
                        </div>

                        {/* Reviews */}
                        <div className="space-y-8 mt-10 w-3/4">
                            {Array(3).fill(0).map((_, index) => (
                                <ReviewCard
                                    username='ishuwara'
                                    date='2024/02/20'
                                    rating={2}
                                    review='Lorem ipsum dolor sit amet consectetur. Interdum congue sit phasellus faucibus nisi eu. Lectus vitae aliquam vitae id sed sed tellus est.'
                                    helpful={5}
                                    likes={2}
                                    dislikes={1}
                                    images={reviewPhotos}
                                    key={index}
                                />                                
                            ))}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="md:col-span-1 h-fit sticky top-20">
                        {/* Contact Information */}
                        <div className="flex flex-col gap-y-10 border rounded-lg p-6">
                            <a href="tel:(415) 702-6096" className="flex items-center justify-between gap-4">
                                <span>(415) 702-6096</span>
                                <img src={Phone} alt="phone" className=" w-5"/>
                            </a>
                        
                            <a href="/" className="flex items-center justify-between gap-4 ">
                                <span className="text-blue-600">kingmambo.com</span>
                                <img src={Globe} alt="website" className="w-5"/>
                            </a>
                        
                            <a href="#directions" className="flex items-center justify-between gap-4 ">
                                <div>
                                    <p>Get Directions</p>
                                    <p className="text-sm text-gray-600">1722 Taraval St Colombo 07, Sri Lanka</p>
                                </div>
                                <img src={Compass} alt="location" className="w-5"/>
                            </a>                                                
                        </div>                                                                

                        {/* Location div */}
                        <div className="mt-10 border rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">Location</h2>
                            <div className="w-full overflow-hidden">
                                <img src={MapImg} alt="location" />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <Footer />
        </>
     );
}
 
export default MyRestaurant;