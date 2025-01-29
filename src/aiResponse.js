const OpenAI = require("openai");
const { OPENAI_API_KEY } = require("../config/config");

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

async function generateAIResponse(question) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Wytłumacz rozwiązanie tego problemu: ${question}`,
        },
      ],
      max_tokens: 1000,
    });
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Błąd", error);
    return "Przepraszam, nie mogłem przetworzyć tego pytania. Spróbuj ponownie.";
  }
}

module.exports = { generateAIResponse };
