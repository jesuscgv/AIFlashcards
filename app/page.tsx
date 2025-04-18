"use client"

import { Header } from "@/app/components/sections/Header"
import { Hero } from "@/app/components/sections/Hero"
import { Stats } from "@/app/components/sections/Stats"
import { Features } from "@/app/components/sections/Features"
import { Pricing } from "@/app/components/sections/Pricing"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main>
        <Hero />
        <Stats />
        <Features />
        <Pricing />
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
