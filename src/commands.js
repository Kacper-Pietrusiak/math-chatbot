const { generateMathTask } = require("./mathTasks");
const { generateAIResponse } = require("./aiResponse");

async function handleCommand(bot, msg) {
  const chatId = msg.chat.id;
  const text = msg.text.toLowerCase();

  if (text === "/start") {
    bot.sendMessage(
      chatId,
      "Welcome! Ask me any math question or send /task [easy|medium|hard] to get a math problem to solve."
    );
  } else if (text.startsWith("/task")) {
    const level = text.split(" ")[1] || "easy";
    bot.sendMessage(chatId, generateMathTask(level));
  } else {
    const aiResponse = await generateAIResponse(text);
    bot.sendMessage(chatId, aiResponse);
  }
}

module.exports = { handleCommand };
