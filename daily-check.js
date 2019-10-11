const request = require("request");
const keys = require("./src/config/keys");

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

request(options, function(error, response, body) {
  if (error) throw new Error(error);

  const allPersons = JSON.parse(body).outs;

  const thisPerson = allPersons.filter(
    person => person.employeeEmail === `stefan.ritchie@thisismatrix.com`
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
