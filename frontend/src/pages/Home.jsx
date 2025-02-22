import Footer from "../components/shared/Footer";
import Navbar from "../components/shared/Navbar";
import TrendingRestaurantCard from "../components/TrendingRestaurantCard";
import MapImg from '../assets/map.png';
import ArrowRight from '../assets/arrow-right.png';
import CategoryCard from "../components/CategoryCard";
import HeroImage from '../assets/hero.png';
import RecommendationInput from "../components/RecommendationInput";


const categories = ['Sri Lankan Authentic', 'Vegetarian', 'HALAL Certified', 'Fast Food', 'Chinese', 'Indian']

const Home = () => {
    return ( 
        <>
            <Navbar />
            <div className="page">
                {/* <img src={HeroImage} alt="hero" /> */}
                <div className="section">
                    <div className="mb-8 flex justify-center">
                        <p className=" text-2xl md:text-3xl font-semibold">Trending Restaurants</p>
                    </div>
                    <div>
                        <div className="flex justify-center">
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                                {Array(3).fill(0).map((_, index) => (
                                    <a href={`/restaurant?id=${index}`} key={index}>
                                        <TrendingRestaurantCard
                                            restaurant='King of the Manmbo'
                                            location='Colombo 3'
                                            reviews={420}
                                            rating={Math.floor(Math.random() * 6)}
                                        />                                    
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="section">
                    <div className="mb-8 flex justify-center">
                        <p className=" text-2xl md:text-3xl font-semibold">Describe your meal, and we'll find the perfect spot!</p>
                    </div>
                    <RecommendationInput />
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
                                <CategoryCard key={index} category={categories[index]} image={index+1}/>
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