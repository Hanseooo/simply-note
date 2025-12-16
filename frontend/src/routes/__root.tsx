  import { createRootRoute, Outlet } from "@tanstack/react-router";
  import Navbar from "@/components/layout/Navbar";
  import Footer from "@/components/layout/Footer";
  import { Route as NotFoundRoute } from "@/routes/not-found"
import NotFoundPage from "@/pages/NotFoundPage";
import { useUser } from "@/hooks/useUser";
import { useAuthStore } from "@/store/useAuthStore";

  export const Route = createRootRoute({
    component: () => {
      useUser();
      const user = useAuthStore().user;
      return (
      <>
        <Navbar />
        <main className={`min-h-screen ${user ? "pt-14" : ""}`}>
            <Outlet />
        </main>
        <Footer />
      </>
    )
  },
    notFoundComponent: NotFoundPage
  });

  Route.addChildren([NotFoundRoute]);


