const express = require("express");
const Router = express.Router();
const { to } = require("../handlers/async.handler");
const { Portfolio, User } = require("../database");
const { sendError, sendSuccess } = require("../handlers/response.handler");

const fetchPortfolios = async (req, res, next) => {
  req
    .checkBody("userId", "Ticker Symbol not found in the request", 404)
    .notEmpty();

  if (req.validationErrors()) {
    return sendError(res, req.validationErrors(), 400);
  }

  let userId;
  if (req && req.body.userId) {
    userId = req.body.userId;
  }

  let result, err;

  await Portfolio.findOne()
    .then((res) => {
      result = res;
    })
    .catch((error) => {
      err = error;
    });

  let user, userError;

  await User.findOne({ _id: result.user_id })
    .then((res) => {
      user = res;
    })
    .catch((err) => {
      userError = err;
    });

  return sendSuccess(
    res,
    { success: true, portfolio: result, user: user },
    200
  );
};

module.exports.fetchPortfolios = fetchPortfolios;

const fetchReturns = async (req, res, next) => {
  req.checkBody("userId", "userID not found in the request", 404).notEmpty();

  if (req.validationErrors()) {
    return sendError(res, req.validationErrors(), 400);
  }

  let data, err;

  await Portfolio.findOne()
    .then((res) => {
      data = res;
    })
    .catch((error) => (err = error));

  let currPrice = 100;
  let cummReturn = 0;

  if (data && data.shares) {
    let shares = data.shares;

    for (let i = 0; i < shares.length; i++) {
      cummReturn +=
        (shares[i].avg_val_price - currPrice) * shares[i].no_of_shares;
    }
  }

  return sendSuccess(res, { return: cummReturn }, 200);
};

module.exports.fetchReturns = fetchReturns;
