import { useState } from 'react';
import Camera from "../assets/camera-icon.png";
import Navbar from '../components/shared/Navbar';
import { useAuthStore } from '../store/useAuthStore';
import Footer from '../components/shared/Footer';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {AdvancedMarker, APIProvider, Map} from '@vis.gl/react-google-maps';

const AddRestaurant = () => {  
    const { authUser } = useAuthStore();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [websiteURL, setWebsiteURL] = useState('');
    const [lat, setLat] = useState(null);
    const [long, setLong] = useState(null);
    
    const [categories, setCategories] = useState({
        'Sri Lankan Authentic': false,
        'Vegetarian': false,
        'HALAL Certified': false,
        'Fast Food': false,
        'Chinese': false,
        'Indian': false
    });
    
    const [openHours, setOpenHours] = useState({
        weekdays: { startTime: '', endTime: '' },
        saturday: { startTime: '', endTime: '' },
        sunday: { startTime: '', endTime: '' }
    });
    
    const [thumbnail, setThumbnail] = useState([]);
    const [menuImages, setMenuImages] = useState([]);
    const [additionalImages, setAdditionalImages] = useState([]);
    
    const handleImageUpload = (setter, maxImages) => (event) => {
        const files = Array.from(event.target.files);
        const newImages = files.map(file => ({
        file,
        preview: URL.createObjectURL(file)
        }));

        setter(prevImages => [...prevImages, ...newImages].slice(0, maxImages));
    };
    
    const removeImage = (setter) => (indexToRemove) => {
        setter(prevImages => 
        prevImages.filter((_, index) => index !== indexToRemove)
        );
    };
    
    const toggleCategory = (category) => {
        setCategories(prev => ({
        ...prev,
        [category]: !prev[category]
        }));
    };
    
    const handleOpenHoursChange = (day, field) => (e) => {
        setOpenHours(prev => ({
        ...prev,
        [day]: {
            ...prev[day],
            [field]: e.target.value
        }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (title === '' || location === '' || contactNumber === '') {
            toast.error('Please add your restaurant name, location, and contact number')
            return;
        }else if(lat === null || long === null) {
            toast.error('Please add your location on the map');
            return;
        }

        const formData = new FormData();
        formData.append('name', title);
        formData.append('contact', contactNumber);
        formData.append('webUrl', websiteURL);
        formData.append('location', location);
        formData.append('latitude', lat);
        formData.append('longitude', long);
        Object.keys(categories).filter(cat => categories[cat]).forEach(category => formData.append('category[]', category));
        formData.append('openHours', JSON.stringify(openHours))

        if (thumbnail.length > 0) {
            formData.append('thumbnail', thumbnail[0].file);
        }
        menuImages.forEach((image) => {
            formData.append('menuPhotos', image.file);
        });
        additionalImages.forEach((image) => {
            formData.append('restaurantPhotos', image.file);
        });


        try {
            const { data } = await axiosInstance.post('restaurant/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            toast.success('Your restaurant added successfullly');
            setTitle('');
            setLocation('');
            setContactNumber('');
            setWebsiteURL('');
            setCategories({});
            setOpenHours({});
            setThumbnail([]);
            setMenuImages([]);
            setAdditionalImages([]);
            console.log(data);
            navigate('/profile');
        } catch (err) {
            console.log(err.message);
        }
    };

    //map variables    
    const [disableBtn, setDisableBtn] = useState(false);
    const defaultPosition = {lat: 6.884504262718018, lng: 79.91861383804526};    
    const [clickedPosition, setClickedPosition] = useState(null);

    const handleMapClick = (event) => {
        console.log('Map clicked', event);
        setClickedPosition(event.detail.latLng);
        const lat = event.detail.latLng.lat;
        const lng = event.detail.latLng.lng;
        setLat(lat);
        setLong(lng);
    }

    const handleLocateMe = (e) => {
        e.preventDefault();

        if(navigator.geolocation){
            setDisableBtn(true);
            navigator.geolocation.getCurrentPosition((position) => {
                const userPosition = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                setClickedPosition(userPosition);
                setLat(position.coords.latitude);
                setLong(position.coords.longitude);
                setTimeout(() => {
                    setDisableBtn(false);
                }, 5000);
            }, (error) => {
                setTimeout(() => {
                    setDisableBtn(false);
                }, 5000);
                if (error.code === error.PERMISSION_DENIED) {
                    alert('Location access is required to find your position. Please enable location access.');
                } else {
                    console.log('Error getting user location:', error);
                }
            });
        } else toast.error('Geo location not supported on this device');
    }

    return (
        <>
        <Navbar />
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-6 mt-20">
        <div className="grid grid-cols-2 gap-4">            
            <input type="text" placeholder="Title" value={title} required onChange={(e) => setTitle(e.target.value)} className="border rounded p-2"/>
                        
            <input type="text" placeholder="Location" value={location} required onChange={(e) => setLocation(e.target.value)} className="border rounded p-2"/>
        </div>

        <div className="grid grid-cols-2 gap-4">            
            <input type="text" placeholder="Contact Number" value={contactNumber} required onChange={(e) => setContactNumber(e.target.value)} className="border rounded p-2"/>
                        
            <input type="text" placeholder="Website URL" value={websiteURL} onChange={(e) => setWebsiteURL(e.target.value)} className="border rounded p-2"/>
        </div>
        
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
                    multiple
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

        <div className="border rounded p-4">
            <div className="flex justify-between">
                <h3 className="text-lg font-semibold mb-4">Pin Your Restaurant Location</h3>
                <button 
                    className='border border-primary text-primary px-2 rounded'  
                    disabled = {disableBtn? true : false}
                    onClick={(e) => handleLocateMe(e)}
                >{disableBtn? 'locating...' : 'Locate Me'}</button>
            </div>
            <div className='mt-3 w-full h-96'>
                <APIProvider apiKey={import.meta.env.VITE_MAP_KEY}>
                    <Map defaultCenter={defaultPosition} defaultZoom={10} mapId={import.meta.env.VITE_MAP_ID} onClick={handleMapClick}>
                        {clickedPosition && <AdvancedMarker position={clickedPosition} />}
                    </Map>
                </APIProvider>
            </div>
        </div>
        
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