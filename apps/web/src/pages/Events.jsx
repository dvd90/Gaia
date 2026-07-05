import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import Layout from "../components/Layout";
import Tabs from "../components/Tabs";
import Spinner from "../components/Spinner";
import EventCard from "../components/EventCard";

// mapbox-gl is heavy — only load it when the map tab is opened
const EventsMap = lazy(() => import("../components/EventsMap"));

const Events = () => {
  const [events, setEvents] = useState(null);
  const [view, setView] = useState("list");

  useEffect(() => {
    let mounted = true;
    api
      .get("/api/events")
      .then(res => mounted && setEvents(res.data))
      .catch(() => mounted && setEvents([]));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Layout wide={view === "map"}>
      <div className="page-header">
        <h1>Events</h1>
        <Link className="btn btn-primary" to="/create_event">
          + New event
        </Link>
      </div>
      <Tabs
        tabs={[
          { key: "list", label: "List" },
          { key: "map", label: "Map" }
        ]}
        active={view}
        onChange={setView}
      />
      {events === null ? (
        <Spinner />
      ) : view === "map" ? (
        <Suspense fallback={<Spinner />}>
          <EventsMap events={events} />
        </Suspense>
      ) : events.length ? (
        <div className="card-grid">
          {events.map(event => (
            <EventCard event={event} key={event._id} />
          ))}
        </div>
      ) : (
        <p className="empty-state">No events yet — create the first one!</p>
      )}
    </Layout>
  );
};

export default Events;
