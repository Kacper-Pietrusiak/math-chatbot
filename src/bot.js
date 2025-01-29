const TelegramBot = require("node-telegram-bot-api");
const { TELEGRAM_BOT_TOKEN } = require("../config/config");
const { handleCommand } = require("./commands");

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

bot.on("message", (msg) => {
  handleCommand(bot, msg);
});

console.log("Math chatbot is running...");
