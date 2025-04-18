import { Suspense } from 'react'
import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { createServerSideClient } from '@/lib/supabase/server-client'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import FlashCard from '@/components/cards/FlashCard'
import { Database } from '@/lib/supabase/database.types'

type Flashcard = Database['public']['Tables']['flashcards']['Row']

async function getFlashcards(deckId: string) {
  const supabase = await createServerSideClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    redirect('/auth')
  }

  const { data: flashcards, error } = await supabase
    .from('flashcards')
    .select('*')
    .eq('deck_id', deckId)
    .eq('user_id', session.user.id)

  if (error) {
    throw new Error('Error al cargar los flashcards')
  }

  return flashcards
}

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="mt-2">Cargando flashcards...</p>
      </div>
    </div>
  )
}

function ReviewContent({ flashcards }: { flashcards: Flashcard[] }) {
  'use client'
  
  const [currentIndex, setCurrentIndex] = useState(0)
  const [shuffledCards, setShuffledCards] = useState<Flashcard[]>([])

  useEffect(() => {
    // Mezclar los flashcards al cargar
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5)
    setShuffledCards(shuffled)
  }, [flashcards])

  const handleNext = () => {
    if (currentIndex < shuffledCards.length - 1) {
      setCurrentIndex((prev: number) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev: number) => prev - 1)
    }
  }

  if (shuffledCards.length === 0) {
    return (
      <div className="text-center">
        <p>No hay flashcards en este mazo</p>
      </div>
    )
  }

  const currentCard = shuffledCards[currentIndex]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-lg">
        <FlashCard 
          front={currentCard.front} 
          back={currentCard.back}
        />
        
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50"
          >
            Anterior
          </button>
          
          <span className="self-center">
            {currentIndex + 1} de {shuffledCards.length}
          </span>
          
          <button
            onClick={handleNext}
            disabled={currentIndex === shuffledCards.length - 1}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  )
}

export default async function ReviewPage({ params }: { params: { deckId: string } }) {
  const flashcards = await getFlashcards(params.deckId)

  return (
    <Suspense fallback={<Loading />}>
      <ReviewContent flashcards={flashcards} />
    </Suspense>
  )
} 