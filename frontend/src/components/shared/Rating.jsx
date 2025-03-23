import FullRating from '../../assets/full-rating.png';
import HalfRating from '../../assets/half-rating.png';
import EmptyRating from '../../assets/empty-rating.png';

const Rating = ({ rating = 0 }) => {
    return ( 
        <>
            {[...Array(Math.max(0, rating))].map((_, index) => (
                <img src={FullRating} alt="star" key={`full-${index}`} />
            ))}
            {[...Array(Math.max(0, 5 - rating))].map((_, index) => (
                <img src={EmptyRating} alt="star" key={`empty-${index}`} />
            ))}
        </>
    );
};

 
export default Rating;