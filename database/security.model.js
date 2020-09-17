const mongoose = require("mongoose");
const validate = require("mongoose-validator");
const ObjectId = mongoose.Schema.ObjectId;

let securitySchema = mongoose.Schema({
  ticker_id: { type: ObjectId, required: true },
  value: {
    type: Number,
    required: true,
  },
  act: { type: Boolean, required: true, default: true },
});

let Security = (module.exports = mongoose.model("Security", securitySchema));
