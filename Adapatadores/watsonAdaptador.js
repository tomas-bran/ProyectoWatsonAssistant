const watsonAdap = (activity,watsonResponse)=>{

    activity.watsonArray = watsonResponse.output.generic;
    if(watsonResponse.context.global.system.skip_user_input){
        activity.extension = true;
    }

    console.log("Adaptadores::watsonAdaptador.js::watsonAdap");
}

module.exports = {watsonAdap};