const express = require("express");
const router = express.Router();
const {
  loginClient,
  registerClient,
  updateClient,
  changePass,
  getAllBusinesses,
} = require("../controllers/clientController");

const { isAuth } = require("../config/auth");

//client login
router.post("/login", loginClient);

//client register
router.post("/register", registerClient);

// update route
router.put("/update/:id", updateClient);

//get all businesses - Fiinanza client
router.get("/businesses", getAllBusinesses);

// change password
router.post("/change-password", changePass);

module.exports = router;
