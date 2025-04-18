"use client"

import { motion } from "framer-motion"
import { Brain, Clock, Sparkles, Zap, Users, LineChart, Laptop, Cloud, Lock } from "lucide-react"
import { Header } from "../components/sections/Header"

const features = [
  {
    icon: Sparkles,
    title: "Algoritmo de repetición espaciada",
    description:
      "Nuestro sistema inteligente programa tus repasos en el momento óptimo para maximizar la retención a largo plazo. Basado en la curva del olvido de Ebbinghaus, el algoritmo se adapta a tu ritmo de aprendizaje.",
  },
  {
    icon: Brain,
    title: "Generación de flashcards con IA",
    description:
      "Crea flashcards instantáneamente a partir de cualquier texto con nuestra tecnología de inteligencia artificial. El sistema identifica conceptos clave y genera preguntas relevantes automáticamente.",
  },
  {
    icon: Clock,
    title: "Estudia en cualquier momento",
    description: 
      "Accede a tus flashcards desde cualquier dispositivo, incluso sin conexión a internet. La sincronización automática asegura que siempre tengas tu contenido actualizado.",
  },
  {
    icon: Zap,
    title: "Aprendizaje acelerado",
    description:
      "Técnicas de memorización avanzadas integradas en el sistema. Incluye mnemotecnia, asociación y visualización para mejorar la retención de información.",
  },
  {
    icon: Users,
    title: "Estudio colaborativo",
    description:
      "Comparte tus mazos de flashcards con otros estudiantes. Crea grupos de estudio y compite en rankings de aprendizaje para mantener la motivación.",
  },
  {
    icon: LineChart,
    title: "Análisis detallado",
    description:
      "Seguimiento completo de tu progreso con estadísticas detalladas. Identifica tus puntos fuertes y áreas de mejora con gráficos intuitivos.",
  },
  {
    icon: Laptop,
    title: "Multiplataforma",
    description:
      "Disponible en web, iOS y Android. Interfaz adaptativa que se ajusta a cualquier tamaño de pantalla para una experiencia óptima.",
  },
  {
    icon: Cloud,
    title: "Respaldo en la nube",
    description:
      "Tus flashcards siempre seguras con respaldo automático en la nube. Recupera versiones anteriores y nunca pierdas tu progreso.",
  },
  {
    icon: Lock,
    title: "Privacidad garantizada",
    description:
      "Cifrado de extremo a extremo para proteger tu información. Control total sobre la privacidad de tus mazos de flashcards.",
  },
]

export default function Features() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <section className="py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              className="text-center max-w-[800px] mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400 mb-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                Características
              </motion.div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-green-500 to-emerald-600 text-transparent bg-clip-text">
                Todo lo que necesitas para un aprendizaje efectivo
              </h1>
              <p className="mt-4 text-muted-foreground text-lg md:text-xl">
                Descubre todas las herramientas y funcionalidades que hacen de FlashLearn la mejor plataforma para estudiar con flashcards.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="flex flex-col gap-4 p-6 bg-background rounded-xl shadow-sm border hover:border-green-500 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <motion.div
                    className="p-3 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 w-fit dark:from-green-900/30 dark:to-emerald-900/30"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <feature.icon className="h-6 w-6 text-green-500" />
                  </motion.div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
} 