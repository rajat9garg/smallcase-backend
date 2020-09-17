const express = require("express");
const Router = express.Router();
const { to } = require("../handlers/async.handler");
const { User } = require("../database");
const { sendError, sendSuccess } = require("../handlers/response.handler");

const user = async (req, res, next) => {
  console.log(req.body);
  req.checkBody("name", "Name not found in the request", 404).notEmpty();
  req.checkBody("email", "Email not found in the request", 404).notEmpty();
  req.checkBody("ph_no", "Phone not found in the request", 404).notEmpty();

  if (req.validationErrors()) {
    return sendError(res, req.validationErrors(), 400);
  }

  let name = req.body.name;
  let email = req.body.email;
  let phone = parseInt(req.body.ph_no);

  let user, userError;

  [user, userError] = await to(User.find({ name: name, act: true }));

  if (userError) return sendError(res, { err, userError }, 422);

  if (user) {
    return sendError(res, { message: "User already exist" }, 204);
  }

  let userInsert, userInsertError;

  const userModel = new User({
    name: name,
    phone: phone,
    email: email,
  });
  [userInsert, userInsertError] = await to(userModel.save());

  if (userInsertError) return sendError(res, err, 422);

  return sendSuccess(res, { msg: "User Added" }, 200);
};

module.exports.user = user;
