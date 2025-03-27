import { useState } from 'react';
import { Modal } from '@mui/material';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';

const PromotionModal = ({ open, handleClose, restaurantId }) => {
    const [promotionTitle, setPromotionTitle] = useState('');
    const [promotionDescription, setPromotionDescription] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [file, setFile] = useState();

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setFile(file);
        if (file) {
            //local URL for the image
            const localImageUrl = URL.createObjectURL(file);
            setImagePreview(localImageUrl);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();        

        if (file) {
            try {
                const formData = new FormData();
                formData.append('title', promotionTitle);
                formData.append('description', promotionDescription);
                formData.append('file', file);

                const { data } = await axiosInstance.post(`restaurant/promotions/${restaurantId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log(data);

                setPromotionTitle('');
                setPromotionDescription('');
                setFile(null);
                toast.success("Promotion added!")
                window.location.reload();
            } catch (err) {
                console.log(err.message);
            }
            handleClose();
        } else {
            toast.error("Thumbnail is required");
        }
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            className="flex items-center justify-center"
        >
            <div className="bg-white w-[500px] p-6 rounded-lg shadow-xl">
                <h2 className="text-xl font-bold mb-6 text-gray-800">Add Promotion</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="promotionTitle" className="block text-gray-700 mb-2">Promotion Title</label>
                        <input 
                            id="promotionTitle"
                            type="text" 
                            value={promotionTitle}
                            onChange={(e) => setPromotionTitle(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="Enter promotion title"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="promotionDescription" className="block text-gray-700 mb-2">Promotion Description</label>
                        <textarea 
                            id="promotionDescription"
                            value={promotionDescription}
                            onChange={(e) => setPromotionDescription(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                            placeholder="Enter promotion description"
                            rows="3"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="promotionThumbnail" className="block text-gray-700 mb-2">Promotion Thumbnail</label>
                        <input 
                            type="file" 
                            id="promotionThumbnail"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                        <label 
                            htmlFor="promotionThumbnail" 
                            className={`
                                w-full h-48 border-2 border-dashed rounded-md flex items-center 
                                justify-center cursor-pointer transition-colors
                                ${imagePreview 
                                    ? 'border-transparent' 
                                    : 'border-gray-300 hover:border-red-500'
                                }
                            `}
                        >
                            {imagePreview && file ? (
                                <img src={imagePreview} alt="Promotion" className="w-full h-full object-cover rounded-md"/>
                            ) : (
                                <div className="text-gray-400 flex flex-col items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                                        />
                                    </svg>
                                    <span>Click to upload image</span>
                                </div>
                            )}
                        </label>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button type="button" onClick={handleClose}className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-red-700">
                            Add
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default PromotionModal;