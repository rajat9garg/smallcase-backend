const express = require("express");
const router = express.Router();

//middlewares for validations
const usermiddleware = require("../middlewares/user.middleware");

//controllers
const userController = require("../controllers/user.controller");
const tradeController = require("../controllers/trade.controller");
const portfolioController = require("../controllers/portfolio.controller");

//user routes
router.post("/user_add", usermiddleware.uservalidation, userController.user);

//trade routes
router.post("/add_security", tradeController.addSecurity);
router.post("/add_trade",tradeController.addTrade)


//portfolios routes
router.post("/fetch_port", portfolioController.fetchPortfolios);
router.post("/fetch_return", portfolioController.fetchReturns);

module.exports = router;
