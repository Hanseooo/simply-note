import { HeroGeometric } from "@/components/ui/shadcn-io/shape-landing-hero";


export default function LandingPage() {
    
    return (
      <div className="min-h-screen">
        <HeroGeometric
          badge="AI-Powered Productivity Tool"
          title1="SimplyNote"
          title2="Elevate Your Studies"
          description="Elevate your study sessions with this AI-powered study tool designed to enhance productivity and learning experience."
        />
      </div>
    );
}