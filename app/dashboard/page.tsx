'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Database } from '@/lib/supabase/database.types'
import CreateDeckModal from '@/app/components/decks/CreateDeckModal'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { PlusCircle, Trash2, Edit } from 'lucide-react'

// Define Deck type based on your schema
type Deck = Database['public']['Tables']['decks']['Row']

export default function DashboardPage() {
  const supabase = createClient()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [decks, setDecks] = useState<Deck[]>([])
  const [loadingDecks, setLoadingDecks] = useState(true)
  const [errorDecks, setErrorDecks] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const fetchDecks = useCallback(async (userId: string) => {
    setLoadingDecks(true)
    setErrorDecks(null)
    try {
      const { data, error } = await supabase
        .from('decks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }
      setDecks(data || [])
    } catch (error: any) {
      console.error('Error fetching decks:', error)
      setErrorDecks(`Error al cargar mazos: ${error.message}`)
      setDecks([])
    } finally {
      setLoadingDecks(false)
    }
  }, [supabase])

  useEffect(() => {
    let isMounted = true;
    const getUserAndDecks = async () => {
      setLoading(true);
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
         if (isMounted) {
           router.push('/auth')
           setLoading(false);
         }
         return;
      }
      
      if (isMounted) {
          setUser(user)
          await fetchDecks(user.id)
          setLoading(false)
      }
    }
    
    getUserAndDecks()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        if (!isMounted) return;
        
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (event === 'SIGNED_OUT') {
            setDecks([])
            router.push('/auth');
        } else if (event === 'SIGNED_IN' && currentUser) {
            fetchDecks(currentUser.id)
        } 
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };

  }, [supabase, router, fetchDecks])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const handleDeckCreated = (newDeck: Deck) => {
    setDecks(prevDecks => [newDeck, ...prevDecks])
    setIsCreateModalOpen(false)
  }

  const handleDeleteDeck = async (deckId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este mazo y todas sus tarjetas? Esta acción no se puede deshacer.')) {
      return;
    }
    alert(`Implementar eliminación para el mazo: ${deckId}`);
  }

  if (loading) {
    return <div className="container mx-auto py-10 px-4 text-center">Cargando...</div>
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Panel de Control</h1>
        {user && (
          <div className='flex items-center gap-4'>
             <span className='text-muted-foreground text-sm'>{user.email}</span>
             <Button variant="outline" onClick={handleSignOut}>Cerrar Sesión</Button>
          </div>
        )}
      </div>
      
      <p className='mb-6'>¡Bienvenido a tu panel! Desde aquí podrás gestionar tus mazos y tarjetas.</p>
      
      {/* Deck List/Creation Section */}
      <Card className="mt-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Mis Mazos</CardTitle>
          <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Crear Mazo
          </Button>
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

      {/* Link to Review Session */}
       <div className="mt-8 p-6 border rounded-lg bg-card">
         <h2 className="text-xl font-semibold mb-4">Repasar</h2>
         <p className="text-muted-foreground mb-4">Comienza una sesión de repaso con las tarjetas que te tocan hoy.</p>
         <Button asChild>
            <Link href="/review">Iniciar Repaso</Link>
         </Button>
       </div>

      {/* Create Deck Modal */} 
      <CreateDeckModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onDeckCreated={handleDeckCreated} 
      />
    </div>
  )
} 