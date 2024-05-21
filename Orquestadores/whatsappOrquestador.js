require("dotenv").config()

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const cors = require("cors")


const whatsappOrq = async (respuesta) => {

    for await(const item of respuesta.watsonArray){
      if(item.response_type === "text"){
       await  client.messages
        .create({
              from: respuesta.to,
              body : item.text.replace(/\\n/g,'\n'),
              to: respuesta.from
        })
     .then(message => console.log(message.sid));
      }

      else if(item.response_type === "option"){

        let optionMsg='';

        for(const index of item.options){
            optionMsg += `${index.value.input.text}\n`;

        }


       await client.messages
        .create({
              from: respuesta.to,
              body : optionMsg,
               to: respuesta.from
        })
      .then(message => console.log(message.sid));

      }
    }

    console.log("Orquestadores::whatsappOrquestador.js::whatsappOrq");
}



module.exports = {whatsappOrq}