import { Link } from "react-router-dom";
import CategoryArt from "./CategoryArt";
import ImpactMeter from "./ImpactMeter";

const ChallengeCard = ({ challenge }) => {
  if (!challenge) return null;

  return (
    <Link to={`/challenges/${challenge._id}`} className="card">
      <CategoryArt category={challenge.category} />
      <div className="card-body">
        <span className="card-tag">{challenge.category}</span>
        <h3 className="card-title">{challenge.title}</h3>
        <div className="card-meta">
          <ImpactMeter points={challenge.gaia_points} />
          <span className="card-points">+{challenge.gaia_points} pts</span>
        </div>
      </div>
    </Link>
  );
};

export default ChallengeCard;
