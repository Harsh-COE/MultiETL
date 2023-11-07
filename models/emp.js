const mongoose = require("mongoose");

const empScheme = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  FIRST_NAME: String,
  LAST_NAME: String,
  AGE: String,
  CONTACT: String,
  ADDRESS: String,
  SALARY: String,
});
const empSchemeM = new mongoose.Schema({
  FIRST_NAME: String,
  LAST_NAME: String,
  AGE: String,
  CONTACT: String,
  ADDRESS: String,
  SALARY: String,
});

exports.emp = mongoose.model("demo", empScheme, "demo");
exports.empM = mongoose.model("demo2", empSchemeM, "demo2");
