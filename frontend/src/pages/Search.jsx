import RestaurantCard from "../components/RestaurantCard";
import Footer from "../components/shared/Footer";
import Navbar from "../components/shared/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";

const Search = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('q');
    
    const [searchResults, setSearchResults] = useState([]);

    const fetchSearchResults = async () => {
        try {
            const { data } = await axiosInstance.get(`/restaurant/search?query=${searchQuery}`);
            console.log(data);
            setSearchResults(data);
        } catch (err) {
            console.log(err.message);
        }
    }

    useEffect(() => {
        fetchSearchResults();
    }, [searchQuery])

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

                    {/* <div className="mt-5">
                        <div className=" flex justify-between pr-10">
                            <p className="font-medium">Distance</p>
                            <button className="text-sm">clear</button>
                        </div>

                        <div className="mt-3">
                            <div className="flex gap-3 mb-1">
                                <input type="radio" id="distance1" name="distance" value="1"  className="hover:cursor-pointer"/>
                                <label htmlFor="distance1" className="hover:cursor-pointer">Bird's eye view</label>
                            </div>
                            <div className="flex gap-3 mb-1">
                                <input type="radio" id="distance2" name="distance" value="2"  className="hover:cursor-pointer"/>
                                <label htmlFor="distance2" className="hover:cursor-pointer">Driving (5 min)</label>
                            </div>
                            <div className="flex gap-3 mb-1">
                                <input type="radio" id="distance3" name="distance" value="3"  className="hover:cursor-pointer"/>
                                <label htmlFor="distance3" className="hover:cursor-pointer">Walking (1 min)</label>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <div className="w-3/4 border border-zinc-200 mt-5"></div>
                        </div>
                    </div> */}
                </div>

                <div className="col-span-2 md:col-span-3 mt-5">
                    <div className=" flex justify-between">
                        <p className=" text-2xl md:text-3xl font-medium">Search results for '{searchQuery}'</p>
                        <div>
                            <select name="sort" id="" className=" p-1 border border-zinc-400 rounded-lg">
                                <option value="">Sort by</option>
                                <option value="">Highest Rated</option>
                                <option value="">Highest reviews</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-10">
                        {searchResults.length > 0 ? searchResults.map((result, index) => (
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
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
     );
}
 
export default Search;