import Image from "next/image";
import "../styles/search.css"
import GenerateText from "@/components/generateTopics";
import AddAPI from "@/components/addAPI";

export default function Home() {


  return (
    <>
      <div className="right-2 absolute top-2">
        <AddAPI />
      </div>
      <div className="logo">
        Learn With Gemini
      </div>
      <GenerateText />
      <footer>
        
      </footer>
    </>

  );
}
