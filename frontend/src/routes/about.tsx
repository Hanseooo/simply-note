import { requireAuth } from '@/guards/authGuard'
import AboutSection from '@/sections/AboutSection'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/about')({
  component: RouteComponent,
  beforeLoad: requireAuth()
})

function RouteComponent() {
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return <AboutSection />
}
