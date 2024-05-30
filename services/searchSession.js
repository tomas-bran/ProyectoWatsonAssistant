//busco la session en la BDD con un nro de telefono (un identificador)
//si no hay, newsession,
//busca el sessionID
const axios = require("axios");
const { request, response } = require("express");

const { CloudantV1 } = require("@ibm-cloud/cloudant");
const { IamAuthenticator } = require("ibm-cloud-sdk-core");
const { createSession } = require("./createSession");
require("dotenv").config();

const cloudanturl = process.env.CLOUDANT_URL;

const auth = new IamAuthenticator({
  apikey: process.env.CLOUDANT_APIKEY,
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
      apikey: process.env.CLOUDANT_APIKEY,
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


