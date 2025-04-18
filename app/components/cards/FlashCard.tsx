'use client'

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface FlashCardProps {
  front: string
  back: string
  isFlipped: boolean
  onFlip: () => void
}

export default function FlashCard({ front, back, isFlipped, onFlip }: FlashCardProps) {
  return (
    <div 
      onClick={onFlip}
      className="relative w-full h-[400px] cursor-pointer perspective-1000"
    >
      <motion.div
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className={cn(
          "absolute w-full h-full preserve-3d",
          "rounded-xl shadow-lg border border-border"
        )}
      >
        {/* Front of card */}
        <div className={cn(
          "absolute w-full h-full backface-hidden",
          "bg-card text-card-foreground",
          "flex items-center justify-center p-6",
          "rounded-xl"
        )}>
          <p className="text-xl font-medium text-center">{front}</p>
        </div>

        {/* Back of card */}
        <div 
          style={{ transform: 'rotateY(180deg)' }}
          className={cn(
            "absolute w-full h-full backface-hidden",
            "bg-card text-card-foreground",
            "flex items-center justify-center p-6",
            "rounded-xl"
          )}
        >
          <div style={{ transform: 'rotateY(180deg)' }} className="w-full">
            <p className="text-xl font-medium text-center">{back}</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 