const Client = require("../models/Client");
const Business = require("../models/Business");
const Investment = require("../models/Investment");

const mongoose = require("mongoose");

const { query } = require("express");

var Paypack = require("paypack-js");

Paypack.config({
  client_id: `${process.env.PAYPACK_CLIENT_ID}`,
  client_secret: `${process.env.PAYPACK_SECRET_KEY}`,
});

const processPayment = async (req, res) => {
  const { total: amount, phone: phonenbr } = req.body;

  // Call Paypack.cashin to create a payment request and get the ref
  let ref;
  try {
    const cashinRes = await Paypack.cashin({
      number: phonenbr,
      amount: amount,
      environment: "development",
    });
    ref = cashinRes.data.ref;
    console.log(`Payment request created with ref ${ref}`);
  } catch (err) {
    console.log(`Failed to create payment request: ${err}`);
    res.status(500).send({
      message: "Payment request failed! Try again",
    });
    return;
  }

  // Wait for transaction:processed event with the same ref

  const timeout = 120000; // 2 min in milliseconds
  const start = Date.now();
  let processedEvent;
  while (Date.now() - start < timeout) {
    try {
      const eventsRes = await Paypack.events({ offset: 0, limit: 100 });
      processedEvent = eventsRes.data.transactions.find(
        (event) =>
          event.event_kind === "transaction:processed" && event.data.ref === ref
      );
      if (processedEvent) {
        console.log(
          `Payment request with ref ${ref} ${processedEvent.data.status}`
        );

        break;
      }
    } catch (err) {
      console.log(`Failed to get payment events: ${err}`);
      res.status(500).send({
        message: "Something went wrong! Try again later",
      });
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  if (!processedEvent) {
    console.log(`Payment request with ref ${ref} timed out`);
    res.status(500).send({
      message:
        "Request Timed out. Network related issues or latency. Try again later!",
    });
    return;
  }

  // Send the response to the client
  res.send({ status: processedEvent.data.status });
};

// add investment

const addInvestment = async (req, res) => {
  try {
    const newInvestment = new Investment(req.body);
    await newInvestment.save();
    res.status(200).send({
      message: "Invested Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// Get all client investments

const getClientInvestments = async (req, res) => {
  const queryObject = {};

  // capture the id when the client logs in

  queryObject.client = req.user._id;

  try {
    const totalDoc = await Investment.countDocuments(queryObject);

    // query for investments

    const investments = await Investment.find(queryObject)
      .populate({
        path: "business",
        select: ["name"],
        model: "Business",
      })
      .sort({ _id: -1 });

    const totalAmount = await Investment.aggregate([
      {
        $match: {
          client: mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $group: {
          _id: null,
          tAmount: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const totalBusiness = await Investment.aggregate([
      {
        $match: {
          client: mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $group: {
          _id: null,
          businesses: {
            $addToSet: "$business",
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalBusiness: { $size: "$businesses" },
        },
      },
    ]);

    res.send({
      totalInvestments: totalDoc,
      totalAmount:
        totalAmount.length === 0
          ? 0
          : parseFloat(totalAmount[0].tAmount).toFixed(0),
      totalBusiness:
        totalBusiness.length === 0 ? 0 : totalBusiness[0].totalBusiness,
      investments,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// Get all Business investments

const getBusinessInvestments = async (req, res) => {
  const queryObject = {};

  // capture the id when the business logs in

  queryObject.business = req.user._id;

  try {
    const totalDoc = await Investment.countDocuments(queryObject);

    // query for investments

    const investments = await Investment.find(queryObject)
      .populate({
        path: "client",
        select: ["name", "email"],
        model: "Client",
      })
      .sort({ _id: -1 });

    const totalAmount = await Investment.aggregate([
      {
        $match: {
          business: mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $group: {
          _id: null,
          tAmount: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const totalInvestors = await Investment.aggregate([
      {
        $match: {
          business: mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $group: {
          _id: null,
          investors: {
            $addToSet: "$client",
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalInvestors: { $size: "$investors" },
        },
      },
    ]);

    res.send({
      totalInvestments: totalDoc,
      totalAmount:
        totalAmount.length === 0
          ? 0
          : parseFloat(totalAmount[0].tAmount).toFixed(0),
      totalInvestors:
        totalInvestors.length === 0 ? 0 : totalInvestors[0].totalInvestors,
      investments,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  addInvestment,
  getBusinessInvestments,
  getClientInvestments,
  processPayment,
};
