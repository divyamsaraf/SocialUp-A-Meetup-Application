import React, { createContext, useState, useEffect, useContext } from 'react';

const LocationContext = createContext(null);

const STORAGE_KEY = 'socialup_selected_location_v1';
const DEFAULT_LOCATION = {
  city: 'Seattle',
  state: 'WA',
  zipCode: null,
  lat: 47.6062,
  lng: -122.3321,
  label: 'Seattle, WA',
};

// Reverse geocode coordinates to city/ZIP using Nominatim
const reverseGeocode = async (lat, lng) => {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
    const response = await fetch(url, {
      headers: {
        'Accept-Language': 'en',
        'User-Agent': 'SocialUp/1.0',
      },
    });
    const data = await response.json();
    
    const city =
      data?.address?.city ||
      data?.address?.town ||
      data?.address?.village ||
      data?.address?.municipality ||
      data?.address?.county;
    const state = data?.address?.state || data?.address?.region;
    const zipCode = data?.address?.postcode;
    
    return {
      city: city || null,
      state: state || null,
      zipCode: zipCode || null,
      lat,
      lng,
      label: city && state ? `${city}, ${state}` : city || zipCode || 'your area',
    };
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
    return {
      city: null,
      state: null,
      zipCode: null,
      lat,
      lng,
      label: 'your area',
    };
  }
};

export const LocationProvider = ({ children }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [geolocationError, setGeolocationError] = useState(null);

  // Load saved location from localStorage on mount
  useEffect(() => {
    const initLocation = async () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setSelectedLocation(parsed);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error('Failed to load location from storage:', error);
      }

      // If no stored location, try geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const location = await reverseGeocode(latitude, longitude);
            setSelectedLocation(location);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
            setLoading(false);
          },
          (error) => {
            // Geolocation denied or failed, use default
            console.log('Geolocation not available:', error.message);
            setGeolocationError(error.message);
            setSelectedLocation(DEFAULT_LOCATION);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_LOCATION));
            setLoading(false);
          },
          {
            enableHighAccuracy: false,
            timeout: 8000,
            maximumAge: 600000, // 10 minutes
          }
        );
      } else {
        // Geolocation not supported, use default
        setSelectedLocation(DEFAULT_LOCATION);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_LOCATION));
        setLoading(false);
      }
    };

    initLocation();
  }, []);

  // Update location and persist to localStorage
  const updateLocation = (location) => {
    const locationToSet = location || DEFAULT_LOCATION;
    setSelectedLocation(locationToSet);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(locationToSet));
  };

  // Request geolocation
  const requestGeolocation = () => {
    if (!navigator.geolocation) {
      setGeolocationError('Geolocation is not supported by your browser');
      return Promise.reject(new Error('Geolocation not supported'));
    }

    setLoading(true);
    setGeolocationError(null);

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const location = await reverseGeocode(latitude, longitude);
          updateLocation(location);
          setLoading(false);
          resolve(location);
        },
        (error) => {
          setGeolocationError(error.message);
          setLoading(false);
          reject(error);
        },
        {
          enableHighAccuracy: false,
          timeout: 8000,
          maximumAge: 0, // Always get fresh location
        }
      );
    });
  };

  // Clear location (resets to default)
  const clearLocation = () => {
    updateLocation(DEFAULT_LOCATION);
  };

  const value = {
    selectedLocation,
    loading,
    geolocationError,
    updateLocation,
    requestGeolocation,
    clearLocation,
  };

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
