
export const generateText = async (prompt: string, apiKey: string) => {
    try {
        const response = await fetch("http://localhost:3001", {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // Set the Content-Type header
            },
            body: JSON.stringify({ prompt, apiKey }), // Send the prompt as a JSON string
        });

        
        return await response;
    } catch (error) {
        console.error("Error generating text:", error);
    }
};
