import Image from "next/image";
import "../styles/search.css"
import GenerateText from "@/components/generateTopics";

export default function Home() {


  return (
    <>
      <div className="logo">
        Learn With Gemini
      </div>
      <GenerateText />
    </>

  );
}
