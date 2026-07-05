import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api";
import Layout from "../components/Layout";
import { useToast } from "../context/ToastContext";
import { toDatetimeLocal } from "../lib/format";

const TITLE_MAX = 40;

// Handles both /create_event and /edit_event/:id
const EventForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState({
    title: "",
    location: "",
    description: "",
    starts_at: "",
    ends_at: ""
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    api
      .get(`/api/events/${id}`)
      .then(res =>
        setForm({
          title: res.data.title,
          location: res.data.location,
          description: res.data.description,
          starts_at: toDatetimeLocal(res.data.starts_at),
          ends_at: toDatetimeLocal(res.data.ends_at)
        })
      )
      .catch(() => toast("Could not load the event", "error"));
  }, [id, isEdit, toast]);

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (
      !form.title ||
      !form.location ||
      !form.description ||
      !form.starts_at ||
      !form.ends_at
    ) {
      toast("All fields are required", "error");
      return;
    }
    if (form.title.length > TITLE_MAX) {
      toast(`Title needs to be under ${TITLE_MAX} characters`, "error");
      return;
    }
    if (new Date(form.ends_at) < new Date(form.starts_at)) {
      toast("The event cannot end before it starts", "error");
      return;
    }
    setSubmitting(true);
    const body = {
      title: form.title,
      location: form.location,
      description: form.description,
      starts_at: new Date(form.starts_at).toISOString(),
      ends_at: new Date(form.ends_at).toISOString()
    };
    try {
      const res = isEdit
        ? await api.put(`/api/events/${id}`, body)
        : await api.post("/api/events", body);
      toast(isEdit ? "Event updated" : "Event created 🎉");
      navigate(`/events/${res.data._id}`);
    } catch (err) {
      const errors = err.response?.data?.errors;
      toast(errors?.[0]?.msg || "Could not save the event", "error");
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <section className="form-page">
        <h1>{isEdit ? "Edit event" : "Create an event"}</h1>
        <form onSubmit={onSubmit} className="form" noValidate>
          <label className="field">
            <span>Title</span>
            <input
              name="title"
              value={form.title}
              onChange={onChange}
              maxLength={TITLE_MAX}
              required
            />
          </label>
          <label className="field">
            <span>Location</span>
            <input
              name="location"
              placeholder="Address or place name"
              value={form.location}
              onChange={onChange}
              required
            />
          </label>
          <label className="field">
            <span>Starts at</span>
            <input
              type="datetime-local"
              name="starts_at"
              value={form.starts_at}
              onChange={onChange}
              required
            />
          </label>
          <label className="field">
            <span>Ends at</span>
            <input
              type="datetime-local"
              name="ends_at"
              value={form.ends_at}
              onChange={onChange}
              required
            />
          </label>
          <label className="field">
            <span>Description</span>
            <textarea
              name="description"
              rows="4"
              value={form.description}
              onChange={onChange}
              required
            />
          </label>
          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? "Saving…" : isEdit ? "Save changes" : "Create event"}
            </button>
            <Link className="btn btn-ghost" to={isEdit ? `/events/${id}` : "/events"}>
              Back
            </Link>
          </div>
        </form>
      </section>
    </Layout>
  );
};

export default EventForm;
