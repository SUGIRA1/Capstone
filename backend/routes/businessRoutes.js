const express = require("express");
const router = express.Router();
const {
  loginBusiness,
  registerBusiness,
  getBusinessInvestors,
  updateBusiness,
  getOneBusiness,
} = require("../controllers/businessController");

const { isAuth } = require("../config/auth");

//business login
router.post("/login", loginBusiness);

//business register
router.post("/register", registerBusiness);

// get one business
router.get("/one/:id", getOneBusiness);

// get business investors - Fiinanza business
router.get("/investors", isAuth, getBusinessInvestors);

// update business
router.put("/update/:id", updateBusiness);

module.exports = router;
