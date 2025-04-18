"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Database } from "@/lib/supabase/database.types"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

type Flashcard = Database["public"]["Tables"]["flashcards"]["Row"]

interface ReviewCardListProps {
  initialCards: Flashcard[]
}

export function ReviewCardList({ initialCards }: ReviewCardListProps) {
  const [cards] = useState(initialCards)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showBack, setShowBack] = useState(false)

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setShowBack(false)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
      setShowBack(false)
    }
  }

  const handleFlip = () => {
    setShowBack(prev => !prev)
  }

  const cardVariants = {
    hidden: {
      rotateY: showBack ? -180 : 0,
      opacity: 0
    },
    visible: {
      rotateY: showBack ? 180 : 0,
      opacity: 1,
      transition: {
        duration: 0.475,
        ease: "easeInOut"
      }
    },
    exit: {
      opacity: 0
    }
  }

  const textVariants = {
    hidden: {
      opacity: 0,
      transition: {
        duration: 0.1
      }
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.2,
        delay: 0.275
      }
    }
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">¡No hay tarjetas para revisar!</h2>
        <p className="text-muted-foreground">
          Has completado todas las tarjetas programadas para hoy.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="relative h-[400px] perspective-1000">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex + (showBack ? "-back" : "-front")}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Frente de la tarjeta */}
            <div
              className={cn(
                "absolute w-full h-full backface-hidden",
                "bg-card rounded-xl shadow-lg border border-border",
                "flex items-center justify-center p-8"
              )}
              style={{ backfaceVisibility: "hidden" }}
              onClick={handleFlip}
            >
              {!showBack && (
                <motion.div 
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-xl font-medium text-center"
                >
                  {cards[currentIndex].front}
                </motion.div>
              )}
            </div>

            {/* Reverso de la tarjeta */}
            <div
              className={cn(
                "absolute w-full h-full backface-hidden",
                "bg-card rounded-xl shadow-lg border border-border",
                "flex items-center justify-center p-8"
              )}
              style={{ 
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)"
              }}
              onClick={handleFlip}
            >
              {showBack && (
                <motion.div 
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-xl font-medium text-center"
                >
                  {cards[currentIndex].back}
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Anterior
        </Button>

        <div className="text-sm text-muted-foreground">
          {currentIndex + 1} de {cards.length}
        </div>

        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
        >
          Siguiente
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
} 