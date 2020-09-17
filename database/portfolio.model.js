const mongoose = require("mongoose");
const validate = require("mongoose-validator");
const ObjectId = mongoose.Schema.ObjectId;

let portfolioSchema = mongoose.Schema({
  shares: { type: Array, required: true },
  user_id: { type: ObjectId, required: true },
});

let Portfolio = (module.exports = mongoose.model("Portfolio", portfolioSchema));
