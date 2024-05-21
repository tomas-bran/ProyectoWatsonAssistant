const whatsappAdap = (wspMessage) =>{ //wspMessage es el body del request
    //console.log(wspMessage);
    const activity = {
    
        from : wspMessage.From,
        to : wspMessage.To,
        mensaje : wspMessage.Body,
        watsonArray : {},
        extension : false

    }
    console.log("Adaptadores::whatsappAdaptador.js::whatsappAdap ",activity);
    return activity;
}


module.exports = {whatsappAdap};