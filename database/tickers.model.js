const mongoose = require("mongoose");

let tickerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    act: { type: Boolean, required: true, default: true },
  }
);

let Ticker = (module.exports = mongoose.model("Ticker", tickerSchema));
