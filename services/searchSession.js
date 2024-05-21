//busco la session en la BDD con un nro de telefono (un identificador)
//si no hay, newsession,
//busca el sessionID
const axios = require("axios");
const { request, response } = require("express");

const { CloudantV1 } = require("@ibm-cloud/cloudant");
const { IamAuthenticator } = require("ibm-cloud-sdk-core");
const { createSession } = require("./createSession");
require("dotenv").config();

const cloudanturl = "https://apikey-v2-2tyzcp6h6jo01d29acdzgu45ma9sy2to1ge79z4xpm79:2c43f7b572f7cc92c3b155c54e256dd8@fad04c60-e33c-49c7-9366-1c61369b3bf7-bluemix.cloudantnosqldb.appdomain.cloud"
;

const auth = new IamAuthenticator({
  apikey: "K4vJc65itr1F9NR2cXZsun0b6Fn1KqobIULGw1m8IfjJ",
});

const service = CloudantV1.newInstance({ authenticator: auth });

service.setServiceUrl(cloudanturl);

let sessionID;

const searchSession = async (user_id) => {
  const documentos = await axios({
    method: "POST",
    url: cloudanturl + "/eventpro/_find",
    data: {
      "selector": {
        "users": {
          "$elemMatch": {
            "user_id": user_id,
          }
        }
      },
      "fields": []
    },
    headers: {
      "Content-Type": "application/json",
      apikey: "K4vJc65itr1F9NR2cXZsun0b6Fn1KqobIULGw1m8IfjJ",
    },
  });

  if (documentos.data.docs.length === 0) {
    //console.log("Estoy vacio :(");
    sessionID = await createSession(user_id);
  } else {
    for (const index of documentos.data.docs) {
      for (const index2 of index.users) {
        if (index2.user_id === user_id) {
          sessionID = index2.sessionID;
        }
      }
    }
  }

  return(sessionID);
};

module.exports = { searchSession };


