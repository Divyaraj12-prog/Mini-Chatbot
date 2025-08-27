const { GoogleGenAI } = require("@google/genai");


const ai = new GoogleGenAI({});

async function generateContent(message) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: message,
  })
  return response.text
}

module.exports = generateContent