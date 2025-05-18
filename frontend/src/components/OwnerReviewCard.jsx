import Heart from '../assets/heart.png';
import HelpFul from '../assets/helpful.png';
import ThumbsDown from '../assets/thumbs-down.png';
import DummyPic from "../assets/dummy.jpg";
import Rating from './shared/Rating';
import PreviewImagesModal from './PreviewImagesModal';
import { useState } from 'react';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

const OwnerReviewCard = ({ restaurantName, restaurantId, reviewId, username, profilePic, date, rating, review, images, helpful, likes, dislikes, ownerReply}) => {
    const [openReviewPhotos, setOpenReviewPhotos] = useState(false);
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [ownerReplyText, setOwnerReplyText] = useState(ownerReply || '');
    const [newOwnerReply, setNewOwnerReply] = useState('');

    const handleOpenReviewPics = () => setOpenReviewPhotos(true);
    const handleCloseReviewPics = () => setOpenReviewPhotos(false); 

    const handleReplyClick = () => {
        setShowReplyForm(true);
    };

    const handleSubmitReply = async (e) => {
        e.preventDefault();

        if (newOwnerReply.trim()) {
            try {
                const { data } = await axiosInstance.post(`review/${restaurantId}/reply/${reviewId}`, { reply: newOwnerReply });
                console.log(data);
                setOwnerReplyText(newOwnerReply);
                setShowReplyForm(false);
                setNewOwnerReply('');
                toast.success('Reply added!')
            } catch (err) {
                console.log(err.message);
            }
        }
    };

    const handleCancelReply = () => {
        setShowReplyForm(false);
        setNewOwnerReply('');
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
                <button className="flex flex-col items-center gap-2 text-gray-500 rounded-full" disabled>
                    <img src={HelpFul} alt="helpful" className="rounded-full border border-gray-700 p-2 w-8"/>
                    Helpful {helpful}
                </button>
                <button className="flex flex-col items-center gap-2 text-gray-500" disabled>
                    <img src={Heart} alt="heart"  className="rounded-full border border-gray-700 p-2 w-8"/>
                    Like this {likes}
                </button>
                <button className="flex flex-col items-center gap-2 text-gray-500" disabled>
                    <img src={ThumbsDown} alt="thumbs down"  className="rounded-full border border-gray-700 p-2 w-8"/>
                    Dislike {dislikes}
                </button>
                <button onClick={handleReplyClick} className="ml-auto text-primary font-semibold">
                    {ownerReply ? "Edit reply" : "Reply"}
                </button>
            </div>

            {/* Reply Form */}
            {showReplyForm && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <textarea 
                        placeholder="Write your response to this review..."
                        value={newOwnerReply}
                        onChange={(e) => setNewOwnerReply(e.target.value)}
                        className="w-full mb-3 resize-none p-3"
                        rows={4}
                    />
                    <div className="flex justify-end gap-3">
                        <button onClick={handleCancelReply}>Cancel</button>
                        <button onClick={handleSubmitReply} disabled={!newOwnerReply.trim()}>Reply</button>                        
                    </div>
                </div>
            )}

            {/* Owner Reply */}
            {ownerReplyText && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold ">Your reply</span>
                        {/* <span className="text-sm text-gray-500">Replied</span> */}
                    </div>
                    <p className="text-gray-700">{ownerReplyText}</p>
                </div>
            )}
        </div>        
     );
}
 
export default OwnerReviewCard;