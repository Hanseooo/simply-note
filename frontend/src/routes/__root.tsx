  import { createRootRoute, Outlet } from "@tanstack/react-router";
  import Navbar from "@/components/layout/Navbar";
  import Footer from "@/components/layout/Footer";
  import { Route as NotFoundRoute } from "@/routes/not-found"
import NotFoundPage from "@/pages/NotFoundPage";
import { useUser } from "@/hooks/useUser";

  export const Route = createRootRoute({
    component: () => {
      useUser();
      return (
      <>
        <Navbar />
          <main className="min-h-screen">
              <Outlet />
          </main>
        <Footer />
      </>
    )
  },
    notFoundComponent: NotFoundPage
  });

  Route.addChildren([NotFoundRoute]);


