import { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleMap, useLoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { useToast } from '../context/ToastContext';
import './Map.css';

const libraries = ['places'];

// Map container style
const mapContainerStyle = {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1
};

export default function Map() {
    const toast = useToast();
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
        libraries,
    });

    const [userLocation, setUserLocation] = useState(null);
    const [loadingLocation, setLoadingLocation] = useState(true);
    const [facilities, setFacilities] = useState([]);
    const [searching, setSearching] = useState(false);
    const [selectedFacility, setSelectedFacility] = useState(null);

    const mapRef = useRef(null);

    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
        if (userLocation) {
            fetchNearbyFacilities(userLocation.lat, userLocation.lng, map);
        }
    }, [userLocation]);

    // Get user location
    useEffect(() => {
        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by your browser');
            setLoadingLocation(false);
            return;
        }

        let isMounted = true;

        navigator.geolocation.getCurrentPosition(
            (position) => {
                if (!isMounted) return;
                const { latitude, longitude } = position.coords;
                const loc = { lat: latitude, lng: longitude };
                setUserLocation(loc);
                setLoadingLocation(false);
                if (mapRef.current) {
                    fetchNearbyFacilities(latitude, longitude, mapRef.current);
                }
            },
            (error) => {
                if (!isMounted) return;
                console.error('Geolocation error:', error);
                toast.error('Unable to retrieve your location');
                setLoadingLocation(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );

        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchNearbyFacilities = (lat, lng, mapInstance) => {
        if (!mapInstance || !window.google) return;
        setSearching(true);

        const service = new window.google.maps.places.PlacesService(mapInstance);
        const request = {
            location: new window.google.maps.LatLng(lat, lng),
            radius: '5000',
            // Using keyword to capture multiple facility types
            keyword: 'hospital OR clinic OR pharmacy OR doctor OR dentist OR medical center'
        };

        service.nearbySearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
                setFacilities(results);
            } else if (status !== window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
                console.error('Places API error:', status);
                toast.error('Failed to find nearby facilities');
            }
            setSearching(false);
        });
    };

    const getFacilityColor = (types) => {
        if (!types) return '#10b981'; // default clinic color
        if (types.includes('hospital')) return '#ef4444';
        if (types.includes('pharmacy')) return '#8b5cf6';
        return '#10b981'; // clinic/doctor default
    };

    const getFacilityIcon = (types) => {
        return {
            path: window.google ? window.google.maps.SymbolPath.CIRCLE : 0,
            fillColor: getFacilityColor(types),
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#ffffff',
            scale: 8
        };
    };

    const userIcon = {
        path: window.google ? window.google.maps.SymbolPath.CIRCLE : 0,
        fillColor: '#3b82f6',
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: '#ffffff',
        scale: 10
    };

    if (loadError) return <div className="map-error">Error loading Maps</div>;
    
    if (loadingLocation || !isLoaded) {
        return (
            <div className="loading-screen">
                <div className="spinner" />
                <p className="text-muted">{!isLoaded ? 'Loading Maps...' : 'Locating you...'}</p>
            </div>
        );
    }

    // Determine specific types for display if available
    const getDisplayType = (facility) => {
        if (!facility.types || facility.types.length === 0) return 'Medical Facility';
        let mainType = facility.types.find(t => ['hospital', 'pharmacy', 'doctor', 'dentist'].includes(t)) || facility.types[0];
        return mainType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <div className="map-page">
            <div className="map-header glass-card">
                <div className="map-header__info">
                    <h1 className="heading-3">Nearby Care</h1>
                    <p className="text-sm text-muted">Showing hospitals, clinics and pharmacies within 5km</p>
                </div>
                <div className="flex gap-2">
                    {searching && <div className="map-searching-indicator">Searching...</div>}
                    {!userLocation && (
                        <button 
                            className="btn btn--sm btn--primary" 
                            onClick={() => window.location.reload()}
                        >
                            Retry
                        </button>
                    )}
                </div>
            </div>

            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={14}
                center={userLocation || { lat: 0, lng: 0 }}
                options={{
                    disableDefaultUI: true,
                    zoomControl: true,
                }}
                onLoad={onMapLoad}
            >
                {userLocation && (
                    <MarkerF 
                        position={userLocation} 
                        icon={userIcon}
                        onClick={() => setSelectedFacility({ name: 'You are here', isUser: true, geometry: { location: { lat: () => userLocation.lat, lng: () => userLocation.lng } } })}
                    />
                )}

                {facilities.map((facility) => (
                    <MarkerF
                        key={facility.place_id}
                        position={{
                            lat: facility.geometry.location.lat(),
                            lng: facility.geometry.location.lng()
                        }}
                        icon={getFacilityIcon(facility.types)}
                        onClick={() => setSelectedFacility(facility)}
                    />
                ))}

                {selectedFacility && (
                    <InfoWindowF
                        position={{
                            lat: selectedFacility.geometry.location.lat(),
                            lng: selectedFacility.geometry.location.lng()
                        }}
                        onCloseClick={() => setSelectedFacility(null)}
                    >
                        <div className="map-popup-content">
                            <strong>{selectedFacility.name}</strong>
                            {!selectedFacility.isUser && (
                                <>
                                    <br/>
                                    <span>{getDisplayType(selectedFacility)}</span>
                                    {selectedFacility.vicinity && (
                                        <>
                                            <br/>
                                            <span className="text-xs text-muted">{selectedFacility.vicinity}</span>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </InfoWindowF>
                )}
            </GoogleMap>

            <div className="map-legend glass-card">
                <div className="legend-item"><span className="dot dot--hospital"></span> Hospital</div>
                <div className="legend-item"><span className="dot dot--pharmacy"></span> Pharmacy</div>
                <div className="legend-item"><span className="dot dot--clinic"></span> Clinic</div>
            </div>
            
            {/* Warning if API key is missing */}
            {!import.meta.env.VITE_GOOGLE_MAPS_API_KEY && (
                <div className="api-key-warning">
                    Google Maps API Key is missing. Map will run in development mode or fail to load. Please set VITE_GOOGLE_MAPS_API_KEY in frontend/.env
                </div>
            )}
        </div>
    );
}
