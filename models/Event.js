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
    type: String,
    required: true
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
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Event = mongoose.model("event", EventSchema);
