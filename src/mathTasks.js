const OpenAI = require("openai");
const { OPENAI_API_KEY } = require("../config/config");

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

console.log("✅ Generator zadań matematycznych AI został uruchomiony!");

async function generateMathTask(level, type = "random") {
  try {
    console.log(
      `🔍 Generowanie zadania matematycznego: poziom: ${level}, typ: ${type}`
    );

    let prompt;
    if (type === "word") {
      prompt = `Wygeneruj unikalne zadanie matematyczne na poziomie trudności ${level}. 
      Zadanie powinno być krótkie i zrozumiałe, napisane w jednym zdaniu, bez rozwiązania ani wyjaśnień. 
      Przykład: "Ania ma 8 jabłek i oddaje 3. Ile jabłek jej zostanie?"`;
    } else if (type === "equation") {
      prompt = `Wygeneruj unikalne równanie matematyczne na poziomie trudności ${level}. 
      Równanie powinno być proste do rozwiązania i zapisane w formacie algebraicznym, np. "2x + 3 = 7". 
      Nie podawaj rozwiązania.`;
    } else {
      // Jeśli użytkownik nie podał typu, losujemy między tekstowym a równaniem
      prompt =
        Math.random() > 0.5
          ? `Wygeneruj unikalne zadanie matematyczne na poziomie trudności ${level}. 
          Zadanie powinno być krótkie i zrozumiałe, napisane w jednym zdaniu, bez rozwiązania ani wyjaśnień. 
          Przykład: "Ania ma 8 jabłek i oddaje 3. Ile jabłek jej zostanie?"`
          : `Wygeneruj unikalne równanie matematyczne na poziomie trudności ${level}. 
          Równanie powinno być proste do rozwiązania i zapisane w formacie algebraicznym, np. "2x + 3 = 7". 
          Nie podawaj rozwiązania.`;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 50,
    });

    const question = response.choices?.[0]?.message?.content?.trim();
    console.log("✅ Wygenerowane zadanie matematyczne:", question);

    if (!question) {
      console.error("❌ AI zwróciło pustą odpowiedź!");
      return null;
    }

    return question;
  } catch (error) {
    console.error("❌ Błąd podczas generowania zadania:", error);
    return null;
  }
}

module.exports = { generateMathTask };
