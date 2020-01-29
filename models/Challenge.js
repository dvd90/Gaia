const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const joined_user = {
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  status: {
    type: String,
    enum: ["In Progress", "Completed"]
  }
};

const ChallengeSchema = new Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ["Waste", "Energy", "Transport"]
  },
  description: {
    type: String,
    required: true
  },
  gaia_points: {
    type: Number,
    required: true
  },
  joined_by: [joined_user],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Challenge = mongoose.model("challenge", ChallengeSchema);
