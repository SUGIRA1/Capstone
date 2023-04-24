const Client = require("../models/Client");
const Business = require("../models/Business");
const Investment = require("../models/Investment");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { signInToken, tokenForVerify } = require("../config/auth");

const loginClient = async (req, res) => {
  try {
    const client = await Client.findOne({ email: req.body.email });
    if (client && bcrypt.compareSync(req.body.password, client.password)) {
      const token = signInToken(client);
      res.send({
        token,
        _id: client._id,
        name: client.name,
        email: client.email,
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

const registerClient = async (req, res) => {
  try {
    const newClient = new Client({
      name: req.body.name,
      password: bcrypt.hashSync(req.body.password),
      email: req.body.email,
    });
    await newClient.save();
    const token = signInToken(newClient);
    res.send({
      token,
      _id: newClient._id,
      name: newClient.name,
      email: newClient.email,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// update client

const updateClient = async (req, res) => {
  try {
    const client = await Client.findOne({
      _id: req.params.id,
    });
    if (client) {
      (client.name = req.body.name), (client.email = req.body.email);

      const updatedClient = await client.save();

      const token = signInToken(updatedClient);
      res.send({
        token,
        _id: updatedClient._id,
        name: updatedClient.name,
        email: updatedClient.email,
      });
    } else {
      res.status(404).send({ message: "Client not found!" });
    }
  } catch (err) {
    res.status(500).send({ message: "Something wrong happened!" });
  }
};

// change password

const changePass = async (req, res) => {
  try {
    const client = await Client.findOne({ email: req.body.email });
    console.log(client);
    if (
      client &&
      bcrypt.compareSync(req.body.currentPassword, client.password)
    ) {
      client.password = bcrypt.hashSync(req.body.newPassword);
      await client.save();
      res.send({
        message: "Your password changed successfully!",
      });
    } else {
      res.status(401).send({
        message: "Invalid current password!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// const getAllBusinesses = async (req, res) => {
//   try {
//     const businesses = await Business.find().sort({
//       _id: 1,
//     });
//     res.send(businesses);
//   } catch (err) {
//     res.status(500).send({
//       message: err.message,
//     });
//   }
// };

const getAllBusinesses = async (req, res) => {
  try {
    const businesses = await Business.aggregate([
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

    res.send(businesses);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  loginClient,
  registerClient,
  updateClient,
  changePass,
  getAllBusinesses,
};
