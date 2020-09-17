const mongoose = require("mongoose");
const validate = require("mongoose-validator");
const ObjectId = mongoose.Schema.ObjectId;

let userSchema = mongoose.Schema({
  name: { type: String, required: true },
  phone: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
  },
  act : {type : Boolean,required : true , default : true}
});

let User = (module.exports = mongoose.model("User", userSchema));
