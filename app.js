const request = require("request");
const express = require("express");

const keys = require("./src/config/keys");
const app = express();
const port = process.env.PORT || 3000;

const options = {
  headers: {
    Authorization: keys.access_token
  },
  method: "GET",
  url: "https://api.hibob.com/v1/timeoff/outtoday"
};

app.get("/:name", (req, res) => {
  request(options, function(error, response, body) {
    if (error) throw new Error(error);

    const allPersons = JSON.parse(body).outs;

    const thisPerson = allPersons.filter(
      person => person.employeeEmail === `${req.params.name}@thisismatrix.com`
    );

    if (thisPerson[0]) {
      switch (thisPerson[0].policyTypeDisplayName) {
        case "WFH":
          res.send("I'm working from home today!");
          break;
        case "Holiday":
          res.send("I'm on holiday today!");
          break;
        case "Sick":
          res.send("I'm sick today!");
          break;
        default:
          res.send("I'm not sure what's happening today!");
          break;
      }
    } else {
      res.send("I'm working from the office today!");
    }
  });
});

app.get("/", (req, res) => {
  request(options, function(error, response, body) {
    if (error) throw new Error(error);
    res.json(JSON.parse(body));
  });
});

app.listen(port, () => {
  console.log(`App is listening on ${port}...`);
});
