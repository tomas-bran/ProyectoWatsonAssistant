const axios = require('axios');
const {request,response} = require('express');


const {CloudantV1} = require('@ibm-cloud/cloudant');
const { IamAuthenticator:MiAutenticador } = require('ibm-cloud-sdk-core');
require("dotenv").config();

const cloudanturl = process.env.CLOUDANT_URL

const auth = new MiAutenticador(
    {
        apikey :process.env.CLOUDANT_APIKEY

    }
);

const service = CloudantV1.newInstance({authenticator : auth})


service.setServiceUrl(cloudanturl);


const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');

const assistant = new AssistantV2({
  version: '2022-05-11',
  authenticator: new IamAuthenticator({
    apikey: process.env.ASSISTANT_APIKEY,
  }),
  serviceUrl: process.env.SERVICE_URL,
});


let sessionID;

const createSession = async (user_id) => {
  await assistant
    .createSession({
      assistantId: process.env.ASSISTANT_ID, 
    })
    .then((res) => {
      sessionID = res.result.session_id;
      console.log(JSON.stringify(res.result, null, 2));
    })
    .catch((err) => {
      console.log(err);
    });

    const document = (
      await service.getDocument({
        docId: "8974c7ac215e13260c5eda4eafcaa1a5",
        db: "eventpro",
      })
    ).result;

    let objeto = {
        user_id : user_id,
        sessionID : sessionID
    }

    document.users.push(objeto)    

    document.rev = (
        await service.postDocument({
            db:"eventpro",
            document,
        })
    ).result.rev;


    return sessionID;
};

module.exports = { createSession };
