import Footer from "../components/shared/Footer";
import Navbar from "../components/shared/Navbar";
import TrendingRestaurantCard from "../components/TrendingRestaurantCard";
import MapImg from '../assets/map.png';
import ArrowRight from '../assets/arrow-right.png';
import CategoryCard from "../components/CategoryCard";
import HeroImage from '../assets/hero.png';
import HeroImage1 from '../assets/hero1.png';
import RecommendationInput from "../components/RecommendationInput";
import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";


const categories = ['Sri Lankan Authentic', 'cat1', 'HALAL Certified', 'Fast Food', 'Chinese', 'Indian']

const Home = () => {
    const [topRestaurants, setTopRestaurants] = useState([]);

    const fetchTopRestaurats = async () => {
        try {
            const { data } = await axiosInstance.get('/restaurant');
            const sortedRestaurants = data?.restaurants.sort((a, b) => b.rating - a.rating);
            setTopRestaurants(sortedRestaurants);
        } catch (err) {
            console.log(err.message);
        }
    }

    useEffect(() => {
        fetchTopRestaurats();
    }, [])

    return ( 
        <>
            <Navbar />
                <div className="relative w-full h-[500px] mt-14"> {/* mt-14 to account for fixed navbar height */}
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0 bg-black/40"> {/* Dark overlay */}
                        <img src={HeroImage1} alt="Sri Lankan dining experience" className="w-full h-full object-cover"/>                        
                    </div>
                    
                    {/* Text Content */}
                    <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16">
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">Taste the Essence of Sri Lanka</h1>
                        <p className="text-xl md:text-2xl text-white">- Find, Review, and Savor Local Eats</p>
                    </div>
                </div>
            <div className="page">
                {/* <img src={HeroImage} alt="hero" /> */}

                <div className="section">
                    <div className="mb-8 flex justify-center">
                        <p className=" text-2xl md:text-3xl font-semibold">Describe your meal, and we'll find the perfect spot!</p>
                    </div>
                    <RecommendationInput />
                </div>

                <div className="section">
                    <div className="mb-8 flex justify-center">
                        <p className=" text-2xl md:text-3xl font-semibold">Trending Restaurants</p>
                    </div>
                    <div>
                        <div className="flex justify-center">
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                                {topRestaurants.length > 0 && topRestaurants.slice(0, 3).map((restaurant, index) => (
                                    <a href={`/restaurant?id=${restaurant._id}`} key={index}>
                                        <TrendingRestaurantCard
                                            restaurant={restaurant?.name}
                                            thumbnail={restaurant?.thumbnail}
                                            location={restaurant?.location}
                                            reviews={Math.floor(Math.random() * 10) + 1}
                                            rating={restaurant?.rating}
                                        />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>                

                <div className="section grid grid-cols-1 md:grid-cols-3 justify-between">
                    <div className="md:col-span-2 flex flex-col justify-center">
                        <p className=" text-2xl md:text-3xl font-semibold mb-2">Craving a Quick Bite?</p>
                        <p className=" text-xl md:text-lg font-medium text-gray-600 mb-4">Explore local favourites and uncover hidden gems nearby. Find the best Sri Lankan flovors just around the corner!</p>
                        <div className="btn2" role="button">
                            <p>Discover</p>
                            <img src={ArrowRight} alt="go" className="w-5" />
                        </div>
                    </div>
                    <div className="md:col-span-1 flex justify-end">
                        <img src={MapImg} alt="map" className=" w-80 h-60"/>
                    </div>
                </div>

                <div className="section">
                    <div className="mb-8 flex justify-center">
                        <p className=" text-2xl md:text-3xl font-semibold">Categories</p>
                    </div>
                    <div className="flex justify-center">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {Array(6).fill(0).map((_, index) => (
                                <a href={`/category?q=${categories[index]}`} key={index}>
                                    <CategoryCard category={categories[index]} image={index+1}/>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
     );
}
 
export default Home;