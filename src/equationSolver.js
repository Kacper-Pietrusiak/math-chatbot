const OpenAI = require("openai");
const { OPENAI_API_KEY } = require("../config/config");
const turndown = require("turndown"); // Konwersja LaTeX na zwykły tekst

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

console.log("✅ equationSolver.js is being executed!");

async function solveEquation(equation, bot, chatId) {
  try {
    console.log("🔍 Wysyłanie równania do OpenAI:", equation);
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Rozwiąż poniższe równanie krok po kroku w języku polskim. Sformatuj odpowiedź w przejrzysty sposób, aby była łatwa do zrozumienia. Unikaj używania LaTeX i numerowania w jednej linii. Każdy krok powinien być oddzielony nową linią i zawierać objaśnienie w czytelnej formie:

            1. Podaj początkowe równanie.
            2. Wykonaj pierwszą operację i wyjaśnij jej cel.
            3. Wykonaj kolejne operacje, tłumacząc każdą zmianę.
            4. Podaj końcowy wynik i wyjaśnij, co oznacza.

            Równanie: ${equation}`,
        },
      ],
      max_tokens: 1000,
    });

    let aiResponse = response.choices[0].message.content.trim();
    console.log("✅ OpenAI zwróciło odpowiedź:", aiResponse);

    // Konwersja LaTeX na zwykły tekst za pomocą Turndown
    const turndownService = new turndown();
    aiResponse = turndownService.turndown(aiResponse);
    console.log("🔄 Skonwertowana odpowiedź:", aiResponse);

    // Podział na kroki z nowymi liniami
    aiResponse = formatSteps(aiResponse);

    const messageChunks = splitMessage(aiResponse, 3500);
    messageChunks.forEach((chunk, index) => {
      console.log(`📩 Wysyłanie części ${index + 1}/${messageChunks.length}`);
      bot.sendMessage(chatId, chunk);
    });
  } catch (error) {
    console.error("❌ Błąd generowania odpowiedzi:", error);
    bot.sendMessage(
      chatId,
      "⚠️ Nie można przetworzyć równania. Spróbuj ponownie."
    );
  }
}

function formatSteps(response) {
  const steps = response.split(/\d+\.\s/).filter(Boolean);
  return steps
    .map(
      (step, index) =>
        `**Krok ${index + 1}:**\n${step.trim().replace(/\*/g, "")}`
    )
    .join("\n\n");
}

function splitMessage(message, chunkSize = 3500) {
  console.log("Dzielenie wiadomości na części:", message.length, "znaków");
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.substring(i, i + chunkSize));
  }
  console.log("Łączna liczba części:", chunks.length);
  return chunks;
}

module.exports = { solveEquation };
