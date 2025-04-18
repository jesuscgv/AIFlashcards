'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/browser-client'
import { Database } from '@/lib/supabase/database.types'
import { User } from '@supabase/supabase-js'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, PlusCircle, Trash2, Edit } from 'lucide-react'
import CreateCardModal from '@/app/components/cards/CreateCardModal'
// We will create these components next
// import CardItem from '@/components/cards/CardItem'

type Deck = Database['public']['Tables']['decks']['Row']
type FlashCard = Database['public']['Tables']['cards']['Row']

export default function DeckDetailPage() {
  const supabase = createClient()
  const router = useRouter()
  const params = useParams()
  const deckId = params.deckId as string // Get deckId from URL

  const [user, setUser] = useState<User | null>(null)
  const [deck, setDeck] = useState<Deck | null>(null)
  const [cards, setCards] = useState<FlashCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreateCardModalOpen, setIsCreateCardModalOpen] = useState(false)

  const fetchData = useCallback(async (currentUserId: string) => {
    setLoading(true)
    setError(null)
    try {
      // Fetch deck details
      const { data: deckData, error: deckError } = await supabase
        .from('decks')
        .select('*')
        .eq('id', deckId)
        .eq('user_id', currentUserId) // Ensure user owns the deck
        .single()

      if (deckError) {
        if (deckError.code === 'PGRST116') { // code for "Not found"
             throw new Error("Mazo no encontrado o no tienes permiso para verlo.")
        } else {
            throw deckError
        }
      }
      setDeck(deckData)

      // Fetch cards for the deck
      const { data: cardsData, error: cardsError } = await supabase
        .from('cards')
        .select('*')
        .eq('deck_id', deckId)
        .eq('user_id', currentUserId) // Redundant check, but good practice
        .order('created_at', { ascending: true })

      if (cardsError) {
        throw cardsError
      }
      setCards(cardsData || [])

    } catch (err: any) {
      console.error("Error fetching deck data:", err)
      setError(err.message || "Ocurrió un error al cargar los datos del mazo.")
      setDeck(null)
      setCards([])
    } finally {
      setLoading(false)
    }
  }, [supabase, deckId])

  useEffect(() => {
    const getUserAndData = async () => {
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      if (userError || !currentUser) {
        router.push('/auth'); // Redirect if not logged in
        return;
      }
      setUser(currentUser);
      fetchData(currentUser.id);
    };
    getUserAndData();

     // Optional: Listen for auth changes (e.g., sign out)
     const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT') {
            router.push('/auth');
        }
        // Potentially refetch data if user changes, though unlikely here
    });

    return () => {
      authListener.subscription.unsubscribe();
    };

  }, [supabase, router, fetchData])

  const handleCardCreated = (newCard: FlashCard) => {
      setCards(prevCards => [...prevCards, newCard]);
      setIsCreateCardModalOpen(false);
  };

  const handleCardDeleted = (deletedCardId: string) => {
      setCards(prevCards => prevCards.filter(card => card.id !== deletedCardId));
  };
  
  // TODO: Implement update logic
  const handleCardUpdated = (updatedCard: FlashCard) => {
      setCards(prevCards => prevCards.map(card => card.id === updatedCard.id ? updatedCard : card));
  };

  if (loading) {
    return <div className="container mx-auto py-10 px-4 text-center">Cargando datos del mazo...</div>
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Button variant="outline" asChild>
          <Link href="/dashboard">
             <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Panel
          </Link>
        </Button>
      </div>
    )
  }

  if (!deck) {
     // This case should ideally be handled by the error state, but as a fallback
     return <div className="container mx-auto py-10 px-4 text-center">Mazo no encontrado.</div>
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Button variant="outline" size="sm" className="mb-6" asChild>
         <Link href="/dashboard">
           <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Panel
         </Link>
      </Button>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">{deck.name}</CardTitle>
          <CardDescription>Gestiona las tarjetas de este mazo.</CardDescription> 
          {/* TODO: Add Deck Edit button here? */}
        </CardHeader>
        <CardContent>
          <Button onClick={() => setIsCreateCardModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Añadir Tarjeta
          </Button>
        </CardContent>
      </Card>

      <h2 className="text-xl font-semibold mb-4">Tarjetas en "{deck.name}" ({cards.length})</h2>
      
      {cards.length === 0 ? (
        <p className="text-muted-foreground">Este mazo aún no tiene tarjetas. ¡Añade la primera!</p>
      ) : (
        <div className="space-y-4">
          {cards.map((card) => (
            // Replace with CardItem component once created
            <Card key={card.id} className="flex justify-between items-start p-4">
               <div className="flex-1 mr-4">
                   <p className="font-medium">Anverso:</p>
                   <p className="text-muted-foreground mb-2 break-words">{card.front}</p>
                   <p className="font-medium">Reverso:</p>
                   <p className="text-muted-foreground break-words">{card.back}</p>
               </div>
               <div className="flex flex-col gap-2">
                   <Button variant="outline" size="sm" disabled> {/* TODO: Implement Edit */}
                       <Edit className="mr-1 h-4 w-4" /> Editar
                   </Button>
                   <Button variant="destructive" size="sm" disabled> {/* TODO: Implement Delete */}
                       <Trash2 className="mr-1 h-4 w-4" /> Eliminar
                   </Button>
               </div>
             </Card>
            // <CardItem 
            //   key={card.id} 
            //   card={card} 
            //   onDelete={() => alert('Implement delete card')} 
            //   onEdit={() => alert('Implement edit card')}
            // />
          ))}
        </div>
      )}

      <CreateCardModal 
        isOpen={isCreateCardModalOpen}
        onClose={() => setIsCreateCardModalOpen(false)}
        onCardCreated={handleCardCreated}
        deckId={deckId}
      />
    </div>
  )
} 