import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api";
import Layout from "../components/Layout";
import Spinner from "../components/Spinner";
import CategoryArt from "../components/CategoryArt";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useConfirm } from "../context/ConfirmContext";
import { formatDate, timeFromNow } from "../lib/format";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { confirm } = useConfirm();
  const [event, setEvent] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await api.get(`/api/events/${id}`);
      setEvent(res.data);
    } catch (err) {
      setNotFound(true);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (notFound)
    return (
      <Layout>
        <p className="empty-state">This event does not exist anymore.</p>
      </Layout>
    );
  if (!event || !user)
    return (
      <Layout>
        <Spinner />
      </Layout>
    );

  const isMine = event.creator === user._id;
  const isJoined = event.attendees.some(a => a.user === user._id);

  const onJoin = async () => {
    const ok = await confirm({
      title: "Join this event?",
      text: "See you there! ❤️",
      confirmLabel: "Count me in"
    });
    if (!ok) return;
    try {
      await api.put(`/api/events/${id}/join`);
      toast("You're in — see you at the event! 🎉");
      navigate("/my_events");
    } catch (err) {
      toast(err.response?.data?.msg || "Could not join the event", "error");
    }
  };

  const onDelete = async () => {
    const ok = await confirm({
      title: "Delete this event?",
      text: "Once deleted it cannot be recovered.",
      confirmLabel: "Delete",
      danger: true
    });
    if (!ok) return;
    try {
      await api.delete(`/api/events/${id}`);
      toast("Event deleted");
      navigate("/my_events");
    } catch (err) {
      toast(err.response?.data?.msg || "Could not delete the event", "error");
    }
  };

  return (
    <Layout>
      <article className="detail">
        <CategoryArt category="Event" size="banner" />
        <div className="detail-body">
          <span className="card-tag">Event</span>
          <h1>{event.title}</h1>
          <div className="detail-meta detail-meta-column">
            <span>
              🕒 {formatDate(event.starts_at)} ({timeFromNow(event.starts_at)})
            </span>
            <span>📍 {event.location}</span>
            <span>👥 {event.attendees.length} attending</span>
          </div>
          <p className="detail-description">{event.description}</p>

          <div className="form-actions">
            {isJoined ? (
              <span className="badge-completed">✅ You're attending</span>
            ) : (
              <button className="btn btn-primary" onClick={onJoin}>
                Join event
              </button>
            )}
            <Link className="btn btn-ghost" to="/events">
              Back
            </Link>
          </div>

          {isMine && (
            <div className="detail-owner-actions">
              <Link className="btn btn-outline" to={`/edit_event/${id}`}>
                ✏️ Edit
              </Link>
              <button className="btn btn-danger" onClick={onDelete}>
                🗑 Delete
              </button>
            </div>
          )}
        </div>
      </article>
    </Layout>
  );
};

export default EventDetail;
