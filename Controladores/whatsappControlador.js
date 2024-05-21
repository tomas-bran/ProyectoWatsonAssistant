const express = require("express");
const { whatsappAdap } = require("../Adapatadores/whatsappAdaptador");
const { watsonOrq } = require("../Orquestadores/watsonOrquestador");
const { whatsappOrq } = require("../Orquestadores/whatsappOrquestador");
const { watsonAdap } = require("../Adapatadores/watsonAdaptador");


//

const whatsappControlador = async (body)=>{
    console.log("Controladores::whatsappControlador.js::whatsappControlador")
    let activity=whatsappAdap(body);
    let watsonResponse = await watsonOrq(activity);
    watsonAdap(activity,watsonResponse);
    await whatsappOrq(activity);

    if(activity.extension){
        activity.mensaje = "";
        watsonResponse = await watsonOrq(activity);
        watsonAdap(activity,watsonResponse);
        await whatsappOrq(activity);


    }
    
}

module.exports = {whatsappControlador};