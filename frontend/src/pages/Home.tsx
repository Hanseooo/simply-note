import WelcomeDialog from "@/components/dialogs/WelcomeDialog";
import PinnedCollection from "@/sections/PinnedCollection";
import UserHeader from "@/sections/UserHeader";


export default function Home() {

    return (
        <>
        <WelcomeDialog  />
        <UserHeader />
        <PinnedCollection />
        </>
    )
}