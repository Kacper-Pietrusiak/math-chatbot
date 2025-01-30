const { generateMathTask } = require("./mathTasks");
const { generateAIResponse } = require("./aiResponse");
const { solveEquation } = require("./equationSolver");
const { plotFunction } = require("./plotGraph");

async function handleCommand(bot, msg) {
  const chatId = msg.chat.id;
  const text = msg.text.trim();

  console.log("📩 Received command:", text);

  const command = text.split(" ")[0].toLowerCase();
  const argument = text.substring(command.length).trim();

  switch (command) {
    case "/start":
      bot.sendMessage(
        chatId,
        "Welcome! Ask me any math question or send /task [easy|medium|hard] to get a math problem to solve."
      );
      break;

    case "/task":
      const level = argument || "easy";
      bot.sendMessage(chatId, generateMathTask(level));
      break;

    case "/solve":
      console.log("🧮 Solving equation:", argument);
      await solveEquation(argument, bot, chatId);
      break;

    case "/plot":
      console.log("📊 Plotting function:", argument);
      await plotFunction(argument, bot, chatId);
      break;

    default:
      console.log("🤖 Sending to AI:", text);
      const aiResponse = await generateAIResponse(text);
      bot.sendMessage(chatId, aiResponse);
      break;
  }
}

module.exports = { handleCommand };
