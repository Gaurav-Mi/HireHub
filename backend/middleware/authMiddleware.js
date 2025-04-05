const jwt = require("jsonwebtoken");
const User = require("../model/usermodel");
require("dotenv").config({ path: "../.env" });

const protect = async (req, res, next) => {
  const header = req.header("auth-token");
  if (!header) {
    return res.status(401).send("Access Denied: No token provided");
  }

  try {
    const decoded = jwt.verify(header, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

const employer = (req, res, next) => {
  if (req.user && req.user.role === "employer") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as employer" });
  }
};

const jobSeeker = (req, res, next) => {
  if (req.user && req.user.role === "job_seeker") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as job seeker" });
  }
};

const Admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as Admin" });
  }
};


employerOrAdmin = (req, res, next) => {
  if (req.user.role === "employer" || req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied" });
  }
};

module.exports = { protect, employer, jobSeeker, Admin, employerOrAdmin };
