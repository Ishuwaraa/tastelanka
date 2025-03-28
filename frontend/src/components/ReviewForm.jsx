import React, { useState } from 'react';
import Camera from "../assets/camera-icon.png";
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

const ReviewForm = ({ restaurantId, setReviews }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [images, setImages] = useState([]);
  const { authUser } = useAuthStore();

  const handleStarHover = (currentRating) => {
    setHoverRating(currentRating);
  };

  const handleStarClick = (currentRating) => {
    setRating(currentRating);
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    //limit to 3 images
    setImages(prevImages => [...prevImages, ...newImages].slice(0, 4));
  };

  const removeImage = (indexToRemove) => {
    setImages(prevImages => 
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (review !== '') {
        try {
            const formData = new FormData();
            formData.append('rating', rating !== '' ? rating : 1);
            formData.append('review', review);    
    
            images.forEach((image) => {
                formData.append('reviewImages', image.file);
            });
    
            const { data } = await axiosInstance.post(`review/${restaurantId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(data);
            setReviews(data?.reviews);
            setRating(0);
            setReview('');
            setImages([]);
            toast.success('Review added successfully!');
        } catch (err) {
            console.log(err.message);
        }
    } else {
        toast.error("Review is required!")
    }
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Star Rating */}
      <div className="flex mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleStarHover(star)}
            onMouseLeave={() => setHoverRating(0)}
            className={`w-8 h-8 cursor-pointer transition-colors duration-200 
              ${star <= (hoverRating || rating) 
                ? 'text-yellow-500' 
                : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
        ))}
      </div>
    
      <textarea 
        placeholder="Your review here"
        className="w-full border rounded p-2 mb-4 min-h-[100px] resize-none"
        onChange={(e) => setReview(e.target.value)}
        value={review}
        required
      />

      {/* Image Upload */}
      <div className="flex gap-2 mb-4">
        {/* Existing Images */}
        {images.map((image, index) => (
          <div key={index} className="relative w-20 h-20">
            <img 
              src={image.preview} 
              alt={`Preview ${index + 1}`}
              className="w-full h-full object-cover rounded"
            />
            <button 
              onClick={() => removeImage(index)}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
            >
              ×
            </button>
          </div>
        ))}

        {/* Upload Button */}
        {images.length < 4 && (
          <label className="w-20 h-20 border-2 border-dashed rounded flex items-center justify-center cursor-pointer">
            <input 
              type="file" 
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
            />
            <img src={Camera} alt='camera' className='w-6 h-6'/>        
          </label>
        )}
      </div>
            
      <div className="group relative w-full">
        <button 
            className="w-full bg-primary text-white py-2 rounded transition-colors 
                    disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={(e) => handleReviewSubmit(e)}
            disabled={!authUser}
        >
            Add your review
        </button>
        {!authUser && (
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 
                            bg-gray-800 text-white text-xs px-2 py-1 rounded 
                            opacity-0 group-hover:opacity-100 
                            transition-opacity duration-300 
                            pointer-events-none">
            You need to be logged in to add a review
            </div>
        )}
      </div>
    </div>
  );
};

export default ReviewForm;