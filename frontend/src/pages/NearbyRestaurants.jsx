import { useState, useEffect } from 'react';
import { AdvancedMarker, APIProvider, Map } from '@vis.gl/react-google-maps';
import { axiosInstance } from '../lib/axios';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';

const NearbyRestaurants = () => {
    const [userPosition, setUserPosition] = useState(null);
    const [nearbyRestaurants, setNearbyRestaurants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [radius, setRadius] = useState(5); // Default radius in kilometers
    
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
                        center={userPosition || defaultPosition}
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