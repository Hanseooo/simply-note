import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.tsx'
import { router } from './router.tsx'
import { RouterProvider } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import "@/lib/axios.ts";
import { initTheme } from './theme.ts'
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";

const queryClient = new QueryClient()
initTheme()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Analytics />
      <SpeedInsights />
      <Toaster theme='dark' richColors={true} />
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
