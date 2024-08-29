const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function generateText(prompt) {
    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Error generating content:", error);
        return "Sorry, I couldn't generate a response.";
    }
}

app.get("/", (req, res) => {
    res.send("Welcome to the Chatbot Server!");
});

app.post("/ask", async (req, res) => {
    const question = req.body.question;

    try {
        const botResponse = await generateText(question);

        res.json({ response: botResponse });
    } catch (error) {
        res.status(500).json({ error: "Failed to generate response." });
    }
});

app.listen(port, () => {
    console.log(`Chatbot server running at http://localhost:${port}`);
});
