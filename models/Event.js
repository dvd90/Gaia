const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  title: {
    type: String,
    required: true
  },
  starts_at: {
    type: Date,
    required: true
  },
  ends_at: {
    type: Date,
    required: true
  },
  location: {
    type: String
  },
  description: {
    type: String,
    required: true
  },
  attendees: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
      },
      status: {
        type: String,
        enum: ["In Progress", "Completed"]
      }
    }
  ]
});

module.exports = Challenge = mongoose.model("challenge", EventSchema);
