"use client";
import "../../styles/search.css";
import { generateText } from "@/server/api";
import { useState } from "react";
import { LoadingSpinner } from "../shared/icons";
import { motion } from "framer-motion";
import { FADE_UP_ANIMATION_VARIANTS } from "@/lib/constant";
import { TutorialModal } from "../tutorialPopUP";
import useLocalStorage from "@/lib/hooks/use-local-storage";


export default function GenerateText() {
  const [topic, setTopic] = useState("");
  const [courses, setCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [apiKey, setApiKey] = useLocalStorage<string>("apiKey", "");

  const handleCourseGeneration = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSelectedCourse("");
    setCourses([]); // Clear previous courses
    setError(null); // Clear previous error
    setSearchPerformed(true); // Mark that a search has been performed

    try {
      const response = await generateText(
        `Generate some subtopics related to (${topic}) {if this topic is not appropriate or controversial or adult topic then return nothing} as simple text [separated by commas].`,
        apiKey
      ) as Response;

      if (!response.ok) {
        handleApiError(response.status);
        return;
      }

      const text = await response.text();
      const resCourses = text.split(",").map(course => course.trim()).filter(course => course.length > 0);
      if (resCourses[0] === "I am sorry" || resCourses[0] === "I'm sorry") {
        setError("Please search for an appropriate or valid course.");
      } else {
        setCourses(resCourses);
      }
    } catch (error) {
      console.error("Error generating courses:", error);
      handleApiError(error instanceof Error ? 500 : 0); // Use 500 for generic error
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleCourseClick = (course: string) => {
    setSelectedCourse(course);
    setShowTutorialModal(true);
  };

  const handleApiError = (status: number) => {
    switch (status) {
      case 400:
        setError("Invalid argument or failed precondition. Please check your request format or ensure the Gemini API is available in your country.");
        break;
      case 403:
        setError("Permission denied. Please check if your API key has the required permissions.");
        break;
      case 404:
        setError("Requested resource not found. Please ensure all parameters in your request are valid.");
        break;
      case 429:
        setError("Rate limit exceeded. Please try again later or request a quota increase.");
        break;
      case 500:
        setError("Internal server error. Please wait and try again. If the issue persists, report it to Google AI Studio.");
        break;
      case 503:
        setError("Service unavailable. The service may be temporarily overloaded or down. Please try again later.");
        break;
      default:
        setError("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <>
      <div className="search">
        <form onSubmit={handleCourseGeneration}>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Advanced course on Transformers"
            required
          />
          <div className="button">
            <button className="button1" type="submit">Search</button>
          </div>
        </form>
      </div>

      <TutorialModal
        showTutorialModal={showTutorialModal}
        setShowTutorialModal={setShowTutorialModal}
        course={selectedCourse}
        topic={topic}
      />

      <div className="flex flex-col mt-10 w-full justify-center items-center">
        {loading && <LoadingSpinner />} {/* Loading spinner while fetching data */}

        {error && <p className="text-red-400 text-center w-full font-bold text-lg">{error}</p>}

        <div className="my-5 flex justify-center w-full flex-wrap gap-5">
          {courses.map((course) => (
            <motion.div
              key={course} // Using course as key if it's unique
              initial="hidden"
              whileInView="show"
              animate="show"
              viewport={{ once: true }}
              variants={FADE_UP_ANIMATION_VARIANTS} // Assuming you have these variants defined
              className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
            >
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {course}
              </h5>

              <a
                onClick={() => handleCourseClick(course)}
                href="#"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-[#7cedc5] rounded-lg hover:bg-[#60c7a3] focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-[#60c7a3] dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                aria-label={`Read more about ${course}`}
              >
                Read more
                <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                </svg>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
