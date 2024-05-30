const { Telegraf } = require("telegraf");
const { message } = require("telegraf/filters");
const { telegramAdap } = require("../Adapatadores/telegramAdaptador");
const { watsonOrq } = require("../Orquestadores/watsonOrquestador");
const { telegramOrquestador } = require("../Orquestadores/telegramOrquestador");
const { watsonAdap } = require("../Adapatadores/watsonAdaptador");

const telegramControlador = () => {
  const token = process.env.TELEGRAM_TOKEN;

  const bot = new Telegraf(token);

 ///

  bot.on(message("text"), async (ctx) => {
    const msgLocation = "Controladores::telegramControlador.js::bot.on"
    console.log(ctx,msgLocation);
    let activity =  telegramAdap(ctx);
    let watsonResponse = await watsonOrq(activity);
    watsonAdap(activity,watsonResponse);
    await telegramOrquestador(ctx,activity);


    if(activity.extension){
      activity.mensaje = "";
      watsonResponse = await watsonOrq(activity);
      watsonAdap(activity,watsonResponse);
      await telegramOrquestador(ctx,activity);
  }

  });

  bot.launch(console.log("Esta corriendo telegram"));
};

module.exports={telegramControlador};