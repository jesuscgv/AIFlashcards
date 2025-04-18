"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Layers, Menu, X } from "lucide-react"
import { createClient } from '@/lib/supabase/browser-client'
import { User } from "@supabase/supabase-js"
import { useRouter } from 'next/navigation'

const navigationItems = [
  { name: "Características", href: "/caracteristicas" },
  { name: "Precios", href: "#precios" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loadingAuth, setLoadingAuth] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    setLoadingAuth(true);
    const fetchSession = async () => {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (!error) {
            setUser(session?.user ?? null);
        }
        setLoadingAuth(false);
    }
    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoadingAuth(false);
      if (event === 'SIGNED_OUT') {
          // Optional: Force reload or specific navigation if needed after sign out from header
          // router.push('/'); // Example: redirect to home
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSignOut = async () => {
      setMobileMenuOpen(false);
      await supabase.auth.signOut();
      router.push('/');
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Layers className="h-6 w-6 text-green-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-transparent bg-clip-text">FlashLearn</span>
          </Link>

          <nav className="hidden md:flex gap-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-green-500 relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {loadingAuth ? (
                <div className="h-10 w-40 animate-pulse bg-muted rounded-md"></div>
            ) : user ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/dashboard">Panel</Link>
                </Button>
                <Button variant="outline" onClick={handleSignOut}>Cerrar Sesión</Button>
              </>
            ) : (
              <>
                <Button variant="outline" className="hover:text-green-500 hover:border-green-500" asChild>
                  <Link href="/auth">Iniciar sesión</Link>
                </Button>
                <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90" asChild>
                  <Link href="/auth">Registrarse</Link>
                </Button>
              </>
            )}
          </div>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(true)} disabled={loadingAuth}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Abrir menú</span>
          </Button>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 20 }}
          >
            <div className="flex h-16 items-center justify-between px-4 border-b">
              <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <Layers className="h-6 w-6 text-green-500" />
                <span className="text-xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-transparent bg-clip-text">FlashLearn</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                <X className="h-6 w-6" />
                <span className="sr-only">Cerrar menú</span>
              </Button>
            </div>
            <nav className="grid gap-6 p-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-lg font-medium transition-colors hover:text-green-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col gap-4 mt-4 border-t pt-6">
                 {loadingAuth ? (
                    <>
                      <div className="h-10 w-full animate-pulse bg-muted rounded-md"></div>
                      <div className="h-10 w-full animate-pulse bg-muted rounded-md"></div>
                    </>
                 ) : user ? (
                   <>
                     <Button variant="outline" className="w-full" asChild>
                         <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>Panel</Link>
                     </Button>
                     <Button variant="destructive" className="w-full" onClick={handleSignOut}>Cerrar Sesión</Button>
                   </>
                 ) : (
                   <>
                     <Button variant="outline" className="w-full hover:text-green-500 hover:border-green-500" asChild>
                       <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>Iniciar sesión</Link>
                     </Button>
                     <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90" asChild>
                       <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>Registrarse</Link>
                     </Button>
                   </>
                 )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 