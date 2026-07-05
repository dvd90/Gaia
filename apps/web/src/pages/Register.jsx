import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import gaiaLogo from "../images/GAIA-logo.png";

const Register = () => {
  const { register, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
    address: ""
  });
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.password2) {
      toast("Passwords do not match", "error");
      return;
    }
    if (form.password.length < 6) {
      toast("Password needs 6 or more characters", "error");
      return;
    }
    setSubmitting(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        address: form.address,
        planet_consuption: localStorage.getItem("score") || undefined
      });
    } catch (err) {
      const errors = err.response?.data?.errors;
      toast(errors?.[0]?.msg || "Registration failed, try again", "error");
      setSubmitting(false);
    }
  };

  return (
    <section className="form-page">
      <img className="form-logo" src={gaiaLogo} alt="Gaia" />
      <h1>Join the movement</h1>
      <form onSubmit={onSubmit} className="form">
        <label className="field">
          <span>Name</span>
          <input name="name" value={form.name} onChange={onChange} required />
        </label>
        <label className="field">
          <span>Email</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={form.email}
            onChange={onChange}
            required
          />
        </label>
        <label className="field">
          <span>Password</span>
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            value={form.password}
            onChange={onChange}
            required
          />
        </label>
        <label className="field">
          <span>Confirm password</span>
          <input
            type="password"
            name="password2"
            autoComplete="new-password"
            value={form.password2}
            onChange={onChange}
            required
          />
        </label>
        <label className="field">
          <span>Address</span>
          <input
            name="address"
            placeholder="City, Country"
            value={form.address}
            onChange={onChange}
            required
          />
        </label>
        <div className="form-actions">
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? "Creating account…" : "Sign up"}
          </button>
          <Link className="btn btn-ghost" to="/">
            Back
          </Link>
        </div>
        <p className="form-footnote">
          Already have an account? <Link to="/login">Login</Link>.
        </p>
      </form>
    </section>
  );
};

export default Register;
