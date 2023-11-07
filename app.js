const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const mongodb = require("mongodb");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
var exec = require("node-exec-promise").exec;

app.set("view engine", "ejs");
app.set("views", "views");

const { URI } = require("./env");
const { emp, empM } = require("./models/emp");

let tcase1=0, tcase2=0, tcase3=0;

const insertM = async (
  _ID,
  firstName = "PS",
  lastName = "Rana",
  age = "50",
  contact = "9898989898",
  address = "Thapar",
  salary = "200000"
) => {
  try {
    const newEmp = new empM({
      FIRST_NAME: firstName,
      LAST_NAME: lastName,
      AGE: age,
      CONTACT: contact,
      ADDRESS: address,
      SALARY: salary,
    });

    const result = await newEmp.save();
    // console.log(result);
  } catch (err) {
    console.log(err);
  }
};

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/timer", (req, res) => {
  const a = performance.now();
  let b;
  let timex;
  emp
    .find({})
    .then((users) => {
      users.map(function (record) {
        pH = "+91" + record.CONTACT;
        currSal = parseInt(record.SALARY);
        newSal = currSal + 0.1 * currSal;
        newSal = newSal.toString();
        insertM(
          record._id,
          record.FIRST_NAME.toUpperCase(),
          record.LAST_NAME.toUpperCase(),
          record.AGE,
          pH,
          record.ADDRESS,
          newSal
        );
      });
    })
    .then(() => {
      b = performance.now();
      timex = (b - a) / 1000;
      tcase1 = timex;
    })
    .then(() => {
      console.log(timex);
      res.render("time", { time: timex });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/gpp", (req, res, nxt) => {
  var a = performance.now();
  var b, timex;
  var cmd1 = "mongoexport --db=test --collection=demo --type=csv -f FIRST_NAME,LAST_NAME,AGE,CONTACT,ADDRESS,SALARY -o ./export.csv" + " && python ETL.py" + " && mongoimport --db test --collection demo3 --type=csv --headerline --file=file1.csv";
  exec(cmd1)
    .then(() => {
      b = performance.now();
      timex = (b - a) / 1000;
      tcase2 = timex;
      console.log("time ", timex, "sec");
    })
    .then(() => {
      res.render("time", { time: timex });
    });
});
app.post("/mlt", (req, res, nxt) => {
  var a = performance.now();
  var b, timex;
  cmd2 = "mongoexport --db=test --collection=demo --type=csv -f FIRST_NAME,LAST_NAME,AGE,CONTACT,ADDRESS,SALARY -o ./export.csv" + " && python METL.py" + " && mongoimport --db test --collection demo4 --type=csv --headerline --file=export.csv";
  exec(cmd2)
    .then(() => {
      b = performance.now();
      timex = (b - a) / 1000;
      tcase3 = timex;
      console.log("time ", timex, "sec");
    })
    .then(() => {
      res.render("time", { time: timex });
    });
});

app.get("/graph", (req, res, nxt) => {
  console.log(tcase1)
  console.log(tcase2)
  console.log(tcase3)
  let data = {t1:tcase1, t2:tcase2, t3:tcase3};
  res.render("grph.ejs", {data:data});
});

mongoose
  .connect(URI, {})
  .then((result) => {
    console.log("data base connected");
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
