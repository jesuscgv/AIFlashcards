"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Sparkles } from "lucide-react"
import Link from 'next/link'
import { createClient } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"

export function Hero() {
  const [currentFlashcard, setCurrentFlashcard] = useState(0)
  const [user, setUser] = useState<User | null>(null)
  const [loadingAuth, setLoadingAuth] = useState(true)
  const supabase = createClient()

  const flashcards = [
    { front: "¿Qué es React?", back: "Una biblioteca de JavaScript para construir interfaces de usuario", color: "from-blue-500 to-indigo-600" },
    { front: "¿Qué es Next.js?", back: "Un framework de React para aplicaciones web", color: "from-purple-500 to-pink-600" },
    { front: "¿Qué es Tailwind?", back: "Un framework CSS de utilidades", color: "from-green-500 to-emerald-600" },
  ]

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoadingAuth(false);
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        setUser(session?.user ?? null);
    });

    return () => {
        authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFlashcard((prev) => (prev + 1) % flashcards.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [flashcards.length])

  const getStartedLink = user ? '/dashboard' : '/auth';

  return (
    <section className="relative overflow-hidden py-20 md:py-32 bg-gradient-to-b from-white to-green-50 dark:from-background dark:to-background">
      <div className="container px-4 md:px-6">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="w-fit border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400">
              <Sparkles className="mr-2 h-3 w-3" />
              Aprende más rápido
            </Badge>
            <motion.h1
              className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Memoriza todo con{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">
                flashcards inteligentes
              </span>
            </motion.h1>
            <motion.p
              className="text-muted-foreground text-lg md:text-xl max-w-[600px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Potencia tu aprendizaje con nuestra plataforma de flashcards. Estudia de manera más eficiente y
              recuerda más con menos tiempo.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-3 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90" asChild disabled={loadingAuth}>
                <Link href={getStartedLink}> 
                  {loadingAuth ? 'Cargando...' : 'Comenzar gratis'}
                  {!loadingAuth && <ChevronRight className="ml-2 h-4 w-4" />}
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="group">
                Ver demostración
                <motion.span
                  className="ml-2 opacity-0 group-hover:opacity-100"
                  initial={{ x: -10 }}
                  animate={{ x: 0 }}
                >
                  →
                </motion.span>
              </Button>
            </motion.div>
          </motion.div>

          <div className="relative h-[500px] md:h-[600px] flex items-center justify-center perspective-[2000px]">
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full bg-green-200 blur-3xl opacity-50 animate-pulse" />
              <div className="absolute bottom-1/3 right-1/3 w-64 h-64 rounded-full bg-emerald-300 blur-3xl opacity-40 animate-pulse" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentFlashcard}
                className="absolute w-[340px] sm:w-[400px] h-[240px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 flex items-center justify-center text-center transform-gpu"
                initial={{ rotateY: 90, opacity: 0, scale: 0.8 }}
                animate={{ rotateY: 0, opacity: 1, scale: 1 }}
                exit={{ rotateY: -90, opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.7, type: "spring", damping: 20 }}
                style={{
                  backfaceVisibility: "hidden",
                  transformStyle: "preserve-3d",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
              >
                <motion.span 
                  className="text-2xl font-medium"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {flashcards[currentFlashcard].front}
                </motion.span>
              </motion.div>
              <motion.div
                key={`back-${currentFlashcard}`}
                className={`absolute w-[340px] sm:w-[400px] h-[240px] bg-gradient-to-r ${flashcards[currentFlashcard].color} text-white rounded-2xl shadow-2xl p-8 flex items-center justify-center text-center transform-gpu`}
                initial={{ rotateY: -90, opacity: 0, scale: 0.8, y: 60 }}
                animate={{ rotateY: 0, opacity: 1, scale: 0.95, y: 60 }}
                exit={{ rotateY: 90, opacity: 0, scale: 0.8, y: 60 }}
                transition={{ duration: 0.7, delay: 0.15, type: "spring", damping: 20 }}
                style={{
                  backfaceVisibility: "hidden",
                  transformStyle: "preserve-3d",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
              >
                <motion.span 
                  className="text-2xl font-medium"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                >
                  {flashcards[currentFlashcard].back}
                </motion.span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
} 