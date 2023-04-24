const express = require("express");
const router = express.Router();
const {
  addInvestment,
  getBusinessInvestments,
  getClientInvestments,
  processPayment,
} = require("../controllers/investmentController");

const { isAuth } = require("../config/auth");

//add an investment
router.post("/add", addInvestment);

//get business investments - Fiinanza business
router.get("/business", isAuth, getBusinessInvestments);

//get client investments - Fiinanza client
router.get("/client", isAuth, getClientInvestments);

// process payment
router.post("/process-payment", processPayment);

module.exports = router;
