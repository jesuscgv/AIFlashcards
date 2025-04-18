"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

const plans = [
  {
    name: "Gratuito",
    price: "0€",
    description: "Perfecto para empezar",
    features: [
      "100 flashcards",
      "Algoritmo básico de repetición",
      "Exportación en PDF",
      "Acceso móvil",
    ],
  },
  {
    name: "Pro",
    price: "9.99€",
    period: "/mes",
    description: "Para estudiantes dedicados",
    features: [
      "Flashcards ilimitadas",
      "Algoritmo avanzado de repetición",
      "Generación con IA",
      "Estadísticas detalladas",
      "Sincronización en todos los dispositivos",
      "Modo sin conexión",
    ],
    popular: true,
  },
  {
    name: "Equipo",
    price: "29.99€",
    period: "/mes",
    description: "Ideal para instituciones",
    features: [
      "Todo lo incluido en Pro",
      "Hasta 50 usuarios",
      "Panel de administración",
      "Análisis de rendimiento grupal",
      "Soporte prioritario",
      "Personalización de marca",
    ],
  },
]

export function Pricing() {
  return (
    <section id="precios" className="py-20 md:py-32">
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
            Precios
          </motion.div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-green-500 to-emerald-600 text-transparent bg-clip-text">
            Planes que se adaptan a tus necesidades
          </h2>
          <p className="mt-4 text-muted-foreground md:text-xl">
            Elige el plan que mejor se ajuste a tu forma de estudiar
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`relative flex flex-col p-8 bg-background rounded-xl shadow-sm border ${
                plan.popular ? "border-green-500" : ""
              } hover:border-green-500 transition-colors`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-green-500 text-white text-sm rounded-full">
                  Más popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className="text-muted-foreground mt-2">{plan.description}</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={`mt-auto ${
                  plan.popular
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90"
                    : "bg-background hover:bg-muted"
                }`}
                variant={plan.popular ? "default" : "outline"}
              >
                Empezar {plan.name.toLowerCase()}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 