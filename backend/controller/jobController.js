const Job = require("../model/jobModel");
const handleCreateJob = async (req, res) => {
  try {
    const job = new Job({ ...req.body, postedBy: req.user.id });
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ message: "Error creating job", error });
  }
};
const handleGetAllJobs = async (req, res) => {
  try {
    let jobs;

    jobs = await Job.find().populate("postedBy", "name email");

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: "Error fetching jobs" });
  }
};

const handleEmployerJobs = async (req, res) => {
  try {
    let jobs;
    if (req.user.role === "employer") {
      jobs = await Job.find({ postedBy: req.user.id })
        .populate("postedBy", "name email")
        .populate("applicants.user", "name email");
    } else {
      return res.json({ NotAuthorised: "Not Authorised" });
    }

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: "Error fetching jobs" });
  }
};
const handleApplyJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const alreadyApplied = job.applicants.find(
      (applicant) => applicant.user.toString() === req.user.id
    );

    if (alreadyApplied) {
      return res
        .status(400)
        .json({ message: "You have already applied for this job" });
    }

    job.applicants.push({
      user: req.user.id,
      coverLetter: req.body.coverLetter,
      status: "pending",
    });

    await job.save();
    await job.populate("applicants.user", "name email");

    res.json({ message: "Application submitted successfully", job });
  } catch (error) {
    res.status(500).json({ message: "Error applying for job", error: error });
  }
};

const handleUpdateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: "Error updating job" });
  }
};

const handleDeleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (req.user.role === "admin" || job.postedBy.toString() === req.user.id) {
      await job.deleteOne();
      return res.json({ message: "Job deleted successfully" });
    }

    res.status(403).json({ message: "Not authorized" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting job" });
  }
};


const handleStatusUpdate = async (req, res) => {
  try {
    const { jobId, userId } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const applicant = job.applicants.find(
      (applicant) => applicant.user.toString() === userId
    );

    if (!applicant) {
      return res.status(404).json({ message: "Applicant not found" });
    }

    applicant.status = status;

    await job.save();

    res.status(200).json({
      message: "Status updated successfully",
      updatedApplicant: {
        user: applicant.user,
        status: applicant.status,
      },
    });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  handleApplyJob,
  handleCreateJob,
  handleGetAllJobs,
  handleUpdateJob,
  handleDeleteJob,
  handleEmployerJobs,
  handleStatusUpdate,
};
