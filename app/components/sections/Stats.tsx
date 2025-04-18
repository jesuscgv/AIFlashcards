"use client"

import { motion } from "framer-motion"

const stats = [
  { value: "10M+", label: "Flashcards creadas" },
  { value: "500K+", label: "Usuarios activos" },
  { value: "95%", label: "Tasa de retención" },
  { value: "4.9/5", label: "Valoración promedio" },
]

export function Stats() {
  return (
    <section className="border-y bg-muted/50">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <motion.h3
                className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-transparent bg-clip-text"
                initial={{ scale: 0.5 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2, type: "spring" }}
                viewport={{ once: true }}
              >
                {stat.value}
              </motion.h3>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 