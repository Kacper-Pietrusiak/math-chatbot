const { generateMathTask } = require("./mathTasks");
const { generateAIResponse } = require("./aiResponse");
const { solveEquation } = require("./equationSolver");
const { plotFunction } = require("./plotGraph");
const { startQuiz, checkAnswer } = require("./quiz");

async function handleCommand(bot, msg) {
  const chatId = msg.chat.id;
  const text = msg.text.trim();

  console.log("📩 Received command:", text);

  const [command, ...args] = text.split(" ");
  const argument = args.join(" ").trim();

  switch (command.toLowerCase()) {
    case "/start":
      bot.sendMessage(
        chatId,
        "👋 Witaj! Możesz zapytać mnie o matematykę lub użyć jednej z komend:\n\n" +
          "📌 /task [easy|medium|hard] [word|equation] - Otrzymaj zadanie matematyczne\n" +
          "📌 /solve [równanie] - Rozwiąż równanie\n" +
          "📌 /plot [funkcja] - Narysuj wykres funkcji\n" +
          "📌 /quiz [easy|medium|hard] - Rozpocznij quiz matematyczny"
      );
      break;

    case "/task":
      {
        const [taskLevel, taskType] = argument.split(" ");
        const level = taskLevel || "easy";
        const type = taskType || "random"; // Jeśli nie podano, losujemy

        console.log("📝 Generating math task for level:", level, "type:", type);

        try {
          const task = await generateMathTask(level, type);
          console.log("✅ AI returned task:", task);

          if (task && task.trim()) {
            await bot.sendMessage(chatId, `📌 Oto twoje zadanie:\n${task}`);
          } else {
            await bot.sendMessage(
              chatId,
              "⚠️ Nie udało się wygenerować zadania. Spróbuj ponownie."
            );
          }
        } catch (error) {
          console.error("❌ Error while generating task:", error);
          await bot.sendMessage(
            chatId,
            "⚠️ Wystąpił błąd przy generowaniu zadania. Spróbuj ponownie."
          );
        }
      }
      break;

    case "/solve":
      if (!argument) {
        bot.sendMessage(
          chatId,
          "⚠️ Podaj równanie do rozwiązania, np. /solve 2x + 3 = 7"
        );
        break;
      }
      console.log("🧮 Solving equation:", argument);
      await solveEquation(argument, bot, chatId);
      break;

    case "/plot":
      if (!argument) {
        bot.sendMessage(
          chatId,
          "⚠️ Podaj funkcję do narysowania, np. /plot x^2 + 2x"
        );
        break;
      }
      console.log("📊 Plotting function:", argument);
      await plotFunction(argument, bot, chatId);
      break;

    case "/quiz":
      {
        const difficulty = argument || "medium";
        bot.sendMessage(
          chatId,
          `🎯 Rozpoczynamy quiz matematyczny! Poziom: ${difficulty}\nOdpowiadaj, wpisując liczbę.`
        );
        startQuiz(chatId, bot, difficulty);
      }
      break;

    default:
      if (!isNaN(text)) {
        checkAnswer(chatId, bot, text);
      } else {
        console.log("🤖 Sending to AI:", text);
        const aiResponse = await generateAIResponse(text);
        bot.sendMessage(chatId, aiResponse);
      }
      break;
  }
}

module.exports = { handleCommand };
