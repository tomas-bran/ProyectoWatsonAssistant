const { Telegraf } = require("telegraf");
const { message } = require("telegraf/filters");



const telegramOrquestador = async (ctx, activity) => {
    for await (const item of activity.watsonArray) {
      if (item.response_type === "text") {
        await ctx.reply(item.text);
      } else if (item.response_type === "option") {
        let optionMsg = "";

        for (const index of item.options) {
          optionMsg += `${index.value.input.text}\n`;
        }

        await ctx.reply(optionMsg);
      }
    }
    console.log("Orquestadores::telegramOrquestador.js::telegramOrquestador");
  };

  module.exports={telegramOrquestador}