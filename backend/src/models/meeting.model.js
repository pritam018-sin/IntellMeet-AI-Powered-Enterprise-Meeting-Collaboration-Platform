import mongoose from "mongoose";

const participantSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    role: {
      type: String,
      enum: ["host", "member"],
      default: "member",
    },

    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const meetingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    meetingCode: {
      type: String,
      required: true,
      unique: true,
    },

    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["scheduled", "active", "ended"],
      default: "active",
    },

    participants: [participantSchema],

    transcript: {
      type: String,
      default: "",
    },

    summary: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Meeting", meetingSchema);