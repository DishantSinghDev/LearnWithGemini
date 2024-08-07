const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
const cors = require('cors');  // Import the cors package

dotenv.config();

const app = express();
const PORT = 3001;

// Use CORS middleware to allow requests from different origins
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

app.post("/", async (req, res) => {
    const { prompt, apiKey } = req.body;
    console.log(prompt, apiKey)

    if (!prompt) {
        return res.status(404).json({ error: "Prompt is required" });
    } 
    if (!apiKey) {
        return res.status(403).json({ error: "API Key is required" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        res.status(200).send(text)
    } catch (error) {
        console.error("Error generating content:", error);
        res.status(error.status).json({ error: error.errorDetails });
    }
});

app.listen(PORT, (error) => {
    if (!error) {
        console.log("Server running on port", PORT);
    } else {
        console.log("Error starting server:", error);
    }
});
