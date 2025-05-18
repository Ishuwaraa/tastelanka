import { useEffect, useState } from 'react';
import Camera from "../assets/camera-icon.png";
import Navbar from '../components/shared/Navbar';
import { useAuthStore } from '../store/useAuthStore';
import Footer from '../components/shared/Footer';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {AdvancedMarker, APIProvider, Map} from '@vis.gl/react-google-maps';

const EditRestaurant = () => {
    const { authUser } = useAuthStore();
    const navigate = useNavigate();

    const [restaurantId, setRestaurantId] = useState('');
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [websiteURL, setWebsiteURL] = useState('');
    const [lat, setLat] = useState(null);
    const [long, setLong] = useState(null);
    const position = (lat === null || long === null) ? {lat: 6.884504262718018, lng: 79.91861383804526} : {lat: lat, lng: long};
    
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

    const handleSubmit = async (e, action) => {
        e.preventDefault();
        if (action === 'update') {
            if (title === '' || location === '' || contactNumber === '') {
                toast.error('Please add your restaurant name, location, and contact number')
                return;
            }else if(lat === null || long === null) {
                toast.error('Please add your location on the map');
                return;
            }

            const selectedCategories = Object.keys(categories).filter(cat => categories[cat]);

            const updateData = {
                name: title,
                contact: contactNumber,
                location: location,
                webUrl: websiteURL || "",
                lat: clickedPosition ? lat : position?.lat,
                long: clickedPosition ? long : position?.lng,
                category: selectedCategories 
            };

            try {
                const { data } = await axiosInstance.patch(`restaurant/edit/${restaurantId}`, updateData)
                toast.success('Your restaurant updated successfullly');
                console.log('update', data);
            } catch (err) {
                console.log(err.message);
            }

        } else if (action === 'cancel') {
            navigate('/profile/restaurant', { replace: true })
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

    const fetchRestaurantData = async () => {
        try {
            const { data } = await axiosInstance.get('user/restaurant')
            console.log(data?.restaurant);
            setRestaurantId(data?.restaurant?._id);
            setTitle(data?.restaurant?.name);
            setLocation(data?.restaurant?.location);
            setContactNumber(data?.restaurant?.contact);
            setWebsiteURL(data?.restaurant?.webUrl);
            setMenuImages(data?.restaurant?.menu);
            setThumbnail(data?.restaurant?.thumbnail);
            setAdditionalImages(data?.restaurant?.images);
            
            // setRestaurantDetails(data?.restaurant);
            setLat(data?.restaurant?.latitude);
            setLong(data?.restaurant?.longitude);

            // Update categories based on fetched data
        if (data?.restaurant?.category && Array.isArray(data.restaurant.category)) {
            const updatedCategories = { ...categories };
            
            // First, set all categories to false
            Object.keys(updatedCategories).forEach(cat => {
                updatedCategories[cat] = false;
            });
            
            // Then set the ones from the database to true
            data.restaurant.category.forEach(cat => {
                if (updatedCategories.hasOwnProperty(cat)) {
                    updatedCategories[cat] = true;
                }
            });
            
            setCategories(updatedCategories);
        }
        } catch (err) {
            console.log(err.message);
        }
    }

    useEffect(() => {
        fetchRestaurantData();
    }, []);

    return ( 
        <>
        <Navbar />
        <form className="max-w-2xl mx-auto p-6 space-y-6 mt-20">
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
            {/* <div className="border rounded p-4">
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
            </div> */}
    
            {/* Thumbnail */}
            {thumbnail.length > 0 && (
            <div className="border rounded p-4">
                <h3 className="text-lg font-semibold mb-4">Thumbnail</h3>
                <div className="flex gap-2">
                    <div className="relative w-32 h-32">
                        <img src={thumbnail} className="w-full h-full object-cover rounded"/>
                    </div>                
                </div>
            </div>
            )}
    
            {/* Menu Images */}
            {menuImages.length > 0 && (
            <div className="border rounded p-4">
                <h3 className="text-lg font-semibold mb-4">Menu Images</h3>
                <div className="flex gap-2">
                    {menuImages.map((image, index) => (
                        <div key={index} className="relative w-32 h-32">
                            <img src={image} alt={`Menu ${index + 1}`} className="w-full h-full object-cover rounded"/>
                        </div>
                    ))}                
                </div>
            </div>
            )}
    
            {/* Additional Images */}
            {additionalImages.length > 0 && (
            <div className="border rounded p-4">
                <h3 className="text-lg font-semibold mb-4">Additional Images</h3>
                <div className="flex gap-2">
                    {additionalImages.map((image, index) => (
                        <div key={index} className="relative w-32 h-32">
                            <img src={image} alt={`Additional ${index + 1}`} className="w-full h-full object-cover rounded"/>
                        </div>
                    ))}
                </div>
            </div>
            )}
    
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
                        <Map defaultCenter={position} defaultZoom={12} mapId={import.meta.env.VITE_MAP_ID} onClick={handleMapClick}>
                            {clickedPosition ? (
                                <AdvancedMarker position={clickedPosition} />
                            ) : (
                                <AdvancedMarker position={position} />
                            )}
                        </Map>
                    </APIProvider>
                </div>
            </div>
            
            <div className="flex justify-between gap-20">            
                <button 
                    onClick={(e) => handleSubmit(e, 'cancel')}
                    className="w-full text-primary border border-primary py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"                    
                >
                    Cancel
                </button>
                <button 
                    onClick={(e) => handleSubmit(e, 'update')}
                    className="w-full bg-primary text-white py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"                    
                >
                    Update
                </button>
            </div>
        </form>
        <Footer />
        </>
    );
}
 
export default EditRestaurant;