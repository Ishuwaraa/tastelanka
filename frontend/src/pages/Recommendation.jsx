import RecommendationInput from "../components/RecommendationInput";
import RestaurantCard from "../components/RestaurantCard";
import Navbar from "../components/shared/Navbar";
import RestaurantImg from '../assets/restaurant2.png';
import Footer from "../components/shared/Footer";

const Recommendations = () => {
    return ( 
        <>
            <Navbar />
            <div className="page">
                <div className="section">
                    <RecommendationInput />
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

                        <div className="mt-10 md:mx-28">
                            {Array(4).fill(0).map((_, index) => (
                                <a href={`/restaurant?id=${index}`} key={index}>
                                    <RestaurantCard
                                        restaurant='King of the Mambo'
                                        rating={Math.floor(Math.random() * 6)}
                                        reviewsCount={420}
                                        categories={['Sea Food', 'Wine Bars', 'Indian']}
                                        image={RestaurantImg}
                                        review='Lorem ipsum dolor sit amet consectetur adipisicing elit. A itaque incidunt nulla dolor dignissimos provident debitis mollitia eius cumque consectetur!'
                                    />
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
 
export default Recommendations;