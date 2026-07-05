import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import Layout from "../components/Layout";
import Tabs from "../components/Tabs";
import Spinner from "../components/Spinner";
import ChallengeCard from "../components/ChallengeCard";
import { useAuth } from "../context/AuthContext";

const TABS = [
  { key: "all", label: "All" },
  { key: "created", label: "Created" },
  { key: "completed", label: "Completed" },
  { key: "opened", label: "In progress" }
];

const Dashboard = () => {
  const { user, refreshUser } = useAuth();
  const [challenges, setChallenges] = useState(null);
  const [tab, setTab] = useState("all");

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    let mounted = true;
    api
      .get("/api/challenges")
      .then(res => mounted && setChallenges(res.data))
      .catch(() => mounted && setChallenges([]));
    return () => {
      mounted = false;
    };
  }, []);

  const groups = useMemo(() => {
    if (!challenges || !user)
      return { all: [], created: [], opened: [], completed: [] };
    const mine = status =>
      challenges.filter(c =>
        c.joined_by.some(j => j.user === user._id && j.status === status)
      );
    const created = challenges.filter(c => c.creator?._id === user._id);
    const opened = mine("In Progress");
    const completed = mine("Completed");
    const all = challenges.filter(
      c => !created.includes(c) && !completed.includes(c)
    );
    return { all, created, opened, completed };
  }, [challenges, user]);

  const visible = groups[tab];

  return (
    <Layout>
      {user && (
        <section className="user-card">
          <div className="user-card-header">
            {user.avatar && <img src={user.avatar} alt="" />}
            <div>
              <h1>Hey {user.name} 👋</h1>
              <p>You're doing a great job.</p>
            </div>
          </div>
          <div className="user-stats">
            <div className="stat">
              <span className="stat-number">{user.gaia_points}</span>
              <span className="stat-label">Gaia points</span>
            </div>
            <div className="stat">
              <span className="stat-number">{user.planet_consuption}</span>
              <span className="stat-label">Planets / year</span>
            </div>
            <div className="stat">
              <span className="stat-number">{groups.opened.length}</span>
              <span className="stat-label">In progress</span>
            </div>
            <div className="stat">
              <span className="stat-number">{groups.completed.length}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>
        </section>
      )}

      <div className="page-header">
        <h2>Challenges</h2>
        <Link className="btn btn-primary" to="/create_challenge">
          + New challenge
        </Link>
      </div>
      <Tabs tabs={TABS} active={tab} onChange={setTab} />
      {challenges === null ? (
        <Spinner />
      ) : visible.length ? (
        <div className="card-grid">
          {visible.map(challenge => (
            <ChallengeCard challenge={challenge} key={challenge._id} />
          ))}
        </div>
      ) : (
        <p className="empty-state">Nothing here yet — go join a challenge!</p>
      )}
    </Layout>
  );
};

export default Dashboard;
