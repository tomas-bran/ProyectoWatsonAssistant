const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');
const { searchSession } = require('../services/searchSession');

const assistant = new AssistantV2({
  version: '2022-05-11',
  authenticator: new IamAuthenticator({
    apikey: process.env.ASSISTANT_APIKEY,
  }),
  serviceUrl: process.env.SERVICE_URL,
});

let sessionID;
let watsonResponse;

const watsonOrq = async (respuesta) => { 

  
  sessionID = await searchSession(respuesta.from); 
  //AGREGAR UN TRY-CATCH
  console.log("Orquestadores::watsonOrquestador.js::watsonOrq ",sessionID);
 const mensaje = {
    assistantId: process.env.ASSISTANT_ID,
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