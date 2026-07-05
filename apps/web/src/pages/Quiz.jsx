import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useToast } from "../context/ToastContext";
import countryList from "../data/countries";
import {
  computeScore,
  EATER_OPTIONS,
  FLIGHT_OPTIONS,
  TRANSPORT_OPTIONS
} from "../lib/quiz";

const Quiz = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState({
    country: "",
    eater: "",
    flights: "",
    transportation: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (!form.country || form.eater === "" || form.flights === "" || form.transportation === "") {
      toast("Please answer all the questions", "error");
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.get(`/api/footprint/${form.country}`);
      const score = computeScore(
        res.data.earths,
        Number(form.eater),
        Number(form.flights),
        Number(form.transportation)
      );
      localStorage.setItem("score", score);
      navigate("/quiz_result");
    } catch (err) {
      toast("Could not compute your footprint, try again", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="form-page">
      <h1>Be part of the change…</h1>
      <p className="form-page-sub">
        Answer these questions to find out your average footprint.
      </p>
      <form onSubmit={onSubmit} className="form">
        <label className="field">
          <span>Where do you live?</span>
          <select name="country" value={form.country} onChange={onChange}>
            <option value="">Choose a country</option>
            {countryList.map(c => (
              <option key={c.countryCode} value={c.countryCode}>
                {c.countryName}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>How do you eat?</span>
          <select name="eater" value={form.eater} onChange={onChange}>
            <option value="">Choose an option</option>
            {EATER_OPTIONS.map(([label, value]) => (
              <option key={label} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>How often do you fly per year?</span>
          <select name="flights" value={form.flights} onChange={onChange}>
            <option value="">Choose an option</option>
            {FLIGHT_OPTIONS.map(([label, value]) => (
              <option key={label} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>How do you usually get around?</span>
          <select
            name="transportation"
            value={form.transportation}
            onChange={onChange}
          >
            <option value="">Choose an option</option>
            {TRANSPORT_OPTIONS.map(([label, value]) => (
              <option key={label} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <div className="form-actions">
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? "Computing…" : "See my footprint"}
          </button>
          <Link className="btn btn-ghost" to="/">
            Back
          </Link>
        </div>
      </form>
    </section>
  );
};

export default Quiz;
