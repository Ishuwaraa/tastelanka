import Rating from './shared/Rating';

const RestaurantCard = ({ restaurant, reviewsCount, rating, categories, review, image }) => {
    return ( 
        <div className=" px-5 py-4 grid grid-cols-3 rounded-lg shadow-lg gap-5 h-52 mb-8">
            <div className=" col-span-1 flex justify-center">
                <img src={image} alt="" className='w-full h-40'/>
            </div>

            <div className="col col-span-2 ">
                <p className='font-medium text-lg line-clamp-1 mb-2'>{restaurant}</p>
                <div className='flex justify-between mb-2'>
                    <div className=" flex items-center gap-1">
                        <Rating rating={rating} />
                    </div>
                    <div className=" text-sm font-medium">{reviewsCount ? `${reviewsCount} reviews` : ""}</div>
                </div>
                <div className='flex gap-2 mb-4'>
                    {categories.map((category, index) => (
                        <div className='text-sm rounded-lg py-1 px-2 bg-zinc-200' key={index}>{category}</div>
                    ))}
                </div>
                <div>
                    <p className=' line-clamp-2'>{review ? `"${review}"` : "This restaurant doesn't have any reviews yet!"}</p>
                </div>
            </div>
        </div>
     );
}
 
export default RestaurantCard;