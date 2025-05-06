import Rating from './shared/Rating'

const TrendingRestaurantCard = ({ restaurant, location, reviews, rating, thumbnail }) => {
    return ( 
        <div className=" card h-96"> 
            <img src={thumbnail} alt={restaurant} className=" w-full h-48 object-cover" />
            <div className="m-4">
                <span className=" text-lg font-medium line-clamp-2 mb-1">{restaurant}</span>
                <span className="block text-gray-600 font-medium text-sm line-clamp-2">{location}</span>
            </div>
            <div className=" grid grid-cols-2 m-4">
                <div className=" flex items-center gap-1">
                    <Rating rating={rating} />                   
                    {/* <img src={HalfRating} alt='1star' /> */}
                </div>
                <div className=" text-sm font-medium">{reviews} reviews</div>
            </div>            
        </div> 
     );
}
 
export default TrendingRestaurantCard;