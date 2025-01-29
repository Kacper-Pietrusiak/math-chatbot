const { generateMathTask } = require("./mathTasks");
const { generateAIResponse } = require("./aiResponse");
const { solveEquation } = require("./equationSolver");

async function handleCommand(bot, msg) {
  const chatId = msg.chat.id;
  const text = msg.text.trim();

  console.log("📩 Received command:", text);

  if (text.toLowerCase() === "/start") {
    bot.sendMessage(
      chatId,
      "Welcome! Ask me any math question or send /task [easy|medium|hard] to get a math problem to solve."
    );
  } else if (text.toLowerCase().startsWith("/task")) {
    const level = text.split(" ")[1] || "easy";
    bot.sendMessage(chatId, generateMathTask(level));
  } else if (text.toLowerCase().startsWith("solve ")) {
    const equation = text.substring(6).trim();
    console.log("🧮 Solving equation:", equation);
    await solveEquation(equation, bot, chatId); // Poprawione wywołanie
  } else {
    console.log("🤖 Sending to AI:", text);
    const aiResponse = await generateAIResponse(text);
    bot.sendMessage(chatId, aiResponse);
  }
}

module.exports = { handleCommand };
