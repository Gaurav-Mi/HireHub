const User = require("../model/usermodel");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../.env" });

const handleSignup = async (req, res) => {
  const { name, email, password, role } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ exist: "User already exists" });
  }

  const user = new User({
    name,
    email,
    password,
    role,
  });

  try {
    await user.save();
    res.status(201).json({ success: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error registering user", err });
  }
};

const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  if (user.role !== "job_seeker") {
    return res.status(403).json({ error: "Access denied. Not a job seeker." });
  }

  if (user.isBlocked) {
    return res.status(403).json({ blocked: "Access denied. User is blocked." });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET
  );

  const userData = await User.findById(user._id).select("-password");
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({
    token,
    user: {
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
    },
  });
};

const handleLoginEmployer = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  if (user.role !== "employer") {
    return res.status(403).json({ error: "Access denied. Not an employer." });
  }
  if (user.isBlocked) {
    return res.status(403).json({ blocked: "Access denied. User is blocked." });
  }
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET
  );

  const userData = await User.findById(user._id).select("-password");
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({
    token,
    user: {
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
    },
  });
};

const handleadminLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  if (user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Not an Admin." });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET
  );

  const userData = await User.findById(user._id).select("-password");
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({
    token,
    user: {
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
    },
  });
};

const handleGetalluser =(req, res) => {
  User.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(500).json({ error: "Error fetching users", err });
    });
}

const handleBlockUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBlocked = true;
    await user.save();

    res.json({ message: "User blocked successfully", user });
  } catch (error) {
    console.error("Error blocking user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  handleLogin,
  handleSignup,
  handleLoginEmployer,
  handleadminLogin,
  handleGetalluser,
  handleBlockUser,
};
