const axios = require('axios');
const {request,response} = require('express');


const {CloudantV1} = require('@ibm-cloud/cloudant');
const { IamAuthenticator:MiAutenticador } = require('ibm-cloud-sdk-core');
require("dotenv").config();

const cloudanturl = "https://apikey-v2-2tyzcp6h6jo01d29acdzgu45ma9sy2to1ge79z4xpm79:2c43f7b572f7cc92c3b155c54e256dd8@fad04c60-e33c-49c7-9366-1c61369b3bf7-bluemix.cloudantnosqldb.appdomain.cloud"
;

const auth = new MiAutenticador(
    {
        apikey :"K4vJc65itr1F9NR2cXZsun0b6Fn1KqobIULGw1m8IfjJ"

    }
);

const service = CloudantV1.newInstance({authenticator : auth})


service.setServiceUrl(cloudanturl);


const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');

const assistant = new AssistantV2({
  version: '2022-05-11',
  authenticator: new IamAuthenticator({
    apikey: 'hK-fkzBs39SD5fi7y5XqZNFuivZHmkxuRTZe5SLPDEYW',
  }),
  serviceUrl: 'https://api.us-south.assistant.watson.cloud.ibm.com',
});


let sessionID;

const createSession = async (user_id) => {
  await assistant
    .createSession({
      assistantId: "96e7369a-6e53-4b90-8a24-6b9c4b881efc", //ponerlo en un .env
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
