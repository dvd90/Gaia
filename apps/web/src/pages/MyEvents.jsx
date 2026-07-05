import { useEffect, useMemo, useState } from "react";
import api from "../api";
import Layout from "../components/Layout";
import Tabs from "../components/Tabs";
import Spinner from "../components/Spinner";
import EventCard from "../components/EventCard";
import { useAuth } from "../context/AuthContext";
import { isFuture } from "../lib/format";

const TABS = [
  { key: "created", label: "Created" },
  { key: "future", label: "Future" },
  { key: "past", label: "Past" }
];

const EMPTY_MESSAGES = {
  created: "You didn't create any event yet…",
  future: "You didn't join any upcoming event yet…",
  past: "No past events yet…"
};

const MyEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState(null);
  const [tab, setTab] = useState("created");

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

  const groups = useMemo(() => {
    if (!events || !user) return { created: [], future: [], past: [] };
    const created = events.filter(e => e.creator?._id === user._id);
    const joined = events.filter(e =>
      e.attendees.some(a => a.user === user._id)
    );
    return {
      created,
      future: joined.filter(e => isFuture(e.ends_at)),
      past: joined.filter(e => !isFuture(e.ends_at))
    };
  }, [events, user]);

  const visible = groups[tab];

  return (
    <Layout>
      <div className="page-header">
        <h1>My events</h1>
      </div>
      <Tabs tabs={TABS} active={tab} onChange={setTab} />
      {events === null ? (
        <Spinner />
      ) : visible.length ? (
        <div className="card-grid">
          {visible.map(event => (
            <EventCard event={event} key={event._id} />
          ))}
        </div>
      ) : (
        <p className="empty-state">{EMPTY_MESSAGES[tab]}</p>
      )}
    </Layout>
  );
};

export default MyEvents;
