const Client = require("../models/Client");
const Business = require("../models/Business");
const Investment = require("../models/Investment");
const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { signInToken, tokenForVerify } = require("../config/auth");

const loginBusiness = async (req, res) => {
  try {
    const business = await Business.findOne({ email: req.body.email });
    if (business && bcrypt.compareSync(req.body.password, business.password)) {
      const token = signInToken(business);
      res.send({
        token,
        _id: business._id,
        name: business.name,
        rep: business.rep,
        description: business.description,
        email: business.email,
        pitchVideo: business.pitchVideo,
        goalAmount: business.goalAmount,
        minAmount: business.minAmount,
        image: business.image,
      });
    } else {
      res.status(401).send({
        message: "Invalid Email or password!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const registerBusiness = async (req, res) => {
  try {
    const newBusiness = new Business({
      name: req.body.data.name,
      rep: req.body.data.rep,
      description: req.body.data.description,
      password: bcrypt.hashSync(req.body.data.password),
      email: req.body.data.email,
      pitchVideo: req.body.data.pitchVideo,
      goalAmount: req.body.data.goalAmount,
      minAmount: req.body.data.minAmount,
      image: req.body.data.image,
    });

    await newBusiness.save();

    const token = signInToken(newBusiness);
    res.send({
      token,
      _id: newBusiness._id,
      name: newBusiness.name,
      rep: newBusiness.rep,
      description: newBusiness.description,
      email: newBusiness.email,
      pitchVideo: newBusiness.pitchVideo,
      goalAmount: newBusiness.goalAmount,
      minAmount: newBusiness.minAmount,
      image: newBusiness.image,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// get business investors - Fiinanza business

const getBusinessInvestors = async (req, res) => {
  try {
    const investors = await Investment.aggregate([
      {
        $match: {
          business: mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $lookup: {
          from: "clients",
          localField: "client",
          foreignField: "_id",
          as: "client_info",
        },
      },
      {
        $unwind: "$client_info",
      },
      {
        $group: {
          _id: "$client",
          name: {
            $first: "$client_info.name",
          },
          email: {
            $first: "$client_info.email",
          },
        },
      },
    ]);

    res.send(investors);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// get one business

const getOneBusiness = async (req, res) => {
  try {
    const business = await Business.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $lookup: {
          from: "investments",
          localField: "_id",
          foreignField: "business",
          as: "investments",
        },
      },
      {
        $unwind: {
          path: "$investments",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          description: { $first: "$description" },
          goalAmount: { $first: "$goalAmount" },
          minAmount: { $first: "$minAmount" },
          image: { $first: "$image" },
          pitchVideo: { $first: "$pitchVideo" },
          totalInvestment: { $sum: "$investments.amount" },
          investors: { $addToSet: "$investments.client" },
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          goalAmount: 1,
          minAmount: 1,
          image: 1,
          pitchVideo: 1,
          totalInvestment: 1,
          numInvestors: { $size: "$investors" },
        },
      },
    ]).sort({
      _id: 1,
    });

    if (!business) {
      res.status(404).send({ message: "Business not found!" });
      return;
    }

    res.send(business);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// update business

const updateBusiness = async (req, res) => {
  try {
    const business = await Business.findOne({
      _id: req.params.id,
    });
    if (business) {
      (business.name = req.body.data.name),
        (business.rep = req.body.data.rep),
        (business.description = req.body.data.description),
        (business.email = req.body.data.email),
        (business.pitchVideo = req.body.data.pitchVideo),
        (business.goalAmount = req.body.data.goalAmount),
        (business.minAmount = req.body.data.minAmount),
        (business.image = req.body.data.image
          ? req.body.data.image
          : business.image);

      const updatedBusiness = await business.save();

      const token = signInToken(updatedBusiness);
      res.send({
        token,
        _id: updatedBusiness._id,
        name: updatedBusiness.name,
        rep: updatedBusiness.rep,
        description: updatedBusiness.description,
        email: updatedBusiness.email,
        pitchVideo: updatedBusiness.pitchVideo,
        goalAmount: updatedBusiness.goalAmount,
        minAmount: updatedBusiness.minAmount,
        image: updatedBusiness.image,
      });
    } else {
      res.status(404).send({ message: "Business not found!" });
    }
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

module.exports = {
  loginBusiness,
  registerBusiness,
  getBusinessInvestors,
  updateBusiness,
  getOneBusiness,
};
