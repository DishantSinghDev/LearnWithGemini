import { Dispatch, SetStateAction, useState, useEffect } from "react";
import Modal from "../shared/modal";
import { LoadingDots, LoadingSpinner } from "../shared/icons";
import { generateText } from "@/server/api";
import { X } from "lucide-react";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // For GitHub Flavored Markdown (optional)
import useLocalStorage from "@/lib/hooks/use-local-storage";

export const TutorialModal = ({
    showTutorialModal,
    setShowTutorialModal,
    topic,
    course
}: {
    showTutorialModal: boolean;
    setShowTutorialModal: Dispatch<SetStateAction<boolean>>;
    topic: string;
    course: string;
}) => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [tutorials, setTutorials] = useState("");
    const [apiKey, setApiKey] = useLocalStorage<string>("apiKey", "");


    useEffect(() => {
        if (course) {
            let isMounted = true;

            const GenerateTutorial = async () => {
                setLoading(true);
                try {
                    const prompt = `
You are an expert in [Course Name] and tasked with creating a targeted tutorial on the specific topic of "${topic}" within the broader course "${course}". 

Please adhere to the following guidelines:

1. **Relevance:** The tutorial must focus strictly on the topic "${topic}" while aligning with the overall themes and objectives of the course "${course}". Ensure that every section ties back to the main topic, avoiding unnecessary details.

2. **Structure:** Organize the tutorial into the following sections:
   - **Introduction:** Briefly introduce the topic within the context of the course, explaining its importance and relevance.
   - **Core Concepts:** Detail the key ideas, principles, and methods related to "${topic}" that are essential for understanding within the context of "${course}".
   - **Applications and Examples:** Provide practical examples or case studies that illustrate how "${topic}" is applied within the course "${course}".
   - **Advanced Considerations:** If applicable, touch on more complex aspects or advanced ideas related to "${topic}" that might be of interest to learners who want to go deeper.
   - **Conclusion:** Summarize the key takeaways, reinforcing the connection between "${topic}" and the overall course "${course}".

3. **Depth:** Tailor the depth of content to be appropriate for the course level, ensuring that beginners can grasp the basics while advanced learners find value in the more complex details.

4. **Language and Tone:** Use clear, precise, and engaging language suitable for students of "${course}". The tone should be educational yet approachable.

5. **Formatting:** Return the content in well-structured HTML, using appropriate tags for headings, lists, and emphasis. Each section should be clearly delineated with headings.

6. **Length:** Keep the tutorial focused and concise, with a length of around 700-1000 words to ensure it’s detailed yet digestible.

7. **Scope:** Avoid straying into topics outside of "${topic}" and "${course}". The content should remain tightly focused on providing value within these constraints.

8. If topic is not appropriate or contoversial then return nothing

Please return the response in Markdown only without any issues.
`;

                    const response = await generateText(prompt, apiKey) as Response;

                    if (!response.ok) {
                        handleApiError(response.status)
                        return;
                    }
                    const text = await response.text();

                    if (isMounted) {
                        setError(null);
                        setTutorials(text);
                    }
                } catch (error: any) {
                    console.error("Error generating tutorials:", error);
                    if (isMounted) {
                        handleApiError(error);
                    }
                } finally {
                    if (isMounted) {
                        setLoading(false);
                    }
                }
            };

            GenerateTutorial();

            return () => {
                isMounted = false;
            };
        }
    }, [course, topic]);

    const handleApiError = (status: any) => {
        if (status) {

            switch (status) {
                case 400:
                    setError(
                        "Invalid argument or failed precondition. Please check your request format or ensure the Gemini API is available in your country."
                    );
                    break;
                case 403:
                    setError(
                        "Permission denied. Please check if your API key has the required permissions."
                    );
                    break;
                case 404:
                    setError(
                        "Requested resource not found. Please ensure all parameters in your request are valid."
                    );
                    break;
                case 429:
                    setError(
                        "Rate limit exceeded. Please try again later or request a quota increase."
                    );
                    break;
                case 500:
                    setError(
                        "Internal server error. Please wait and try again. If the issue persists, report it to Google AI Studio."
                    );
                    break;
                case 503:
                    setError(
                        "Service unavailable. The service may be temporarily overloaded or down. Please try again later."
                    );
                    break;
                default:
                    setError("An unexpected error occurred. Please try again later.");
            }
        } else {
            setError("An unexpected error occurred. Please check your network connection and try again.");
        }
    };

    return (
        <Modal showModal={showTutorialModal} setShowModal={setShowTutorialModal}>
            <div className="overflow-y-scroll mrkdown overflow-x-visible w-full shadow-xl max-h-[100vh] md:max-w-lg md:rounded-2xl md:border md:border-gray-200">
                <div className=" bg-white border-b border-gray-200 dark:bg-gray-800 md:px-16 px-4 py-6 pt-8 space-y-3 ">

                    <div className="flex flex-col justify-center items-center text-center">
                        <h3 className="text-2xl font-bold font-display">{topic} - {course}</h3>
                        {loading && <LoadingSpinner />}
                        {error && <p className="text-red-500">{error}</p>}
                    </div>
                    {!loading && !error && (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{tutorials}</ReactMarkdown>
                    )}
                    <button
                        onClick={() => setShowTutorialModal(false)}
                        type="button"
                        className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-400 dark:text-white dark:border-gray-600 dark:hover:bg-gray-300 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                        aria-label="Close tutorial modal"
                    >
                        <X />
                    </button>

                </div>
            </div>
        </Modal>
    );
};
