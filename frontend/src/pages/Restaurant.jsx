import React, { useEffect } from 'react';
import Footer from "../components/shared/Footer";
import Navbar from "../components/shared/Navbar";
import BookMark from '../assets/bookmark.png';
import BookMarkFilled from "../assets/bookmark-filled.png";
import Compass from '../assets/compass.png';
import Globe from '../assets/globe.png';
import Phone from '../assets/phone-call.png';
import ShareIcon from '../assets/share.png';
import Rating from "../components/shared/Rating";
import ReviewCard from "../components/ReviewCard";
import { useState } from "react";
import PreviewImagesModal from '../components/PreviewImagesModal';
import PromotionsCard from '../components/PromotionsCard';
import ChatWidget from '../components/ChatWidget';
import { useLocation } from 'react-router-dom';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from '../store/useAuthStore';
import ReviewForm from '../components/ReviewForm';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import toast from 'react-hot-toast';

const Restaurant = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const restaurantId = searchParams.get('id');
    const isFav = searchParams.get('f');
    const { authUser } = useAuthStore();
    
    const [openAllPhotos, setOpenAllPhotos] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);

    const handleOpenAllPics = () => setOpenAllPhotos(true);
    const handleCloseAllPics = () => setOpenAllPhotos(false); 
    const handleOpenMenu = () => setOpenMenu(true);
    const handleCloseMenu = () => setOpenMenu(false);    

    const [restaurantDetails, setRestaurantDetails] = useState({});
    const [reviews, setReviews] = useState([]);
    const [allPhotos, setAllPhotos] = useState([]);
    const [lat, setLat] = useState(null);
    const [long, setLong] = useState(null);
    const position = (lat === null || long === null) ? {lat: 6.884504262718018, lng: 79.91861383804526} : {lat: lat, lng: long};

    const fetchRestaurantDetails = async () => {
        try {
            const { data } = await axiosInstance.get(`restaurant/${restaurantId}`);
            const reviewRes = await axiosInstance.get(`review/${restaurantId}`);
            console.log(data);
            console.log(reviewRes.data);
            setRestaurantDetails(data);
            setReviews(reviewRes.data?.reviews);
            setLat(data?.latitude);
            setLong(data?.longitude);

            const menuImages = data?.menu || [];
            const restaurantImages = data?.images || [];
            const reviewImages = reviewRes.data?.reviews?.flatMap(review => review.images || []) || [];
            const allImages = [...restaurantImages, ...menuImages, ...reviewImages];
            setAllPhotos(allImages);
        } catch (err) {
            console.log(err.message);
        }
    }

    const toggleUserFav = async () => {
        try {
            if (isFav === 'false') {
                await axiosInstance.post('user/add-fav', { restaurantId });
                toast.success('Added to favourites');
            } else if (isFav === 'true') {
                await axiosInstance.post('user/remove-fav', { restaurantId });                
                toast.success('Removed from favourites');
            }

            const url = new URL(window.location.href);
            url.searchParams.set('f', isFav === 'true' ? 'false' : 'true');

            window.history.replaceState({}, '', url);
        } catch (err) {
            console.log(err.message);
        }        
    }

    const getFormattedTime = (time) => {
        if (!time) return "";
        const [hours, minutes] = time.split(":").map(Number);
        const period = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 || 12; // Convert 24-hour format to 12-hour format
        return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
    };

    const getTodaysHours = (openHours) => {
        if (!openHours) return null;
    
        const daysMap = ["sunday", "weekdays", "weekdays", "weekdays", "weekdays", "weekdays", "saturday"];
        const today = new Date().getDay(); // 0 = Sunday, 6 = Saturday
        return openHours[daysMap[today]];
    };
    
    const todayHours = getTodaysHours(restaurantDetails?.openHours);

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
                            <p className="text-sm">
                                {restaurantDetails?.category?.length > 0 && restaurantDetails.category.map((category, index) => (
                                    <span key={index}>{category} &nbsp;&nbsp;</span>
                                ))}
                            </p>
                            <p className="text-sm">                                
                                {todayHours ? (
                                    <>
                                        <span className="text-green-400">Open</span> {getFormattedTime(todayHours.startTime)} - {getFormattedTime(todayHours.endTime)}
                                    </>
                                ) : (
                                    <span className="text-red-400">Closed</span>
                                )}
                            </p>
                        </div>                                                
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 p-4 border-b">
                    <button className="bg-primary text-white px-6 py-2 rounded-md" onClick={handleOpenMenu} disabled={!restaurantDetails?.menu?.length}>View Menu</button>
                    {(restaurantDetails && restaurantDetails?.menu?.length > 0) && (
                        <PreviewImagesModal
                            open={openMenu}
                            handleClose={handleCloseMenu}
                            images={restaurantDetails?.menu?.length > 0 ? restaurantDetails?.menu : []}
                        />
                    )}

                    <button className="border px-6 py-2 rounded-md flex items-center gap-2" onClick={handleOpenAllPics} disabled={!allPhotos.length}>
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
                    <div className="group relative">
                        <button className="border px-6 py-2 rounded-md flex items-center gap-2" onClick={toggleUserFav} disabled={!authUser}>
                            <img src={(isFav === 'true') ? BookMarkFilled : BookMark} alt="bookmark" className="w-5"/> Save
                        </button>
                        {!authUser && (
                            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 
                                            bg-gray-800 text-white text-xs px-2 py-1 rounded 
                                            opacity-0 group-hover:opacity-100 
                                            transition-opacity duration-300 
                                            pointer-events-none">
                            You need to be logged in
                            </div>
                        )}
                    </div>
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
                                <div className="space-y-4 md:w-3/4 max-h-80 overflow-y-auto">
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
                                        restaurantId={restaurantDetails?._id}
                                        reviewId={review?._id}
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
                            <ReviewForm restaurantId={restaurantDetails._id} setReviews={setReviews} />
                        </div>                        

                        {/* <div className=" hidden md:block md:col-span-2"></div> */}

                        {/* Location div */}
                        <div className="mt-10 border rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">Location</h2>
                            <div className="w-full h-96 overflow-hidden">
                            <APIProvider apiKey={import.meta.env.VITE_MAP_KEY}>
                                <Map defaultCenter={position} defaultZoom={12} mapId={import.meta.env.VITE_MAP_ID} center={position}>
                                    <AdvancedMarker position={position} />
                                </Map>
                            </APIProvider>
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