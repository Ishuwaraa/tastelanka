import RecommendationInput from "../components/RecommendationInput";
import RestaurantCard from "../components/RestaurantCard";
import Navbar from "../components/shared/Navbar";
import RestaurantImg from '../assets/restaurant2.png';
import Footer from "../components/shared/Footer";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { axiosInstance } from "../lib/axios";

const Recommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const location = useLocation();

    const fetchRecommendations = async (query) => {
        if (!query) return;
                
        try {
            console.log(query);
            const { data } = await axiosInstance.get(`restaurant/recommend?query=${encodeURIComponent(query)}`);
            console.log(data);
            setRecommendations(data);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
        }
    };

    //on initial load, check for query param and fetch data
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const query = searchParams.get('query');
        
        if (query) {
            fetchRecommendations(query);
        }
    }, [location.search]);

    //handle new searches from the input component
    const handleSearch = (query) => {
        fetchRecommendations(query);
    };

    return ( 
        <>
            <Navbar />
            <div className="page">
                <div className="section">
                    <RecommendationInput onSearch={handleSearch}/>
                </div>

                <div className="section">
                    <div className="">
                        <div className=" flex justify-between">
                            <p className=" text-2xl md:text-3xl font-medium">Here are the best spots we found for your taste!</p>
                            <div>
                                <select name="sort" id="" className=" p-1 border border-zinc-400 rounded-lg">
                                    <option value="">Sort by</option>
                                    <option value="">Highest Rated</option>
                                    <option value="">Highest reviews</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-10 md:w-3/4 lg:w-1/2 flex flex-col items-center mx-auto">
                            {recommendations.length > 0 ? recommendations.map((recommendation, index) => (
                                <a href={`/restaurant?id=${recommendation?.restaurant?._id}&f=false`} key={index}>
                                    <RestaurantCard
                                        restaurant={recommendation?.restaurant?.name}
                                        rating={recommendation?.restaurant?.rating}
                                        reviewsCount={recommendation?.review?.reviews?.length}
                                        categories={recommendation?.restaurant?.category}
                                        image={recommendation?.restaurant?.thumbnail}
                                        review={recommendation?.review?.reviews[0]?.review}
                                    />
                                </a>
                            )) : (
                                <p>We couldn't find any restaurants for your match!</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
     );
}
 
export default Recommendations;