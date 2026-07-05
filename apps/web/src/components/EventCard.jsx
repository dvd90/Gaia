import { Link } from "react-router-dom";
import CategoryArt from "./CategoryArt";
import { timeFromNow } from "../lib/format";

const EventCard = ({ event }) => {
  if (!event) return null;

  return (
    <Link to={`/events/${event._id}`} className="card">
      <CategoryArt category="Event" />
      <div className="card-body">
        <span className="card-tag">Event</span>
        <h3 className="card-title">{event.title}</h3>
        <div className="card-meta card-meta-column">
          <span>🕒 {timeFromNow(event.starts_at)}</span>
          <span>📍 {event.location}</span>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
