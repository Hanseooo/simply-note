import { requireAuth } from '@/guards/authGuard'
import AdminFeedbackPage from '@/pages/admin/AdminFeedbackPage'
import { useAuthStore } from '@/store/useAuthStore'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/feedback/admin')({
  component: RouteComponent,
  beforeLoad: () => {
    requireAuth()

  }
})

function RouteComponent() {
  const userEmail = useAuthStore().user?.email;
  const navigate = useNavigate()

 useEffect(() => {
   if (!userEmail) return;

   if (
     userEmail !== "amoguishans@gmail.com" &&
     userEmail !== "hansqdyt@gmail.com"
   ) {
     navigate({ to: "/home" });
   }
 }, [userEmail, navigate]);


  return <AdminFeedbackPage />
}
