import Heart from '../assets/heart.png';
import HelpFul from '../assets/helpful.png';
import ThumbsDown from '../assets/thumbs-down.png';
import ProfilePic from '../assets/profilepic.png';
import Rating from './shared/Rating';
import PreviewImagesModal from './PreviewImagesModal';
import { useState } from 'react';

const ReviewCard = ({ username, profilepic, date, rating, review, images, helpful, likes, dislikes}) => {
    const [openReviewPhotos, setOpenReviewPhotos] = useState(false);    

    const handleOpenReviewPics = () => setOpenReviewPhotos(true);
    const handleCloseReviewPics = () => setOpenReviewPhotos(false); 

    return (         
        <div className="border-b pb-6">
            <div className="flex items-center gap-3 mb-4">
                <img src={ProfilePic} alt="profile pic" className="w-12 h-12 rounded-full"/>
                <div>
                    <h3 className="font-semibold">{username}</h3>
                    <p className="text-sm text-gray-500">{date}</p>
                </div>
            </div>

            {/* Rating Stars */}
            <div className="flex gap-1 mb-3">
                <Rating rating={rating} />
            </div>

            {/* Review Text */}
            <p className="text-gray-700 mb-4">{review}</p>

            {/* Review Images */}
            <div className="flex gap-2">
                {images.map((image, index) => (
                    <img src={image} key={index} alt="Review" className="w-20 h-20 object-cover rounded-lg" onClick={handleOpenReviewPics}/>
                ))}
                {/* <img src={FoodPic} alt="Review" className="w-20 h-20 object-cover rounded-lg" onClick={handleOpenReviewPics}/> */}
            </div>
            <PreviewImagesModal 
                open={openReviewPhotos}
                handleClose={handleCloseReviewPics}
                images={images}
            />

            {/* Review Actions */}
            <div className="flex gap-6 mt-4">
                <button className="flex flex-col items-center gap-2 text-gray-500 rounded-full">
                    <img src={HelpFul} alt="helpful" className="rounded-full border border-gray-700 p-2 w-8"/>
                    Helpful {helpful}
                </button>
                <button className="flex flex-col items-center gap-2 text-gray-500">
                    <img src={Heart} alt="heart"  className="rounded-full border border-gray-700 p-2 w-8"/>
                    Like this {likes}
                </button>
                <button className="flex flex-col items-center gap-2 text-gray-500">
                    <img src={ThumbsDown} alt="thumbs down"  className="rounded-full border border-gray-700 p-2 w-8"/>
                    Dislike {dislikes}
                </button>
            </div>
        </div>        
     );
}
 
export default ReviewCard;