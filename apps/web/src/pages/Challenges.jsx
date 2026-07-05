import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import Layout from "../components/Layout";
import Tabs from "../components/Tabs";
import Spinner from "../components/Spinner";
import ChallengeCard from "../components/ChallengeCard";

const CATEGORIES = ["Waste", "Energy", "Transport"];

const Challenges = () => {
  const [challenges, setChallenges] = useState(null);
  const [category, setCategory] = useState("Waste");

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

  const visible = (challenges || []).filter(c => c.category === category);

  return (
    <Layout>
      <div className="page-header">
        <h1>Challenges</h1>
        <Link className="btn btn-primary" to="/create_challenge">
          + New challenge
        </Link>
      </div>
      <Tabs
        tabs={CATEGORIES.map(c => ({ key: c, label: c }))}
        active={category}
        onChange={setCategory}
      />
      {challenges === null ? (
        <Spinner />
      ) : visible.length ? (
        <div className="card-grid">
          {visible.map(challenge => (
            <ChallengeCard challenge={challenge} key={challenge._id} />
          ))}
        </div>
      ) : (
        <p className="empty-state">
          No {category.toLowerCase()} challenges yet — be the first to create
          one!
        </p>
      )}
    </Layout>
  );
};

export default Challenges;
