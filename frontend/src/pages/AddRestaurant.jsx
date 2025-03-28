import { useState } from 'react';
import Camera from "../assets/camera-icon.png";
import Navbar from '../components/shared/Navbar';
import { useAuthStore } from '../store/useAuthStore';
import Footer from '../components/shared/Footer';

const AddRestaurant = () => {  
    const { authUser } = useAuthStore();
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [websiteURL, setWebsiteURL] = useState('');
    
    const [categories, setCategories] = useState({
        'Sri Lankan Authentic': false,
        'Vegetarian': false,
        'HALAL Certified': false,
        'Fast Food': false,
        'Chinese': false,
        'Indian': false
    });

    // Open hours state
    const [openHours, setOpenHours] = useState({
        weekdays: { startTime: '', endTime: '' },
        saturday: { startTime: '', endTime: '' },
        sunday: { startTime: '', endTime: '' }
    });

    // Image upload states
    const [thumbnail, setThumbnail] = useState([]);
    const [menuImages, setMenuImages] = useState([]);
    const [additionalImages, setAdditionalImages] = useState([]);

    // Image upload handler (generic)
    const handleImageUpload = (setter, maxImages) => (event) => {
        const files = Array.from(event.target.files);
        const newImages = files.map(file => ({
        file,
        preview: URL.createObjectURL(file)
        }));

        setter(prevImages => [...prevImages, ...newImages].slice(0, maxImages));
    };

    // Remove image handler (generic)
    const removeImage = (setter) => (indexToRemove) => {
        setter(prevImages => 
        prevImages.filter((_, index) => index !== indexToRemove)
        );
    };

    // Category toggle handler
    const toggleCategory = (category) => {
        setCategories(prev => ({
        ...prev,
        [category]: !prev[category]
        }));
    };

    // Open hours change handler
    const handleOpenHoursChange = (day, field) => (e) => {
        setOpenHours(prev => ({
        ...prev,
        [day]: {
            ...prev[day],
            [field]: e.target.value
        }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Implement submission logic
        console.log({
        title,
        location,
        contactNumber,
        websiteURL,
        categories: Object.keys(categories).filter(cat => categories[cat]),
        openHours,
        thumbnail,
        menuImages,
        additionalImages
        });
    };

    return (
        <>
        <Navbar />
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-6 mt-20">
        <div className="grid grid-cols-2 gap-4">
            {/* Title */}
            <input 
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded p-2"
            />
            
            {/* Location */}
            <input 
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border rounded p-2"
            />
        </div>

        <div className="grid grid-cols-2 gap-4">
            {/* Contact Number */}
            <input 
            type="text"
            placeholder="Contact Number"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            className="border rounded p-2"
            />
            
            {/* Website URL */}
            <input 
            type="text"
            placeholder="Website URL"
            value={websiteURL}
            onChange={(e) => setWebsiteURL(e.target.value)}
            className="border rounded p-2"
            />
        </div>

        {/* Categories */}
        <div className="border rounded p-4">
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <div className="grid grid-cols-3 gap-2">
            {Object.keys(categories).map(category => (
                <label key={category} className="flex items-center space-x-2">
                <input 
                    type="checkbox"
                    checked={categories[category]}
                    onChange={() => toggleCategory(category)}
                    className="form-checkbox"
                />
                <span>{category}</span>
                </label>
            ))}
            </div>
        </div>

        {/* Open Hours */}
        <div className="border rounded p-4">
            <h3 className="text-lg font-semibold mb-4">Open Hours</h3>
            <div className="space-y-2">
            {[
                { label: 'Weekdays', key: 'weekdays' },
                { label: 'Saturday', key: 'saturday' },
                { label: 'Sunday', key: 'sunday' }
            ].map(({label, key}) => (
                <div key={key} className="flex items-center space-x-2">
                <span className="w-20">{label}</span>
                <input 
                    type="time"
                    value={openHours[key].startTime}
                    onChange={handleOpenHoursChange(key, 'startTime')}
                    className="border rounded p-1"
                />
                <span>-</span>
                <input 
                    type="time"
                    value={openHours[key].endTime}
                    onChange={handleOpenHoursChange(key, 'endTime')}
                    className="border rounded p-1"
                />
                </div>
            ))}
            </div>
        </div>

        {/* Thumbnail */}
        <div className="border rounded p-4">
            <h3 className="text-lg font-semibold mb-4">Thumbnail</h3>
            <div className="flex gap-2">
            {thumbnail.map((image, index) => (
                <div key={index} className="relative w-32 h-32">
                <img 
                    src={image.preview} 
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover rounded"
                />
                <button 
                    type="button"
                    onClick={() => removeImage(setThumbnail)(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                    ×
                </button>
                </div>
            ))}

            {thumbnail.length < 1 && (
                <label className="w-32 h-32 border-2 border-dashed rounded flex items-center justify-center cursor-pointer">
                <input 
                    type="file" 
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload(setThumbnail, 1)}
                />
                <img src={Camera} alt='camera' className='w-6 h-6'/>  
                </label>
            )}
            </div>
        </div>

        {/* Menu Images */}
        <div className="border rounded p-4">
            <h3 className="text-lg font-semibold mb-4">Menu Images</h3>
            <div className="flex gap-2">
            {menuImages.map((image, index) => (
                <div key={index} className="relative w-32 h-32">
                <img 
                    src={image.preview} 
                    alt={`Menu ${index + 1}`}
                    className="w-full h-full object-cover rounded"
                />
                <button 
                    type="button"
                    onClick={() => removeImage(setMenuImages)(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                    ×
                </button>
                </div>
            ))}

            {menuImages.length < 2 && (
                <label className="w-32 h-32 border-2 border-dashed rounded flex items-center justify-center cursor-pointer">
                <input 
                    type="file" 
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload(setMenuImages, 2)}
                />
                <img src={Camera} alt='camera' className='w-6 h-6'/>  
                </label>
            )}
            </div>
        </div>

        {/* Additional Images */}
        <div className="border rounded p-4">
            <h3 className="text-lg font-semibold mb-4">Additional Images</h3>
            <div className="flex gap-2">
            {additionalImages.map((image, index) => (
                <div key={index} className="relative w-32 h-32">
                <img 
                    src={image.preview} 
                    alt={`Additional ${index + 1}`}
                    className="w-full h-full object-cover rounded"
                />
                <button 
                    type="button"
                    onClick={() => removeImage(setAdditionalImages)(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                    ×
                </button>
                </div>
            ))}

            {additionalImages.length < 4 && (
                <label className="w-32 h-32 border-2 border-dashed rounded flex items-center justify-center cursor-pointer">
                <input 
                    type="file" 
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload(setAdditionalImages, 4)}
                />
                <img src={Camera} alt='camera' className='w-6 h-6'/>  
                </label>
            )}
            </div>
        </div>

        {/* Submit Button */}
        <div className="group relative w-full">            
            <button 
                onClick={(e) => handleSubmit(e)}
                className="w-full bg-primary text-white py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!authUser}
            >
                Add Restaurant
            </button>
            {!authUser && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 
                                bg-gray-800 text-white text-xs px-2 py-1 rounded 
                                opacity-0 group-hover:opacity-100 
                                transition-opacity duration-300 
                                pointer-events-none">
                You need to be logged in to add a restaurant
                </div>
            )}
        </div>
        </form>
        <Footer />
        </>
    );
};

export default AddRestaurant;