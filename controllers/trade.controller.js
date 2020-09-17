const express = require("express");
const { to } = require("../handlers/async.handler");
const { Security, Tickers, Trade, Portfolio } = require("../database");
const { sendError, sendSuccess } = require("../handlers/response.handler");

const addSecurity = async (req, res, next) => {
  req
    .checkBody("tck_symbl", "Ticker Symbol not found in the request", 404)
    .notEmpty();
  req
    .checkBody("value", "share Value not found in the request", 404)
    .notEmpty();

  if (req.validationErrors()) {
    return sendError(res, req.validationErrors(), 400);
  }

  let tickerSymbol, value;
  if (req.body && req.body.tck_symbl) {
    tickerSymbol = req.body.tck_symbl;
  }
  if (req.body && req.body.value) {
    value = parseInt(req.body.value);
  }

  let ticker, tickerFindError;

  await Tickers.findOne({ name: tickerSymbol, act: true })
    .then((res) => (ticker = res))
    .catch((err) => {
      console.log(err);
      tickerFindError = err;
    });

  if (!ticker || tickerFindError) {
    return sendError(
      res,
      { error: tickerFindError ? tickerFindError : "Symbol not found" },
      422
    );
  }

  console.log(ticker._id, value);
  let newSecurity = new Security({
    ticker_id: ticker._id,
    value: value,
  });

  let newSecurityInsert, newSecurityError;

  [newSecurityInsert, newSecurityError] = await to(newSecurity.save());
  console.log(newSecurityInsert, newSecurityError);

  return sendSuccess(res, { symbol: ticker }, 200);
};

module.exports.addSecurity = addSecurity;

const addTrade = async (req, res, next) => {
  req.checkBody("ticker", "ticker not found in the request", 404).notEmpty();
  req.checkBody("amount", "amount not found in the request", 404).notEmpty();
  req
    .checkBody("no_of_share", "no_of_shares not found in the request", 404)
    .notEmpty();
  req.checkBody("type", "type not found in the request", 404).notEmpty();

  if (req.validationErrors()) {
    return sendError(res, req.validationErrors(), 400);
  }

  let ticker, amount, no_of_share, type;

  if (req.body.ticker) {
    ticker = req.body.ticker;
  }
  if (req.body.amount) {
    amount = parseInt(req.body.amount);
  }
  if (req.body.no_of_share) {
    no_of_share = parseInt(req.body.no_of_share);
  }
  if (req.body.type) {
    type = parseInt(req.body.type);
  }

  let tickerData, tickerFindError;

  //check for the ticker symbol
  await Tickers.findOne({ name: ticker, act: true })
    .then((res) => {
      tickerData = res;
    })
    .catch((err) => {
      tickerFindError = err;
    });

  if (!tickerData && tickerFindError) {
    return sendError(res, { message: "Ticker not found" }, 422);
  }

  let security, securityError;

  //check if the security exist
  await Security.findOne({ ticker_id: tickerData._id, act: true })
    .then((res) => {
      security = res;
    })
    .catch((err) => {
      securityError = err;
    });

  if (!security && securityError) {
    return sendError(res, { message: "Security not found" }, 422);
  }

  let port, portError;

  await Portfolio.findOne()
    .then((res) => {
      port = res;
    })
    .catch((error) => {
      portError = error;
    });

  if (!port && portError) {
    return sendError(res, { message: "Portfolio not found" }, 422);
  }
  console.log(port);

  if (type === 1) {
    let shares = port.shares;
    for (let i = 0; i < shares.length; i++) {
      if (shares[i].ticker == ticker) {
        let new_avg_val =
          (shares[i].avg_val_price * shares[i].no_of_shares +
            amount * no_of_share) /
          (shares[i].no_of_shares + no_of_share);
        shares[i].avg_val_price = new_avg_val;
        shares[i].no_of_shares = shares[i].no_of_shares + no_of_share;
      }
    }
    let portUpdate, portUpdateError;

    [portUpdate, portUpdateError] = await to(
      Portfolio.update({ _id: port._id }, { $set: { shares: shares } })
    );

    if (portUpdateError) {
      return sendError(res, { message: "Portfolio not updated" }, 422);
    }
  }
  if (type === 2) {
    let shares = port.shares;
    for (let i = 0; i < shares.length; i++) {
      if (shares[i].no_of_shares >= no_of_share) {
        shares[i].no_of_shares = shares[i].no_of_shares - no_of_share;
      }
    }
    let portUpdate, portUpdateError;

    [portUpdate, portUpdateError] = await to(
      Portfolio.update({ _id: port._id }, { $set: { shares: shares } })
    );

    if (portUpdateError) {
      return sendError(res, { message: "Portfolio not updated" }, 422);
    }
  }

  let trade, tradeError;

  let newTrade = new Trade({
    security_id: security._id,
    amount: amount,
    no_of_shares: no_of_share,
    type: type,
  });

  [trade, tradeError] = await to(newTrade.save());

  if (tradeError) {
    return sendError(res, { message: "Trade not Added" }, 422);
  }

  return sendSuccess(res, { message: "trade Successfull" }, 200);
};

module.exports.addTrade = addTrade;
