'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/browser-client'
import { Database } from '@/lib/supabase/database.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'

type Flashcard = Database['public']['Tables']['flashcards']['Row']

export default function FlashcardList({ deckId }: { deckId: string }) {
  const router = useRouter()
  const supabase = createClient()
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingFlashcard, setEditingFlashcard] = useState<Flashcard | null>(null)
  const [front, setFront] = useState('')
  const [back, setBack] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/auth')
          return
        }

        const { data, error } = await supabase
          .from('flashcards')
          .select('*')
          .eq('deck_id', deckId)
          .eq('user_id', user.id)
          .order('created_at', { ascending: true })

        if (error) throw error

        setFlashcards(data)
      } catch (error: any) {
        console.error('Error fetching flashcards:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [deckId, router, supabase])

  const handleOpenDialog = (flashcard?: Flashcard) => {
    if (flashcard) {
      setEditingFlashcard(flashcard)
      setFront(flashcard.front)
      setBack(flashcard.back)
    } else {
      setEditingFlashcard(null)
      setFront('')
      setBack('')
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingFlashcard(null)
    setFront('')
    setBack('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth')
        return
      }

      if (editingFlashcard) {
        const { error } = await supabase
          .from('flashcards')
          .update({
            front,
            back,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingFlashcard.id)
          .eq('user_id', user.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('flashcards')
          .insert({
            deck_id: deckId,
            front,
            back,
            user_id: user.id,
          })

        if (error) throw error
      }

      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('deck_id', deckId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

      if (error) throw error

      setFlashcards(data)
      handleCloseDialog()
    } catch (error: any) {
      console.error('Error saving flashcard:', error)
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (flashcard: Flashcard) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta flashcard?')) {
      return
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth')
        return
      }

      const { error } = await supabase
        .from('flashcards')
        .delete()
        .eq('id', flashcard.id)
        .eq('user_id', user.id)

      if (error) throw error

      const { data, error: fetchError } = await supabase
        .from('flashcards')
        .select('*')
        .eq('deck_id', deckId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

      if (fetchError) throw fetchError

      setFlashcards(data)
    } catch (error: any) {
      console.error('Error deleting flashcard:', error)
      setError(error.message)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="mt-2">Cargando flashcards...</p>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Flashcards</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Añadir Flashcard
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingFlashcard ? 'Editar Flashcard' : 'Añadir Flashcard'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="front" className="block text-sm font-medium mb-1">
                  Frente
                </label>
                <Textarea
                  id="front"
                  value={front}
                  onChange={(e) => setFront(e.target.value)}
                  required
                  placeholder="Escribe la pregunta o el frente de la flashcard"
                />
              </div>
              <div>
                <label htmlFor="back" className="block text-sm font-medium mb-1">
                  Reverso
                </label>
                <Textarea
                  id="back"
                  value={back}
                  onChange={(e) => setBack(e.target.value)}
                  required
                  placeholder="Escribe la respuesta o el reverso de la flashcard"
                />
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    'Guardar'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {flashcards.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No hay flashcards en este mazo. ¡Añade algunas!
          </p>
        ) : (
          <div className="space-y-4">
            {flashcards.map((flashcard) => (
              <Card key={flashcard.id}>
                <CardContent className="p-4">
                  <div className="grid grid-cols-[1fr,auto] gap-4">
                    <div className="space-y-2">
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground">Frente</h4>
                        <p className="mt-1">{flashcard.front}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground">Reverso</h4>
                        <p className="mt-1">{flashcard.back}</p>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleOpenDialog(flashcard)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleDelete(flashcard)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 