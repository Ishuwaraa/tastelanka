import React, { useEffect } from 'react';
import Footer from "../components/shared/Footer";
import Navbar from "../components/shared/Navbar";
import RestaurantThumbnail from '../assets/restaurant.png';
import BookMark from '../assets/bookmark.png';
import Compass from '../assets/compass.png';
import Globe from '../assets/globe.png';
import Phone from '../assets/phone-call.png';
import ShareIcon from '../assets/share.png';
import Rating from "../components/shared/Rating";
import PlusIcon from '../assets/plus.png';
import ReviewCard from "../components/ReviewCard";
import MapImg from '../assets/map.png';
import { useState } from "react";
import PreviewImagesModal from '../components/PreviewImagesModal';
import PromotionsCard from '../components/PromotionsCard';
import ChatWidget from '../components/ChatWidget';
import { useLocation } from 'react-router-dom';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from '../store/useAuthStore';

const Restaurant = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const restaurantId = searchParams.get('id');
    const { authUser } = useAuthStore();

    const [images , setImages] = useState(Array(4).fill(null)); //initializing array with 4 null elements
    const [openAllPhotos, setOpenAllPhotos] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);

    const handleOpenAllPics = () => setOpenAllPhotos(true);
    const handleCloseAllPics = () => setOpenAllPhotos(false); 
    const handleOpenMenu = () => setOpenMenu(true);
    const handleCloseMenu = () => setOpenMenu(false);    

    const [restaurantDetails, setRestaurantDetails] = useState({});
    const [reviews, setReviews] = useState([]);
    const [allPhotos, setAllPhotos] = useState([]);

    const fetchRestaurantDetails = async () => {
        try {
            const { data } = await axiosInstance.get(`restaurant/${restaurantId}`);
            const reviewRes = await axiosInstance.get(`review/${restaurantId}`);
            console.log(data);
            console.log(reviewRes.data);
            setRestaurantDetails(data);
            setReviews(reviewRes.data?.reviews);

            const menuImages = data?.menu || [];
            const restaurantImages = data?.images || [];
            const reviewImages = reviewRes.data?.reviews?.flatMap(review => review.images || []) || [];
            const allImages = [...restaurantImages, ...menuImages, ...reviewImages];
            setAllPhotos(allImages);
        } catch (err) {
            console.log(err.message);
        }
    }

    useEffect(() => {
        fetchRestaurantDetails();
    }, []);

    return ( 
        <>
        <Navbar />
        {authUser ? (
            <ChatWidget 
                restaurantName={restaurantDetails ? restaurantDetails?.name : "loading..."} 
                ownerId={restaurantDetails ? restaurantDetails?.owner : null}
                profilePic={restaurantDetails?.thumbnail}
            />
        ) : (
            <div className="fixed bottom-4 right-4 z-50">                        
                <button onClick={() => window.location.href = '/login'} className="bg-primary text-white py-2 px-4 rounded-md shadow-lg">
                    Chat with us 
                </button>
            </div>
        )}
        <div className="page">
            <div className="mx-auto">
                {/* Hero Section */}
                <div className="relative h-72">
                    <img src={restaurantDetails?.thumbnail} alt="Restaurant" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50"></div>
                    
                    {/* Content overlay */}
                    <div className="absolute bottom-0 left-0 p-6 text-white">
                        <h1 className="text-4xl font-bold mb-2">{restaurantDetails?.name}</h1>
                        
                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-2">
                            <Rating rating={restaurantDetails?.rating} />
                            <span className="text-sm ml-2">{reviews?.length > 0 ? `${reviews.length} reviews` : 'No reviews yet'}</span>
                        </div>
                        
                        {/* Category and Hours */}
                        <div className="flex flex-col gap-1">
                            <p className="text-sm">Bakeries, Cafes, Coffee & Tea</p>
                            <p className="text-sm">
                                <span className="text-green-400">Open</span> 8:00 AM - 2:00 PM
                            </p>
                        </div>
                        
                        {/* Photos Link */}
                        {/* <div className="absolute bottom-6 right-6">
                            <button className="text-white text-sm border p-2 rounded-md" onClick={handleOpenAllPics}>See all 55 photos</button>
                        </div>
                        <PreviewImagesModal 
                            open={openAllPhotos}
                            handleClose={handleCloseAllPics}
                            images={allPhotos}
                        /> */}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 p-4 border-b">
                    <button className="bg-primary text-white px-6 py-2 rounded-md" onClick={handleOpenMenu}>View Menu</button>
                    {(restaurantDetails && restaurantDetails?.menu?.length > 0) && (
                        <PreviewImagesModal
                            open={openMenu}
                            handleClose={handleCloseMenu}
                            images={restaurantDetails?.menu?.length > 0 ? restaurantDetails?.menu : []}
                        />
                    )}

                    <button className="border px-6 py-2 rounded-md flex items-center gap-2" onClick={handleOpenAllPics}>
                        View all photos
                    </button>
                    {allPhotos.length > 0 && (
                        <PreviewImagesModal 
                            open={openAllPhotos}
                            handleClose={handleCloseAllPics}
                            images={allPhotos}
                        />
                    )}

                    <button className="border px-6 py-2 rounded-md flex items-center gap-2">
                        <img src={ShareIcon} alt="share" className="w-5"/> Share
                    </button>
                    <button className="border px-6 py-2 rounded-md flex items-center gap-2">
                        <img src={BookMark} alt="bookmark" className="w-5"/> Save
                    </button>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-4 mt-12">
                    {/* Left Column */}
                    <div className="md:col-span-2 overflow-y-auto">

                        {/* Promotions Section */}
                        {restaurantDetails?.promotions?.length > 0 &&
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Available Promotions</h2>
                                
                                {/* Promotion Cards */}                            
                                <div className="space-y-4 md:w-3/4 h-80 overflow-y-scroll">
                                    {restaurantDetails?.promotions?.map((promotion) => (
                                        <PromotionsCard 
                                            editable={false}
                                            key={promotion._id}
                                            thumbnail={promotion?.thumbnail}
                                            title={promotion?.title}
                                            description={promotion?.description}
                                        />
                                    ))}
                                </div>
                            </div>
                        }

                        {/* Reviews */}
                        <div className="space-y-8 mt-10 w-3/4">
                            {reviews?.length > 0 ? reviews.map((review) => {
                                const date = review.createdAt;
                                const formatted = new Date(date);

                                return (
                                    <ReviewCard
                                        restaurantName={restaurantDetails?.name}
                                        username={review?.user?.name}
                                        profilePic={review?.user?.profilePic}
                                        date={formatted.toLocaleDateString()}
                                        rating={review?.rating}
                                        review={review?.review}
                                        helpful={review?.helpful}
                                        likes={review?.likes}
                                        dislikes={review?.dislikes}
                                        images={review?.images}
                                        key={review._id}
                                        ownerReply={review?.reply}
                                    />
                            )}) : <p>No reviews yet. Be the first by sharing your experience with us</p>}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="md:col-span-1 h-fit sticky top-20">
                        {/* Contact Information */}
                        <div className="flex flex-col gap-y-10 border rounded-lg p-6">
                            <a href="tel:(415) 702-6096" className="flex items-center justify-between gap-4">
                                <span>{restaurantDetails?.contact}</span>
                                <img src={Phone} alt="phone" className=" w-5"/>
                            </a>
                        
                            {restaurantDetails?.webUrl &&
                                <a href="/" className="flex items-center justify-between gap-4 ">
                                    <span className="text-blue-600">{restaurantDetails?.webUrl}</span>
                                    <img src={Globe} alt="website" className="w-5"/>
                                </a>
                            }
                        
                            <a href="#directions" className="flex items-center justify-between gap-4 ">
                                <div>
                                    <p>Get Directions</p>
                                    <p className="text-sm text-gray-600">{restaurantDetails?.location}</p>
                                </div>
                                <img src={Compass} alt="location" className="w-5"/>
                            </a>
                        
                            {/* <div className="flex justify-center">
                                <button className=" bg-primary text-white p-3 rounded-lg w-full">
                                    Chat with us
                                </button>                        
                            </div> */}
                        </div>
                    
                        {/* Add Review Form */}
                        <div className="mt-10 border rounded-lg p-6">
                            <div className="flex gap-1 mb-4">
                                <Rating rating={2} />
                            </div>

                            <textarea placeholder="Your review here" className="w-full h-32 p-3 border rounded-lg mb-4 resize-none"/>

                            <div className="mb-4">
                                <p className="mb-2">Add your images</p>
                                <div className="flex gap-4">
                                    {images.map((image, index) => (
                                        <div key={index} className="relative w-16 h-16 border rounded-lg bg-gray-200 bg-opacity-30">
                                            {image && <img src={image} alt="" className="w-full h-full rounded-xl object-fill" />}
                                            <div className=" absolute inset-0 flex items-center justify-center">
                                                {!image && (
                                                    <>
                                                    <input
                                                        type="file"
                                                        accept=".png, .jpg, .jpeg"
                                                        name={`photo${index + 1}`}
                                                        // ref={el => fileInputRefs.current[index] = el}
                                                        // onChange={(e) => handleChange(e, index)}
                                                        className="hidden"
                                                    />
                                                    <img src={PlusIcon} alt="add image" 
                                                        // onClick={() => handleIconClick(index)} 
                                                        className=" text-primary hover:cursor-pointer"/>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))} 
                                </div>
                            </div>

                            <button className="w-full bg-primary text-white py-3 rounded-lg">
                                Add your review
                            </button>
                        </div>

                        {/* <div className=" hidden md:block md:col-span-2"></div> */}

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
 
export default Restaurant;