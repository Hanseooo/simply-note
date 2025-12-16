import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/useLogout";


export default function Home() {

    const logout = useLogout()

    return (
        <>
        <Button onClick={() => logout.mutate()}>Log out</Button>
        </>
    )
}