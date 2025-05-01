import Heart from '../assets/heart.png';
import HelpFul from '../assets/helpful.png';
import ThumbsDown from '../assets/thumbs-down.png';
import DummyPic from "../assets/dummy.jpg";
import Rating from './shared/Rating';
import PreviewImagesModal from './PreviewImagesModal';
import { useState } from 'react';
import { axiosInstance } from '../lib/axios';

const ReviewCard = ({ restaurantId, reviewId, restaurantName, username, profilePic, date, rating, review, images, helpful, likes, dislikes, ownerReply}) => {
    const [openReviewPhotos, setOpenReviewPhotos] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [reviewStats, setReviewStats] = useState({
        helpfulCount: helpful || 0,
        likesCount: likes || 0,
        dislikesCount: dislikes || 0
    });

    const handleOpenReviewPics = () => setOpenReviewPhotos(true);
    const handleCloseReviewPics = () => setOpenReviewPhotos(false);

    const updateReviewRating = async (type) => {
        if (isUpdating) return;
        setIsUpdating(true);
        
        try {            
            const updateData = {};
            
            switch(type) {
                case 'helpful':
                    updateData.helpful = reviewStats.helpfulCount + 1;
                    updateData.likes = reviewStats.likesCount;
                    updateData.dislikes = reviewStats.dislikesCount;
                    break;
                case 'like':
                    updateData.likes = reviewStats.likesCount + 1;
                    updateData.helpful = reviewStats.helpfulCount;
                    updateData.dislikes = reviewStats.dislikesCount;
                    break;
                case 'dislike':
                    updateData.dislikes = reviewStats.dislikesCount + 1;
                    updateData.helpful = reviewStats.helpfulCount;
                    updateData.likes = reviewStats.likesCount;
                    break;
                default:
                    break;
            }
                        
            const { data } = await axiosInstance.patch(`/review/${restaurantId}/rating/${reviewId}`, updateData);
            console.log(data);
            
            const updatedReview = data.reviews?.find(rev => rev._id === reviewId);
            
            if (updatedReview) {
                setReviewStats({
                    helpfulCount: updatedReview?.helpful || 0,
                    likesCount: updatedReview?.likes || 0,
                    dislikesCount: updatedReview?.dislikes || 0
                });                                
            }
        } catch (err) {
            console.log(err.message);
        } finally {
            setIsUpdating(false);
        }
    };

    return (         
        <div className="border-b pb-6">
            <div className="flex items-center gap-3 mb-4">
                <img src={profilePic ? profilePic : DummyPic} alt="profile pic" className="w-12 h-12 rounded-full"/>
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
                <button 
                    className="flex flex-col items-center gap-2 text-gray-500 rounded-full"
                    onClick={() => updateReviewRating('helpful')}
                    disabled={isUpdating}
                >
                    <img src={HelpFul} alt="helpful" className="rounded-full border border-gray-700 p-2 w-8"/>
                    Helpful {reviewStats.helpfulCount}
                </button>
                <button 
                    className="flex flex-col items-center gap-2 text-gray-500"
                    onClick={() => updateReviewRating('like')}
                    disabled={isUpdating}
                >
                    <img src={Heart} alt="heart"  className="rounded-full border border-gray-700 p-2 w-8"/>
                    Like this {reviewStats.likesCount}
                </button>
                <button 
                    className="flex flex-col items-center gap-2 text-gray-500"
                    onClick={() => updateReviewRating('dislike')}
                    disabled={isUpdating}
                >
                    <img src={ThumbsDown} alt="thumbs down"  className="rounded-full border border-gray-700 p-2 w-8"/>
                    Dislike {reviewStats.dislikesCount}
                </button>
            </div>            

            {/* Owner Reply */}
            {ownerReply && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold ">{restaurantName}</span>
                        <span className="text-sm text-gray-500">Replied</span>
                    </div>
                    <p className="text-gray-700">{ownerReply}</p>
                </div>
            )}
        </div>        
     );
}
 
export default ReviewCard;