"use client"

import { motion } from "framer-motion"
import { Brain, Clock, Sparkles } from "lucide-react"

const features = [
  {
    icon: Sparkles,
    title: "Algoritmo de repetición espaciada",
    description:
      "Nuestro sistema inteligente programa tus repasos en el momento óptimo para maximizar la retención a largo plazo.",
  },
  {
    icon: Brain,
    title: "Generación de flashcards con IA",
    description:
      "Crea flashcards instantáneamente a partir de cualquier texto con nuestra tecnología de inteligencia artificial.",
  },
  {
    icon: Clock,
    title: "Estudia en cualquier momento",
    description: "Accede a tus flashcards desde cualquier dispositivo, incluso sin conexión a internet.",
  },
]

export function Features() {
  return (
    <section id="caracteristicas" className="py-20 md:py-32">
      <div className="container px-4 md:px-6">
        <motion.div
          className="text-center max-w-[800px] mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400 mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            Características
          </motion.div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-green-500 to-emerald-600 text-transparent bg-clip-text">
            Todo lo que necesitas para un aprendizaje efectivo
          </h2>
          <p className="mt-4 text-muted-foreground md:text-xl">
            Nuestra plataforma está diseñada para maximizar la retención y hacer que el estudio sea más eficiente.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="flex flex-col gap-4 p-6 bg-background rounded-xl shadow-sm border hover:border-green-500 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
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
  )
} 