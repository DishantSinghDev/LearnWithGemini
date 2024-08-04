


export const generateText = async (prompt: string) => {
    try {
        const text = await fetch("/server/gemini/api", {
            body: JSON.stringify({ prompt }),
            method: "POST",
        });
        return text;
    } catch (error) {
        console.log(error);
    }
}