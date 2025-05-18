import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/shared/Footer";
import Navbar from "../components/shared/Navbar";
import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import RestaurantCard from "../components/RestaurantCard";
import RestaurantCardSkeleton from "../components/shared/RestaurantCardSkeleton";

const Category = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('q');
    
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sortBy, setSortBy] = useState("default");
    const [sortedResults, setSortedResults] = useState([]);

    const fetchSearchResults = async () => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get(`/restaurant/search/category?query=${searchQuery}`);
            console.log(data);
            setSearchResults(data);
            setSortedResults(data);
        } catch (err) {
            console.log(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSearchResults();
    }, [searchQuery])

    useEffect(() => {
        if (searchResults.length === 0) return;
        
        let sorted = [...searchResults];
        
        switch(sortBy) {
            case "rate":
                // Sort by highest rating
                sorted.sort((a, b) => {
                    const ratingA = a.restaurant?.rating || 0;
                    const ratingB = b.restaurant?.rating || 0;
                    return ratingB - ratingA; // Descending order
                });
                break;
            case "review":
                // Sort by highest review count
                sorted.sort((a, b) => {
                    const reviewCountA = a.review?.reviews?.length || 0;
                    const reviewCountB = b.review?.reviews?.length || 0;
                    return reviewCountB - reviewCountA; // Descending order
                });
                break;
            default:
                // Default sorting - keep original order
                sorted = [...searchResults];
        }
        
        setSortedResults(sorted);
    }, [sortBy, searchResults]);

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    return ( 
        <>
        <Navbar />
        <div className="page grid grid-cols-3 md:grid-cols-4 gap-10">
            <div className=" col-span-1 border-r-2 border-zinc-200 mt-5">
                <p className="font-semibold text-lg">Filters</p>

                <div className="mt-5">
                    <div className=" flex justify-between pr-10">
                        <p className="font-medium">Price</p>
                        <button className="text-sm">clear</button>
                    </div>

                    <div className="mt-3">
                        <div className="flex gap-3 mb-1">
                            <input type="radio" id="price1" name="price" value="1"  className="hover:cursor-pointer"/>
                            <label htmlFor="price1" className="hover:cursor-pointer">Rs. 1000 - Rs. 2000</label>
                        </div>
                        <div className="flex gap-3 mb-1">
                            <input type="radio" id="price2" name="price" value="2"  className="hover:cursor-pointer"/>
                            <label htmlFor="price2" className="hover:cursor-pointer">Rs. 2000 - Rs. 5000</label>
                        </div>
                        <div className="flex gap-3 mb-1">
                            <input type="radio" id="price3" name="price" value="3"  className="hover:cursor-pointer"/>
                            <label htmlFor="price3" className="hover:cursor-pointer">Rs. 5000 and above</label>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <div className="w-3/4 border border-zinc-200 mt-5"></div>
                    </div>
                </div>                
            </div>

            <div className="col-span-2 md:col-span-3 mt-5">
                <div className=" flex justify-between">
                    <p className=" text-2xl md:text-3xl font-medium">Search results for '{searchQuery}'</p>
                    <div>
                        <select name="sort" value={sortBy} onChange={handleSortChange} className=" p-1 border border-zinc-400 rounded-lg">
                            <option value="default">Sort by</option>
                            <option value="rate">Highest Rated</option>
                            <option value="review">Highest reviews</option>
                        </select>
                    </div>
                </div>

                <div className="mt-10">
                    {loading ? (
                        Array(3).fill(0).map((_, index) => (
                            <RestaurantCardSkeleton key={index}/>
                        ))
                    ) : (
                        sortedResults.length > 0 ? sortedResults.map((result, index) => (
                            <a href={`/restaurant?id=${result?.restaurant?._id}&f=false`} key={index}>
                                <RestaurantCard
                                    restaurant={result?.restaurant?.name}
                                    rating={result?.restaurant?.rating}
                                    reviewsCount={result?.review?.reviews?.length}
                                    categories={result?.restaurant?.category}
                                    image={result?.restaurant?.thumbnail}
                                    review={result?.review?.reviews[0]?.review}
                                />
                            </a>
                        )) : (
                            <p>We couldn't find any restaurants for your match!</p>
                        )
                    )}
                </div>
            </div>
        </div>
        <Footer />
        </>
     );
}
 
export default Category;