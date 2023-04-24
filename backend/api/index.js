require("dotenv").config();
const express = require("express");
const helmet = require("helmet"); // security related HTTP headers
const cors = require("cors"); // allow other web pages to make request to the application

const connectDB = require("../config/db");

const businessRoutes = require("../routes/businessRoutes");
const clientRoutes = require("../routes/clientRoutes");
const investmentRoutes = require("../routes/investmentRoutes");

const { isAuth } = require("../config/auth");

connectDB();

const app = express();

// We are using this for the express-rate-limit middleware
// See: https://github.com/nfriedly/express-rate-limit
// app.enable('trust proxy');
app.set("trust proxy", 1);

app.use(express.json({ limit: "4mb" })); // limits the payload to 4mb
app.use(helmet());
app.use(cors());

//root route
app.get("/", (req, res) => {
  res.send("App works properly!");
});

// Linking routes to controllers

app.use("/api/business/", businessRoutes);
app.use("/api/client/", clientRoutes);
app.use("/api/investment/", investmentRoutes);

// Use express's default error handling middleware
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  res.status(400).json({ message: err.message });
});

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
