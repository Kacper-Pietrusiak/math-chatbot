const OpenAI = require("openai");
const { OPENAI_API_KEY } = require("../config/config");

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

async function generateAIResponse(question) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Explain the following math concept or solve the problem: ${question}`,
        },
      ],
      max_tokens: 100,
    });
    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating AI response:", error);
    return "Sorry, I couldn't process that question. Please try again.";
  }
}

module.exports = { generateAIResponse };
