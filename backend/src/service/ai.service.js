const {GoogleGenAI} = require("@google/genai")

const ai = new GoogleGenAI({});

async function main(data) {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: data,
    });
     return response.text
}

module.exports = main