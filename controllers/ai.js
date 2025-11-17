const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({
    apiKey: process.env.ai_api_key
});

const ask = async (req, res, next) => {
    try {
        const { prompt } = req.body
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });
        res.status(200).send(response.text)
    }
    catch (e) {
        next(e)
    }
}

module.exports = ask