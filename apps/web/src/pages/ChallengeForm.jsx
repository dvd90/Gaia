import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api";
import Layout from "../components/Layout";
import { useToast } from "../context/ToastContext";

const CATEGORIES = ["Waste", "Energy", "Transport"];
const TITLE_MAX = 40;

// Handles both /create_challenge and /edit_challenge/:id
const ChallengeForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState({
    title: "",
    category: "Waste",
    gaia_points: 10,
    description: ""
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    api
      .get(`/api/challenges/${id}`)
      .then(res =>
        setForm({
          title: res.data.title,
          category: res.data.category,
          gaia_points: res.data.gaia_points,
          description: res.data.description
        })
      )
      .catch(() => toast("Could not load the challenge", "error"));
  }, [id, isEdit, toast]);

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (!form.title || !form.description) {
      toast("All fields are required", "error");
      return;
    }
    if (form.title.length > TITLE_MAX) {
      toast(`Title needs to be under ${TITLE_MAX} characters`, "error");
      return;
    }
    setSubmitting(true);
    const body = { ...form, gaia_points: Number(form.gaia_points) };
    try {
      const res = isEdit
        ? await api.put(`/api/challenges/${id}`, body)
        : await api.post("/api/challenges", body);
      toast(isEdit ? "Challenge updated" : "Challenge created 🎉");
      navigate(`/challenges/${res.data._id}`);
    } catch (err) {
      const errors = err.response?.data?.errors;
      toast(errors?.[0]?.msg || "Could not save the challenge", "error");
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <section className="form-page">
        <h1>{isEdit ? "Edit challenge" : "Create a challenge"}</h1>
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
            <span>Category</span>
            <select name="category" value={form.category} onChange={onChange}>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>
              Impact — {form.gaia_points} Gaia points
            </span>
            <input
              type="range"
              name="gaia_points"
              min="5"
              max="25"
              step="5"
              value={form.gaia_points}
              onChange={onChange}
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
              {submitting ? "Saving…" : isEdit ? "Save changes" : "Create challenge"}
            </button>
            <Link
              className="btn btn-ghost"
              to={isEdit ? `/challenges/${id}` : "/challenges"}
            >
              Back
            </Link>
          </div>
        </form>
      </section>
    </Layout>
  );
};

export default ChallengeForm;
