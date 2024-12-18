require("dotenv").config();

const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");

const authController = require("./controllers/auth");
const errorController = require("./controllers/error");

const app = express();
const corsOptions = {
  origin: "*", // Allows requests from all origins
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  credentials: true, // If you’re using cookies or Authorization headers
};

app.use("*",cors(corsOptions)); // Apply CORS middleware
app.set("view engine", "ejs");
app.set("views", "views");

const studentRoutes = require("./Routes/student");
const companyRoutes = require("./Routes/company");
const adminRoutes = require("./Routes/admin");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, "public")));

app.use("/update", authController.updatePass);
app.post("/login", authController.postLogin);
app.post("/registerCompany", authController.registerCompany);
app.use(authController.is_auth);
app.use("/s", authController.is_student, studentRoutes);
app.use("/c", authController.is_company, companyRoutes);
app.use("/a", authController.is_admin, adminRoutes);
app.use(errorController.get404);

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port :${PORT}`);
});

