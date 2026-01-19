import api from '../services/api';

// Fetch location suggestions from Nominatim
export const fetchNominatimSuggestions = async (query, limit = 8, useBackendFallback = true) => {
  if (!query.trim()) return [];

  const trimmedQuery = query.trim();
  
  try {
    // Check if query is a ZIP code (5 digits)
    const isZipQuery = /^\d{5}(-\d{4})?$/.test(trimmedQuery);
    
    let url;
    if (isZipQuery) {
      // Search by postal code
      url = `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(trimmedQuery)}&format=jsonv2&limit=${limit}&addressdetails=1&countrycodes=us`;
    } else {
      // Use general search (q=) instead of city= for better partial matching
      // This allows searching for partial city names and returns more relevant results
      url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(trimmedQuery)}&format=jsonv2&limit=${limit * 2}&addressdetails=1&countrycodes=us&featuretype=city`;
    }

    const response = await fetch(url, {
      headers: {
        'Accept-Language': 'en',
        'User-Agent': 'SocialUp/1.0',
      },
    });

    if (!response.ok) {
      console.error('Nominatim API error:', response.status, response.statusText);
      // Try backend fallback if enabled
      if (useBackendFallback) {
        return await fetchBackendSuggestions(trimmedQuery, limit);
      }
      return [];
    }

    const data = await response.json();
    
    if (!Array.isArray(data) || data.length === 0) {
      // Try backend fallback if no results
      if (useBackendFallback) {
        return await fetchBackendSuggestions(trimmedQuery, limit);
      }
      return [];
    }
    
    // Transform Nominatim results to our format
    // Filter to only include results with city information
    const suggestions = data
      .map((item) => {
        const addr = item.address || {};
        const city = addr.city || addr.town || addr.village || addr.municipality || addr.county || addr.suburb;
        const state = addr.state || addr.region;
        const zipCode = addr.postcode;
        
        // Skip if no city information
        if (!city && !zipCode) return null;

        return {
          city: city || null,
          state: state || null,
          zipCode: zipCode || null,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          displayName: item.display_name,
          label: zipCode && city && state 
            ? `${zipCode} — ${city}, ${state}`
            : city && state
            ? `${city}, ${state}`
            : city || zipCode || 'Unknown',
        };
      })
      .filter(Boolean)
      // Remove duplicates based on city+state combination
      .filter((item, index, self) => 
        index === self.findIndex((t) => 
          t.city === item.city && t.state === item.state
        )
      )
      .slice(0, limit);

    return suggestions.length > 0 ? suggestions : (useBackendFallback ? await fetchBackendSuggestions(trimmedQuery, limit) : []);
  } catch (error) {
    console.error('Failed to fetch location suggestions:', error);
    // Try backend fallback on error
    if (useBackendFallback) {
      try {
        return await fetchBackendSuggestions(trimmedQuery, limit);
      } catch (fallbackError) {
        console.error('Backend fallback also failed:', fallbackError);
        throw error;
      }
    }
    throw error;
  }
};

// Fallback: Fetch suggestions from backend API
const fetchBackendSuggestions = async (query, limit) => {
  try {
    const params = new URLSearchParams({
      q: query,
      limit: limit.toString(),
    });
    const response = await api.get(`/locations/suggest?${params}`);
    
    if (response.data?.data?.suggestions) {
      // Transform backend format to match frontend format
      return response.data.data.suggestions.map((item) => ({
        city: item.city || null,
        state: item.state || null,
        zipCode: item.zipCode || null,
        lat: item.lat || null,
        lng: item.lng || null,
        displayName: item.displayName || item.label || '',
        label: item.label || (item.city && item.state ? `${item.city}, ${item.state}` : item.city || item.zipCode || 'Unknown'),
      }));
    }
    return [];
  } catch (error) {
    console.error('Backend suggestions failed:', error);
    return [];
  }
};
