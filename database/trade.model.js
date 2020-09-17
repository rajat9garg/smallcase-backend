const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.ObjectId;

let tradeSchema = mongoose.Schema(
  {
    security_id: { type: ObjectId, required: true },
    amount: {
      type: Number,
      required: true,
    }, // Amount for share is bought
    no_of_shares: {
      type: Number,
      required: true,
    }, //number of shares bought
    type: { type: Number, required: true }, //bought or sold shares
    act: { type: Boolean, required: true, default: true },
  },
  {
    timestamps: true,
  }
);

tradeSchema.statics = {
    type : {
        BUY : 1,
        SELL : 2,
    },
    typeValues : {
        BOUGHT : "BOUGHT",
        SELL : "SELL",
    }
}

let Trade = (module.exports = mongoose.model("Trade", tradeSchema));
