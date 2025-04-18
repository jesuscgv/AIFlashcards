'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Database } from '@/lib/supabase/database.types'
import FlashCard from '../components/cards/FlashCard'

type ReviewCardType = Database['public']['Tables']['flashcards']['Row'] & {
  interval: number
  repetitions: number
  ease_factor: number
  next_review_at: string
}

interface ReviewCardProps {
  card: ReviewCardType
  onReview: (cardId: string, difficulty: number) => void
}

export default function ReviewCard({ card, onReview }: ReviewCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleDifficulty = (difficulty: number) => {
    onReview(card.id, difficulty)
    setIsFlipped(false)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <FlashCard 
        front={card.front}
        back={card.back}
        isFlipped={isFlipped}
        onFlip={handleFlip}
      />

      {isFlipped && (
        <div className="mt-4 flex justify-center gap-2">
          <Button 
            variant="destructive" 
            onClick={() => handleDifficulty(1)}
          >
            Difícil
          </Button>
          <Button 
            variant="outline"
            onClick={() => handleDifficulty(2)}
          >
            Medio
          </Button>
          <Button 
            variant="default"
            onClick={() => handleDifficulty(3)}
          >
            Fácil
          </Button>
        </div>
      )}
    </div>
  )
} 