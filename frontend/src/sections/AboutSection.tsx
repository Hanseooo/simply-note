import AboutIntro from "./about/AboutIntro";
import DeveloperNote from "./about/DeveloperNote";
import FeatureHighlights from "./about/FeatureHighlights";
import HowItWorks from "./about/HowItWorks";



export default function AboutSection() {
    
    return (
      <>
        <AboutIntro />
        <HowItWorks />
        <FeatureHighlights />
        <DeveloperNote />
      </>
    );
}