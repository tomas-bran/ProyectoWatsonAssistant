const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');
const { searchSession } = require('../services/searchSession');

const assistant = new AssistantV2({
  version: '2022-05-11',
  authenticator: new IamAuthenticator({
    apikey: 'hK-fkzBs39SD5fi7y5XqZNFuivZHmkxuRTZe5SLPDEYW',
  }),
  serviceUrl: 'https://api.us-south.assistant.watson.cloud.ibm.com',
});

let sessionID;
let watsonResponse;

const watsonOrq = async (respuesta) => { 

  
  sessionID = await searchSession(respuesta.from); 
  //AGREGAR UN TRY-CATCH
  console.log("Orquestadores::watsonOrquestador.js::watsonOrq ",sessionID);
 const mensaje = {
    assistantId: '96e7369a-6e53-4b90-8a24-6b9c4b881efc',
    sessionId: sessionID,
    input: {
          'message_type': 'text',
          'text': respuesta.mensaje,
          options: { return_context: true }
          },
   }
 
  await assistant.message(mensaje)
    .then(res => {
      watsonResponse = res.result
      console.log(JSON.stringify(res.result, null, 2));
    })
    .catch(err => {
      console.log(err);
    }); 

    return watsonResponse;
}



module.exports = {watsonOrq};