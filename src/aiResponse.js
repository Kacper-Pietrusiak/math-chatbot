const { Configuration, OpenAIApi } = require("openai");
const { OPENAI_API_KEY } = require("../config/config");

const openai = new OpenAIApi(new Configuration({ apiKey: OPENAI_API_KEY }));

async function generateAIResponse(question) {
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Explain the following math concept or solve the problem: ${question}`,
      max_tokens: 100,
    });
    return completion.data.choices[0].text.trim();
  } catch (error) {
    console.error("Error generating AI response:", error);
    return "Sorry, I couldn't process that question. Please try again.";
  }
}

module.exports = { generateAIResponse };
