import Footer from "../components/shared/Footer";
import Navbar from "../components/shared/Navbar";
import RestaurantThumbnail from '../assets/restaurant.png';
import Promotion1 from '../assets/promotion1.png';
import Promotion2 from '../assets/promotion2.png';
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

const Restaurant = () => {
    const [images , setImages] = useState(Array(4).fill(null)); //initializing array with 4 null elements

    return ( 
        <>
        <Navbar />
        <div className="page">
            <div className="mx-auto">
                {/* Hero Section with Background Image */}
                <div className="relative h-72">
                    <img src={RestaurantThumbnail} alt="Restaurant" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50"></div>
                    
                    {/* Content overlay */}
                    <div className="absolute bottom-0 left-0 p-6 text-white">
                        <h1 className="text-4xl font-bold mb-2">King of the Mambo</h1>
                        
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
                            <button className="text-white text-sm">See all 55 photos</button>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 p-4 border-b">
                    <button className="bg-primary text-white px-6 py-2 rounded-md">View Menu</button>
                    <button className="border px-6 py-2 rounded-md flex items-center gap-2">
                        <img src={ShareIcon} alt="share" className="w-5"/> Share
                    </button>
                    <button className="border px-6 py-2 rounded-md flex items-center gap-2">
                        <img src={BookMark} alt="bookmark" className="w-5"/> Save
                    </button>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-4 mt-12">
                    {/* Promotions Section */}
                    <div className="md:col-span-2">
                        <h2 className="text-xl font-semibold mb-4">Available Promotions</h2>
                        
                        {/* Promotion Cards */}
                        <div className="space-y-4 md:w-3/4">
                            <div className="relative h-32 rounded-lg overflow-hidden">
                                <img src={Promotion1} alt="20% OFF" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 p-4 flex flex-col justify-center">
                                    <h3 className="text-white text-2xl font-bold">20% OFF</h3>
                                    <p className="text-white text-sm">for all combank credit users</p>
                                </div>
                            </div>
                            
                            <div className="relative h-32 rounded-lg overflow-hidden">
                                <img src={Promotion2} alt="BUY 1 GET 1 FREE" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 p-4 flex flex-col justify-center">
                                    <h3 className="text-white text-2xl font-bold">BUY 1 GET 1 FREE</h3>
                                    <p className="text-white text-sm">for all combank credit users</p>
                                </div>
                            </div>
                        </div>
                    </div>

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
                    
                        <div className="flex justify-center">
                            <button className=" bg-primary text-white p-3 rounded-lg w-full">
                                Chat with us
                            </button>                        
                        </div>
                    </div>

                    {/* Reviews */}
                    <div className="space-y-8 md:col-span-2 mt-10 w-3/4">
                        <ReviewCard
                            username='ishuwara'
                            date='2024/02/20'
                            rating={2}
                            review='Lorem ipsum dolor sit amet consectetur. Interdum congue sit phasellus faucibus nisi eu. Lectus vitae aliquam vitae id sed sed tellus est.'
                            helpful={5}
                            likes={2}
                            dislikes={1}
                        />
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

                    <div className=" hidden md:block md:col-span-2"></div>

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
        <Footer />
        </>
     );
}
 
export default Restaurant;