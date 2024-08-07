import "../styles/search.css"
import GenerateText from "@/components/generateTopics";
import AddAPI from "@/components/addAPI";
import Balancer from "react-wrap-balancer";
import Footer from "@/components/footer";

export default function Home() {


  return (
    <>
      <div className="right-2 absolute top-2">
        <AddAPI />
      </div>
      <div className="logo " >
        <Balancer>
          Learn With Gemini
        </Balancer>
      </div>
      <GenerateText />
      <Footer />
    </>

  );
}
