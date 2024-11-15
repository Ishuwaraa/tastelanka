import RestaurantImg from '../assets/restaurant2.png'
import FullRating from '../assets/full-rating.png'
import HalfRating from '../assets/half-rating.png'
import EmptyRating from '../assets/empty-rating.png'

const TrendingRestaurantCard = ({ restaurant, location, reviews, rating }) => {
    return ( 
        <div className=" card"> 
            <img src={RestaurantImg} alt={restaurant} className=" w-full h-48 object-cover" />
            <div className="m-4">
                <span className=" text-lg font-medium line-clamp-2 mb-1">{restaurant}</span>
                <span className="block text-gray-600 font-medium text-sm line-clamp-2">{location}</span>
            </div>
            <div className=" grid grid-cols-2 m-4">
                <div className=" flex items-center gap-1">
                    {[...Array(rating)].map((_, index) => (
                        <img src={FullRating} alt='1star' key={index}/>
                    ))}
                    {(5 - rating !== 0) && 
                        [...Array(5 - rating)].map((_, index) => (
                            <img src={EmptyRating} alt='1star' key={index}/>
                        ))
                    }                    
                    {/* <img src={HalfRating} alt='1star' /> */}
                </div>
                <div className=" text-sm font-medium">{reviews} reviews</div>
            </div>            
        </div> 
     );
}
 
export default TrendingRestaurantCard;