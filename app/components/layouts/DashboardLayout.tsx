"use client"

import { useState, useEffect } from "react"
import { Header } from "@/app/components/sections/Header"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Cambiar tema</span>
        </Button>
      </div>
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-24">
          <p className="text-sm text-muted-foreground">
            © 2024 FlashLearn. Todos los derechos reservados.
          </p>
          <nav className="flex gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:underline">Términos</a>
            <a href="#" className="hover:underline">Privacidad</a>
            <a href="#" className="hover:underline">Contacto</a>
          </nav>
        </div>
      </footer>
    </div>
  )
} 