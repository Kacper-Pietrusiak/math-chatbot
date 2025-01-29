const TelegramBot = require("node-telegram-bot-api");
const { TELEGRAM_BOT_TOKEN } = require("../config/config");
const { handleCommand } = require("./commands");
const { solveEquation } = require("./equationSolver");

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

bot.on("message", (msg) => {
  console.log("📩 Received message from user:", msg.text);
  handleCommand(bot, msg);
});

console.log("✅ equationSolver module loaded successfully!");

console.log("Math chatbot is running...");
