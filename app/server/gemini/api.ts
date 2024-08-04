import { NextApiRequest, NextApiResponse } from "next";
const { GoogleGenerativeAI } = require("@google/generative-ai");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }

    console.log(process.env.API_KEY)

    if (req.method === "POST") {

        // Access your API key as an environment variable (see "Set up your API key" above)
        const genAI = new GoogleGenerativeAI(process.env.API_KEY);

        // ...

        // The Gemini 1.5 models are versatile and work with most use cases
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        try {

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            res.status(200).send(text);
        } catch (error) {
            console.log(error);
        }
    }
    else {
        res.status(405).json({ error: "Method not allowed" });
    }
}

