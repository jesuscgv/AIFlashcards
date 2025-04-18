"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client" // Import Supabase client
import { calculateSM2, mapDifficultyToQuality, SM2Item } from "@/lib/sm2" // Import SM-2 logic
import { Database } from "@/lib/supabase/database.types" // Import generated types (assuming you have them)

// Define the type for the fetched card data, including SM-2 fields
type ReviewCard = Database['public']['Tables']['cards']['Row'] & {
  // Supabase might return null for initial values, handle appropriately
  interval: number;
  repetitions: number;
  ease_factor: number; 
  next_review_at: string; // Supabase returns timestamp as string
}

export default function ReviewPage() {
  const supabase = createClient()
  const [cards, setCards] = useState<ReviewCard[]>([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDueCards = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      setError("Debes iniciar sesión para repasar.")
      setIsLoading(false)
      return
    }

    const today = new Date().toISOString()

    // Fetch cards where next_review_at is today or earlier
    const { data, error: fetchError } = await supabase
      .from('cards')
      .select('*')
      .eq('user_id', user.id)
      .lte('next_review_at', today) 
      .order('next_review_at', { ascending: true }) // Review oldest cards first
      // Add limit if needed, e.g., .limit(20)
      
    if (fetchError) {
      console.error("Error fetching cards:", fetchError)
      setError(`Error al cargar tarjetas: ${fetchError.message}`)
      setCards([])
    } else if (data) {
       // Ensure required SM-2 fields have default values if null/missing
       const processedCards = data.map((card: Database['public']['Tables']['cards']['Row']) => ({
          ...card,
          interval: card.interval ?? 0,
          repetitions: card.repetitions ?? 0,
          ease_factor: card.ease_factor ?? 2.5, // Default ease factor
          next_review_at: card.next_review_at ?? new Date().toISOString(), // Ensure it's a valid string
       })) as ReviewCard[]; // Type assertion
       setCards(processedCards)
       setCurrentCardIndex(0) // Reset index when new cards are loaded
    }
    
    setIsLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchDueCards()
  }, [fetchDueCards])

  const currentCard = cards.length > 0 ? cards[currentCardIndex] : null

  const handleFlip = () => {
    if (!isLoading && currentCard) {
      setIsFlipped(!isFlipped)
    }
  }

  const handleAnswer = async (difficulty: "easy" | "good" | "hard") => {
    if (!currentCard) return

    const quality = mapDifficultyToQuality(difficulty)
    const sm2Input: SM2Item = {
      interval: currentCard.interval,
      repetitions: currentCard.repetitions,
      easeFactor: currentCard.ease_factor,
    }

    const sm2Result = calculateSM2(sm2Input, quality)

    const nextReviewISO = sm2Result.nextReviewDate.toISOString()

    // Update card in Supabase
    const { error: updateError } = await supabase
      .from('cards')
      .update({
        interval: sm2Result.interval,
        repetitions: sm2Result.repetitions,
        ease_factor: sm2Result.easeFactor,
        next_review_at: nextReviewISO,
      })
      .eq('id', currentCard.id)

    if (updateError) {
      console.error("Error updating card:", updateError)
      setError(`Error al actualizar tarjeta: ${updateError.message}`)
      // Optionally handle the error more gracefully (e.g., retry, notify user)
      return // Don't proceed if update failed
    }

    // Move to the next card
    setIsFlipped(false) 
    setTimeout(() => {
       // If it was the last card, refetch or show completion message
       if (currentCardIndex >= cards.length - 1) {
         // Option 1: Refetch to see if more cards became due (less likely immediately)
         // fetchDueCards(); 
         // Option 2: Show completion message directly
         setCards([]) // Clear cards to show completion message
       } else {
         setCurrentCardIndex((prevIndex) => prevIndex + 1)
       }
    }, 300)
  }

  if (isLoading) {
    return <div className="container mx-auto py-10 px-4 text-center">Cargando tarjetas...</div>
  }

  if (error) {
    return <div className="container mx-auto py-10 px-4 text-center text-red-600">{error}</div>
  }

  if (!currentCard) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <h2 className="text-2xl font-semibold mb-4">¡Felicidades!</h2>
        <p>Has repasado todas tus tarjetas por hoy.</p>
        {/* Optional: Button to go back to dashboard or fetch more */}
        <Button onClick={fetchDueCards} className="mt-4">Buscar más tarjetas</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">Sesión de Repaso ({currentCardIndex + 1} / {cards.length})</h1>
      <div className="w-full max-w-xl perspective-[1000px]">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentCardIndex}
            initial={{ rotateY: isFlipped ? 180 : 0 }}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6 }}
            style={{ transformStyle: "preserve-3d", width: '100%', height: '250px' }} // Set fixed height for the container
            onClick={handleFlip} // Flip on click anywhere on the card
            className="relative cursor-pointer" // Make it clear it's clickable
          >
            {/* Front of the card */}
            <motion.div
              style={{ backfaceVisibility: "hidden" }}
              className="absolute inset-0"
            >
              <Card className="w-full h-full flex flex-col justify-center items-center shadow-lg">
                <CardHeader>
                  <CardTitle>Anverso</CardTitle>
                </CardHeader>
                <CardContent className="text-2xl text-center p-6">
                  {currentCard.front}
                </CardContent>
              </Card>
            </motion.div>

            {/* Back of the card */}
            <motion.div
              initial={{ rotateY: 180 }} // Start rotated
              animate={{ rotateY: isFlipped ? 0 : 180 }} // Counter-rotate to show
              style={{ backfaceVisibility: "hidden", transform: 'rotateY(180deg)' }} // Keep hidden initially
              className="absolute inset-0"
            >
              <Card className="w-full h-full flex flex-col justify-center items-center shadow-lg bg-secondary">
                <CardHeader>
                  <CardTitle>Reverso</CardTitle>
                </CardHeader>
                <CardContent className="text-xl text-center p-6">
                  {currentCard.back}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {isFlipped && (
        <motion.div 
          className="mt-8 flex justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button variant="destructive" onClick={() => handleAnswer("hard")}>Difícil</Button>
          <Button variant="outline" onClick={() => handleAnswer("good")}>Bien</Button>
          <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleAnswer("easy")}>Fácil</Button>
        </motion.div>
      )}
    </div>
  )
} 