const { watsonOrq } = require("../Orquestadores/watsonOrquestador");

const telegramAdap = (context) =>{


    let from = context.message.from.id.toString();
    const activity = {

        from : from,
        to:context.botInfo.id,
        mensaje : context.update.message.text,
        watsonArray : {},
        extension : false

    }

    console.log("Adaptadores::telegramAdaptador.js::telegramAdap ",activity);
    return activity;
}


module.exports={telegramAdap};