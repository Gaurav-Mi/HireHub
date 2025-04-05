const express = require("express");
const {
  handleCreateJob,
  handleGetAllJobs,
  handleApplyJob,
  handleUpdateJob,
  handleDeleteJob,
  handleEmployerJobs,
  handleStatusUpdate,
} = require("../controller/jobController");
const {
  protect,
  jobSeeker,
  employer,
  employerOrAdmin,
} = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/v1/createjob").post(protect, employer, handleCreateJob);
router.route("/v1/listalljobs").get(handleGetAllJobs);
router.route("/v1/applyjob/:id").post(protect, jobSeeker, handleApplyJob);
router.route("/v1/updatejob/:id").put(protect, employer, handleUpdateJob);
router.route("/v1/deletejob/:id").delete(protect, employerOrAdmin, handleDeleteJob);
router.route("/v1/employerjobs").get(protect, employer, handleEmployerJobs);
router
  .route("/v1/updatejobstatus/:jobId/:userId")
  .put(protect, employer, handleStatusUpdate);

module.exports = router;
