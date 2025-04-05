const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    applicants: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        coverLetter: { type: String },
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
      },
    ],
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;
