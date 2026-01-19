import { useEffect, useState } from 'react';
import { eventService } from '../../services/event.service';
import PopularCities from './PopularCities';

const STORAGE_KEY = 'socialup_location_v1';

const defaultPopularCities = [
  { city: 'New York', state: 'NY' },
  { city: 'San Francisco', state: 'CA' },
  { city: 'Seattle', state: 'WA' },
  { city: 'Austin', state: 'TX' },
  { city: 'Boston', state: 'MA' },
  { city: 'Los Angeles', state: 'CA' },
  { city: 'Chicago', state: 'IL' },
];

const isZip = (value) => /^\d{5}(-\d{4})?$/.test(value.trim());

const LocationSelector = ({
  onChange,
  popularCities = defaultPopularCities,
  className = '',
}) => {
  const [mode, setMode] = useState('none'); // none | geo | text
  const [status, setStatus] = useState('idle'); // idle | loading | error
  const [banner, setBanner] = useState('');
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // Load saved preference
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved?.mode === 'geo' && saved.lat && saved.lng) {
        setMode('geo');
        setBanner(saved.label || 'your area');
        onChange?.({ lat: saved.lat, lng: saved.lng, radiusMiles: saved.radiusMiles || 25 });
      } else if (saved?.mode === 'text' && (saved.city || saved.zipCode)) {
        setMode('text');
        setBanner(saved.label || (saved.city ? saved.city : saved.zipCode));
        onChange?.({ city: saved.city, zipCode: saved.zipCode });
      }
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch suggestions with a small debounce
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    const handle = setTimeout(async () => {
      try {
        const res = await eventService.getLocationSuggestions(query.trim(), 8);
        setSuggestions(res.data.suggestions || []);
      } catch {
        setSuggestions([]);
      }
    }, 250);
    return () => clearTimeout(handle);
  }, [query]);

  const setSaved = (payload) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore
    }
  };

  const requestGeolocation = () => {
    if (!navigator.geolocation) {
      setStatus('error');
      return;
    }
    setStatus('loading');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setMode('geo');

        // Best-effort reverse geocode (optional)
        let label = 'your area';
        try {
          const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
          const resp = await fetch(url, { headers: { 'Accept-Language': 'en' } });
          const data = await resp.json();
          const city =
            data?.address?.city ||
            data?.address?.town ||
            data?.address?.village ||
            data?.address?.county;
          const state = data?.address?.state;
          if (city && state) label = `${city}, ${state}`;
          else if (city) label = city;
        } catch {
          // ignore
        }

        setBanner(label);
        setSaved({ mode: 'geo', lat, lng, radiusMiles: 25, label });
        onChange?.({ lat, lng, radiusMiles: 25 });
        setStatus('idle');
      },
      () => {
        setStatus('idle');
        setMode('text');
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
    );
  };

  const applyTextLocation = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setMode('text');
    if (isZip(trimmed)) {
      setBanner(trimmed);
      setSaved({ mode: 'text', zipCode: trimmed, label: trimmed });
      onChange?.({ zipCode: trimmed });
      return;
    }
    setBanner(trimmed);
    setSaved({ mode: 'text', city: trimmed, label: trimmed });
    onChange?.({ city: trimmed });
  };

  const clearLocation = () => {
    setMode('none');
    setBanner('');
    setQuery('');
    setSuggestions([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    onChange?.({});
  };

  return (
    <div className={className}>
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">📍</span>
            <div>
              <div className="text-sm font-semibold text-gray-900">
                Events near {banner || 'your area'}
              </div>
              <div className="text-xs text-gray-600">
                Type a city or ZIP, or use your location.
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={requestGeolocation}
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Detecting…' : 'Use my location'}
            </button>
            {banner ? (
              <button
                type="button"
                onClick={clearLocation}
                className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter city or ZIP code"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {suggestions.length > 0 && (
            <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg max-h-60 overflow-auto">
              {suggestions.map((s) => {
                const label = [s.city, s.state].filter(Boolean).join(', ');
                const detail = s.zipCode || s.zip;
                return (
                  <button
                    key={`${label}-${detail || ''}`}
                    type="button"
                    onClick={() =>
                      applyTextLocation(detail || label)
                    }
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between"
                  >
                    <span className="text-gray-900">{label || detail}</span>
                    {s.count != null && (
                      <span className="text-xs text-gray-500">{s.count} events</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <PopularCities
          cities={popularCities}
          onSelect={(c) => applyTextLocation([c.city, c.state].filter(Boolean).join(', '))}
        />
      </div>
    </div>
  );
};

export default LocationSelector;

