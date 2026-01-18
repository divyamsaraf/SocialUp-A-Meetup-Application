import { useEffect, useRef } from 'react';

const MapComponent = ({ events = [], center = null, zoom = 10 }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current) return;

    const loadMap = () => {
      if (window.google && window.google.maps) {
        const defaultCenter = center || { lat: 37.7749, lng: -122.4194 };

        const map = new window.google.maps.Map(mapRef.current, {
          center: defaultCenter,
          zoom: zoom,
        });

        mapInstanceRef.current = map;

        if (events.length > 0) {
          events.forEach((event) => {
            if (event.location?.coordinates?.lat && event.location?.coordinates?.lng) {
              const marker = new window.google.maps.Marker({
                position: {
                  lat: event.location.coordinates.lat,
                  lng: event.location.coordinates.lng,
                },
                map: map,
                title: event.title,
              });

              const infoWindow = new window.google.maps.InfoWindow({
                content: `
                  <div style="padding: 8px;">
                    <h3 style="margin: 0 0 8px 0; font-weight: bold;">${event.title}</h3>
                    <p style="margin: 0 0 4px 0; color: #666;">${event.eventCategory}</p>
                    <p style="margin: 0; font-size: 12px; color: #999;">
                      ${new Date(event.dateAndTime).toLocaleDateString()}
                    </p>
                  </div>
                `,
              });

              marker.addListener('click', () => {
                infoWindow.open(map, marker);
              });

              markersRef.current.push(marker);
            }
          });

          if (events.length > 0 && events[0].location?.coordinates) {
            const bounds = new window.google.maps.LatLngBounds();
            events.forEach((event) => {
              if (event.location?.coordinates?.lat && event.location?.coordinates?.lng) {
                bounds.extend({
                  lat: event.location.coordinates.lat,
                  lng: event.location.coordinates.lng,
                });
              }
            });
            map.fitBounds(bounds);
          }
        }
      }
    };

    if (window.google && window.google.maps) {
      loadMap();
    } else {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = loadMap;
      document.head.appendChild(script);
    }

    return () => {
      markersRef.current.forEach((marker) => {
        marker.setMap(null);
      });
      markersRef.current = [];
    };
  }, [events, center, zoom]);

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '400px', borderRadius: '8px' }}
      className="border border-gray-300"
    />
  );
};

export default MapComponent;
