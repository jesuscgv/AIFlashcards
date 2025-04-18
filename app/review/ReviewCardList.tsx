'use client'

import { useState } from 'react'
import ReviewCard from './ReviewCard'
import { createClient } from '@/lib/supabase/browser-client'
import { Database } from '@/lib/supabase/database.types'

type ReviewCardType = Database['public']['Tables']['flashcards']['Row'] & {
  interval: number
  repetitions: number
  ease_factor: number
  next_review_at: string
}

interface ReviewCardListProps {
  initialCards: ReviewCardType[]
}

export default function ReviewCardList({ initialCards }: ReviewCardListProps) {
  const [cards, setCards] = useState(initialCards)
  const supabase = createClient()

  const handleReview = async (cardId: string, difficulty: number) => {
    const card = cards.find(c => c.id === cardId)
    if (!card) return

    // Calcular nuevo intervalo usando SM-2
    const now = new Date()
    const newInterval = Math.ceil(card.interval * card.ease_factor)
    const nextReview = new Date(now.getTime() + newInterval * 24 * 60 * 60 * 1000)

    // Actualizar la tarjeta en Supabase
    const { error } = await supabase
      .from('flashcards')
      .update({
        interval: newInterval,
        repetitions: card.repetitions + 1,
        ease_factor: Math.max(1.3, card.ease_factor + (0.1 - (5 - difficulty) * (0.08 + (5 - difficulty) * 0.02))),
        next_review_at: nextReview.toISOString()
      })
      .eq('id', cardId)

    if (error) {
      console.error('Error updating flashcard:', error)
      return
    }

    // Remover la tarjeta de la lista
    setCards(cards.filter(c => c.id !== cardId))
  }

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <h2 className="text-xl font-semibold mb-2">¡Felicitaciones!</h2>
        <p>Has completado todas las tarjetas para revisar.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {cards.map((card) => (
        <ReviewCard
          key={card.id}
          card={card}
          onReview={handleReview}
        />
      ))}
    </div>
  )
} 