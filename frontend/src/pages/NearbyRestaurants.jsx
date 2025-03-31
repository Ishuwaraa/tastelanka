import { useState, useEffect } from 'react';
import { AdvancedMarker, APIProvider, Map, InfoWindow } from '@vis.gl/react-google-maps';
import { axiosInstance } from '../lib/axios';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';

const NearbyRestaurants = () => {
    const [userPosition, setUserPosition] = useState(null);
    const [nearbyRestaurants, setNearbyRestaurants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [radius, setRadius] = useState(5); // Default radius in kilometers
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    
    const defaultPosition = {lat: 6.884504262718018, lng: 79.91861383804526}
        
    const getUserLocation = () => {
        setLoading(true);
        setError(null);
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userPos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setUserPosition(userPos);
                    fetchNearbyRestaurants(userPos.lat, userPos.lng);
                },
                (error) => {
                    setLoading(false);
                    if (error.code === error.PERMISSION_DENIED) {
                        setError('Location access is required to find nearby restaurants. Please enable location access.');
                    } else {
                        setError(`Error getting your location: ${error.message}`);
                    }
                    console.error('Error getting user location:', error);
                }
            );
        } else {
            setLoading(false);
            setError('Geolocation is not supported by your browser or device.');
        }
    };
        
    const fetchNearbyRestaurants = async (latitude, longitude) => {
        console.log(latitude, longitude);
        try {
            const { data } = await axiosInstance.get('restaurant/nearby', {
                params: {
                    latitude,
                    longitude,
                    radius
                }
            });

            setNearbyRestaurants(data);
            setLoading(false);
            console.log(data);
        } catch (err) {            
            setLoading(false);
            console.error('Error fetching nearby restaurants:', err.message);
        }
    };
    
    // Handle radius change
    const handleRadiusChange = (e) => {
        const value = parseInt(e.target.value);
        setRadius(value);
        if (userPosition) {
            fetchNearbyRestaurants(userPosition.lat, userPosition.lng);
        }
    };
    
    return (
        <>
        <Navbar />
        <div className="page">
            <div className="">
                <h2>Find Restaurants Near You</h2>
                
                <div className="">
                    <div className="r">
                        <label htmlFor="radius">Search radius (km): </label>
                        <select 
                            id="radius" 
                            value={radius} 
                            onChange={handleRadiusChange}
                            disabled={loading}
                        >
                            <option value="1">1 km</option>
                            <option value="2">2 km</option>
                            <option value="5">5 km</option>
                            <option value="10">10 km</option>
                            <option value="20">20 km</option>
                        </select>
                    </div>
                    
                    <button 
                        onClick={getUserLocation} 
                        disabled={loading}
                    >
                        {loading ? 'Finding Restaurants...' : 'Find Restaurants Near Me'}
                    </button>
                </div>
                
                {error && <div className="">{error}</div>}
                
                <div className="">
                    {!loading && nearbyRestaurants.length > 0 && (
                        <p>Found {nearbyRestaurants.length} restaurants within {radius} km</p>
                    )}
                </div>
            </div>
            
            <div style={{ height: '500px', width: '100%' }}>
                <APIProvider apiKey={import.meta.env.VITE_MAP_KEY}>
                    <Map 
                        defaultCenter={defaultPosition} 
                        defaultZoom={12} 
                        mapId={import.meta.env.VITE_MAP_ID}
                        // center={userPosition || defaultPosition} //has a fixed position cuz of this
                    >
                        {/* User's position marker */}
                        {userPosition && (
                            <AdvancedMarker 
                                position={userPosition}
                                title="Your Location"
                            >
                                <div style={{ 
                                    width: '20px', 
                                    height: '20px', 
                                    background: '#4285F4', 
                                    borderRadius: '50%',
                                    border: '2px solid white'
                                }}></div>
                            </AdvancedMarker>
                        )}
                        
                        {/* Restaurant markers */}
                        {nearbyRestaurants.map((result) => (
                            <AdvancedMarker
                                key={result?.restaurant?._id}
                                position={{ lat: result?.restaurant?.latitude, lng: result?.restaurant?.longitude }}
                                title={result?.restaurant?.name}
                                onClick={() => setSelectedRestaurant(result?.restaurant)}
                            >
                                <div style={{ 
                                    width: '15px', 
                                    height: '15px', 
                                    background: '#DB4437', 
                                    borderRadius: '50%',
                                    border: '2px solid white'
                                }}></div>
                            </AdvancedMarker>
                        ))}

                        {selectedRestaurant && (
                            <InfoWindow
                                position={{ 
                                    lat: selectedRestaurant.latitude, 
                                    lng: selectedRestaurant.longitude 
                                }}
                                onCloseClick={() => setSelectedRestaurant(null)}
                            >
                                <div className="p-3 max-w-xs rounded-lg shadow-md bg-white">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-bold text-lg text-gray-800 truncate">{selectedRestaurant?.name}</h3>
                                        <div className="flex items-center text-amber-500">
                                            <span className="mr-1">{selectedRestaurant?.rating}</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-3 mb-3">
                                        <img 
                                            src={selectedRestaurant?.thumbnail} 
                                            alt={selectedRestaurant?.name} 
                                            className="w-20 h-20 object-cover rounded-md"
                                        />
                                        <div className="flex-1 text-sm text-gray-600">
                                            <p className="mb-1">{selectedRestaurant?.location}</p>
                                        </div>
                                    </div>
                                    
                                    <a href={`/restaurant?id=${selectedRestaurant?._id}`}
                                        className="block w-full py-2 px-4 bg-primary hover:bg-red-700 text-white text-center font-medium rounded-md transition duration-200"
                                    >
                                        View Details
                                    </a>
                                </div>
                            </InfoWindow>
                            )}
                    </Map>
                </APIProvider>
            </div>
            
            {/* List of nearby restaurants */}
            <div>
                {loading ? (
                    <p>Loading nearby restaurants...</p>
                ) : nearbyRestaurants.length > 0 ? (
                    <ul>
                        {nearbyRestaurants.map((result) => (
                            <li key={result?.restaurant?._id}>
                                <h3>{result?.restaurant?.name}</h3>
                            </li>
                        ))}
                    </ul>
                ) : userPosition && !error ? (
                    <p>No restaurants found within {radius} km of your location.</p>
                ) : null}
            </div>
        </div>
        <Footer />
        </>
    );
};

export default NearbyRestaurants;