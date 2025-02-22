import FullRating from '../../assets/full-rating.png';
import HalfRating from '../../assets/half-rating.png';
import EmptyRating from '../../assets/empty-rating.png';

const Rating = ({rating}) => {
    return ( 
        <>
        {[...Array(rating)].map((_, index) => (
            <img src={FullRating} alt='star' key={index}/>
        ))}
        {(5 - rating !== 0) && 
            [...Array(5 - rating)].map((_, index) => (
                <img src={EmptyRating} alt='star' key={index}/>
            ))
        }  
        </>
     );
}
 
export default Rating;