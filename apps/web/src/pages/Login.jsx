import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import gaiaLogo from "../images/GAIA-logo.png";

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(form.email, form.password);
    } catch (err) {
      const errors = err.response?.data?.errors;
      toast(errors?.[0]?.msg || "Login failed, try again", "error");
      setSubmitting(false);
    }
  };

  return (
    <section className="form-page">
      <img className="form-logo" src={gaiaLogo} alt="Gaia" />
      <h1>Welcome back</h1>
      <form onSubmit={onSubmit} className="form">
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
            autoComplete="current-password"
            value={form.password}
            onChange={onChange}
            required
          />
        </label>
        <div className="form-actions">
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? "Logging in…" : "Login"}
          </button>
          <Link className="btn btn-ghost" to="/">
            Back
          </Link>
        </div>
        <p className="form-footnote">
          New to Gaia? <Link to="/quiz">Take the quiz</Link> and{" "}
          <Link to="/register">create an account</Link>.
        </p>
      </form>
    </section>
  );
};

export default Login;
