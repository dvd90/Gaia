import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import mapboxgl from "mapbox-gl";

const EventsMap = ({ events }) => {
  const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!TOKEN || !containerRef.current) return undefined;

    mapboxgl.accessToken = TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [34.80287, 32.090252],
      zoom: 8
    });
    map.addControl(new mapboxgl.NavigationControl());

    const markers = events
      .filter(event => event.coords && Array.isArray(event.coords.coordinates))
      .map(event => {
        const popupNode = document.createElement("div");
        popupNode.className = "map-popup";
        popupNode.innerHTML = `<strong>${event.title}</strong><p>${event.location}</p>`;
        const button = document.createElement("button");
        button.className = "btn btn-primary btn-small";
        button.textContent = "View event";
        button.onclick = () => navigate(`/events/${event._id}`);
        popupNode.appendChild(button);

        return new mapboxgl.Marker({ color: "#1e8e5a" })
          .setLngLat(event.coords.coordinates)
          .setPopup(new mapboxgl.Popup({ offset: 24 }).setDOMContent(popupNode))
          .addTo(map);
      });

    return () => {
      markers.forEach(marker => marker.remove());
      map.remove();
    };
  }, [events, navigate]);

  if (!TOKEN) {
    return (
      <div className="map-missing">
        <p>
          The map needs a Mapbox token — set <code>VITE_MAPBOX_TOKEN</code> in
          your environment.
        </p>
      </div>
    );
  }

  return <div ref={containerRef} className="events-map" data-testid="events-map" />;
};

export default EventsMap;
