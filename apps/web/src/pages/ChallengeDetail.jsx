import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api";
import Layout from "../components/Layout";
import Spinner from "../components/Spinner";
import CategoryArt from "../components/CategoryArt";
import ImpactMeter from "../components/ImpactMeter";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useConfirm } from "../context/ConfirmContext";

const ChallengeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const { confirm } = useConfirm();
  const [challenge, setChallenge] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await api.get(`/api/challenges/${id}`);
      setChallenge(res.data);
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
        <p className="empty-state">This challenge does not exist anymore.</p>
      </Layout>
    );
  if (!challenge || !user)
    return (
      <Layout>
        <Spinner />
      </Layout>
    );

  const isMine = challenge.creator === user._id;
  const joinEntry = challenge.joined_by.find(j => j.user === user._id);
  const isOpened = joinEntry?.status === "In Progress";
  const isCompleted = joinEntry?.status === "Completed";

  const onJoin = async () => {
    const ok = await confirm({
      title: "Start this challenge?",
      text: "It will show up in your dashboard as In Progress.",
      confirmLabel: "Let's go"
    });
    if (!ok) return;
    try {
      await api.put(`/api/challenges/${id}/join`);
      toast("Challenge accepted — go save the planet! 🌍");
      navigate("/dashboard");
    } catch (err) {
      toast(err.response?.data?.msg || "Could not join the challenge", "error");
    }
  };

  const onComplete = async () => {
    const ok = await confirm({
      title: "Did you complete the challenge?",
      confirmLabel: "Yes, I did it!"
    });
    if (!ok) return;
    try {
      await api.put(`/api/challenges/${id}/completed`);
      await refreshUser();
      toast(`+${challenge.gaia_points} Gaia points! 🎉`);
      navigate("/dashboard");
    } catch (err) {
      toast(err.response?.data?.msg || "Could not complete the challenge", "error");
    }
  };

  const onDelete = async () => {
    const ok = await confirm({
      title: "Delete this challenge?",
      text: "Once deleted it cannot be recovered.",
      confirmLabel: "Delete",
      danger: true
    });
    if (!ok) return;
    try {
      await api.delete(`/api/challenges/${id}`);
      toast("Challenge deleted");
      navigate("/dashboard");
    } catch (err) {
      toast(err.response?.data?.msg || "Could not delete the challenge", "error");
    }
  };

  return (
    <Layout>
      <article className="detail">
        <CategoryArt category={challenge.category} size="banner" />
        <div className="detail-body">
          <span className="card-tag">{challenge.category}</span>
          <h1>{challenge.title}</h1>
          <div className="detail-meta">
            <ImpactMeter points={challenge.gaia_points} />
            <span className="card-points">+{challenge.gaia_points} pts</span>
            <span className="detail-joined">
              {challenge.joined_by.length} joined
            </span>
          </div>
          <p className="detail-description">{challenge.description}</p>

          <div className="form-actions">
            {isCompleted ? (
              <span className="badge-completed">✅ Challenge completed</span>
            ) : isOpened ? (
              <button className="btn btn-primary" onClick={onComplete}>
                I completed it
              </button>
            ) : (
              <button className="btn btn-primary" onClick={onJoin}>
                Accept challenge
              </button>
            )}
            <Link className="btn btn-ghost" to="/challenges">
              Back
            </Link>
          </div>

          {isMine && (
            <div className="detail-owner-actions">
              <Link className="btn btn-outline" to={`/edit_challenge/${id}`}>
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

export default ChallengeDetail;
