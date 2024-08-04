"use client";
import "../../styles/search.css"
import { generateText } from "@/app/server/api";
import { useState } from "react";

export default function GenerateText() {
  const [topic, setTopic] = useState("");
  const [courses, setCourses] = useState([])

  const handleCourseGeneration = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const response = await generateText(`Generate some sub topics related to (${topic}) as simple text [seperated by commas].`) as any;
      const resCourses = response.split(",");
      setCourses(resCourses);
    }
    catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div className="search">
        <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Advanced course on Transformers" />
        <form onSubmit={handleCourseGeneration} className="button">
          <button type="submit">Search</button>
          <button>I'm Lucky</button>
        </form>
      </div>
      <div>
        {courses.map((course) => (
          <div key={course}>{course}</div>
        ))}
      </div>
    </>

  );
}
