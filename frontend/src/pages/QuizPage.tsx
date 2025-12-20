import TitleHeader from "@/components/headers/TitleHeader";
import GenerateQuiz from "@/sections/GenerateQuiz";
import SavedQuizzes from "@/sections/SavedQuizzes";


export default function QuizPage() {

    return (
      <main className="bg-radial from-primary/5">
        <TitleHeader
          titleWord1="Quiz"
          titleWord2="Generator"
          desc="Select existing notes and test how much knowledge you retain!"
        />
        <GenerateQuiz />
        <TitleHeader
          titleWord1="Your"
          titleWord2="Saved Quizzes"
          desc="Because you should try and try until you succeed right?"
        />
        <SavedQuizzes />
      </main>
    );
}