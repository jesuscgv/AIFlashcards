"use client"

import { useState, useEffect } from "react"
import { createClient } from '@/lib/supabase/browser-client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import CreateDeckModal from "@/app/components/decks/CreateDeckModal"
import { DashboardLayout } from "@/app/components/layouts/DashboardLayout"
import { Database } from "@/lib/supabase/database.types"

type Deck = Database['public']['Tables']['decks']['Row']

export default function DashboardPage() {
  const supabase = createClient()
  const router = useRouter()
  const [decks, setDecks] = useState<Deck[]>([])
  const [loadingDecks, setLoadingDecks] = useState(true)
  const [errorDecks, setErrorDecks] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/auth')
          return
        }

        const { data, error } = await supabase
          .from('decks')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error

        setDecks(data)
      } catch (error: any) {
        console.error('Error fetching decks:', error)
        setErrorDecks(error.message)
      } finally {
        setLoadingDecks(false)
      }
    }

    fetchDecks()
  }, [router, supabase])

  const handleDeleteDeck = async (deckId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este mazo?')) {
      return
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth')
        return
      }

      const { error } = await supabase
        .from('decks')
        .delete()
        .eq('id', deckId)
        .eq('user_id', user.id)

      if (error) throw error

      setDecks(decks.filter(deck => deck.id !== deckId))
    } catch (error: any) {
      console.error('Error deleting deck:', error)
    }
  }

  const handleDeckCreated = (newDeck: Deck) => {
    setDecks([newDeck, ...decks])
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Mis Mazos</h1>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Crear Mazo
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Mazos de Flashcards</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingDecks && <p>Cargando mazos...</p>}
            {errorDecks && <p className="text-red-600">{errorDecks}</p>}
            {!loadingDecks && decks.length === 0 && (
              <p className="text-muted-foreground">No has creado ningún mazo todavía. ¡Crea uno para empezar!</p>
            )}
            {!loadingDecks && decks.length > 0 && (
              <ul className="space-y-3">
                {decks.map((deck) => (
                  <li key={deck.id} className="flex items-center justify-between rounded-md border p-3">
                    <Link href={`/decks/${deck.id}`} className="font-medium hover:underline">
                      {deck.name}
                    </Link>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <Link href={`/decks/${deck.id}/edit`} title="Editar Mazo">
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteDeck(deck.id)}
                        title="Eliminar Mazo"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <div className="bg-card rounded-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4">Repasar</h2>
          <p className="text-muted-foreground mb-4">Comienza una sesión de repaso con las tarjetas que te tocan hoy.</p>
          <Button asChild>
            <Link href="/review">Iniciar Repaso</Link>
          </Button>
        </div>

        <CreateDeckModal 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onDeckCreated={handleDeckCreated} 
        />
      </div>
    </DashboardLayout>
  )
} 