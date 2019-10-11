const request = require("request");
const express = require("express");

const keys = require("./src/config/keys");
const app = express();
const port = process.env.PORT || 3001;

const options = {
  headers: {
    Authorization: keys.bob_access_token
  },
  method: "GET",
  url: "https://api.hibob.com/v1/timeoff/outtoday"
};

ghostOptions = command => {
  return {
    method: "POST",
    url: `https://api.particle.io/v1/devices/${keys.device_name}/ghostAction`,
    headers: {
      "cache-control": "no-cache",
      "content-type": "application/x-www-form-urlencoded"
    },
    form: {
      access_token: keys.photon_access_token,
      arg: command
    }
  };
};

ghostAction = action => {
  request(ghostOptions(action), function(error, response, body) {
    if (error) throw new Error(error);
  });
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
          ghostAction("trans");
          res.send("I'm working from home today!");
          break;
        case "Holiday":
          ghostAction("spin");
          res.send("I'm on holiday today!");
          break;
        case "Sick":
          ghostAction("love");
          res.send("I'm sick today!");
          break;
        default:
          ghostAction("blink");
          res.send("I'm not sure what's happening today!");
          break;
      }
    } else {
      ghostAction("torchOn");
      res.send("I'm working from the office today!");
    }
  });
});

app.get("/", (req, res) => {
  console.log(keys.access_token);

  request(options, function(error, response, body) {
    if (error) throw new Error(error);

    persons = [];

    JSON.parse(body).outs.forEach(person => {
      persons.push({
        employeeId: person.employeeId,
        policyTypeDisplayName: person.policyTypeDisplayName,
        employeeDisplayName: person.employeeDisplayName,
        startDate: person.startDate,
        endDate: person.endDate,
        startDatePortion: person.startDatePortion,
        endDatePortion: person.endDatePortion,
        hours: person.hours,
        requestRangeType: person.requestRangeType
      });
    });

    res.json(persons);
  });
});

app.listen(port, () => {
  console.log(`App is listening on ${port}...`);
});
