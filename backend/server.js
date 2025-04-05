const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const connectDB = require("./utils/dbconnection");
require("dotenv").config({ path: "../.env" });
const userRouter = require("./routes/userRoutes");
const jobRouter = require("./routes/jobRoutes");

const PORT = process.env.PORT || 5000;
const DBURI = process.env.DB_URI;

connectDB(DBURI);

app.use(express.json());
app.use("/api/auth", userRouter);
app.use("/api/jobs", jobRouter);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
