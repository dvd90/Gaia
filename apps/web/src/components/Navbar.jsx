import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logoNav from "../images/logonav.png";

const links = [
  { to: "/dashboard", label: "Home", auth: true },
  { to: "/challenges", label: "Challenges" },
  { to: "/events", label: "Events" },
  { to: "/my_events", label: "My Events", auth: true }
];

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const onLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  const visibleLinks = links.filter(l => !l.auth || isAuthenticated);

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link
          to={isAuthenticated ? "/dashboard" : "/"}
          className="nav-brand"
          onClick={() => setOpen(false)}
        >
          <img src={logoNav} alt="Gaia" />
        </Link>

        <nav className={`nav-links ${open ? "open" : ""}`} aria-label="Main">
          {visibleLinks.map(l => (
            <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)}>
              {l.label}
            </NavLink>
          ))}
          {isAuthenticated ? (
            <button className="btn btn-ghost nav-logout" onClick={onLogout}>
              Log out{user ? ` (${user.name})` : ""}
            </button>
          ) : (
            <NavLink to="/login" className="nav-cta" onClick={() => setOpen(false)}>
              Login
            </NavLink>
          )}
        </nav>

        <button
          className="nav-burger"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
