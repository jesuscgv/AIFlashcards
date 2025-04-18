'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea" // Use Textarea for front/back
import { Label } from "@/components/ui/label"
import { createClient } from '@/lib/supabase/browser-client'
import { Database } from '@/lib/supabase/database.types'

type FlashCard = Database['public']['Tables']['flashcards']['Row']

interface CreateCardModalProps {
  isOpen: boolean
  onClose: () => void
  onCardCreated: (newCard: FlashCard) => void
  deckId: string // Need the deckId to associate the card
}

export default function CreateCardModal({ 
    isOpen, 
    onClose, 
    onCardCreated, 
    deckId 
}: CreateCardModalProps) {
  const supabase = createClient()
  const [front, setFront] = useState('')
  const [back, setBack] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      setError("No se pudo autenticar al usuario. Intenta iniciar sesión de nuevo.")
      setIsLoading(false)
      return
    }

    if (!front.trim() || !back.trim()) {
      setError("Los campos Anverso y Reverso no pueden estar vacíos.")
      setIsLoading(false)
      return
    }

    try {
      // Default SM-2 values are handled by DB defaults, but you could set them here too
      const { data, error: insertError } = await supabase
        .from('cards')
        .insert({
          front: front.trim(),
          back: back.trim(),
          deck_id: deckId,
          user_id: user.id,
          // next_review_at defaults to now() in DB
        })
        .select() 
        .single()

      if (insertError) {
        throw insertError
      }

      if (data) {
        onCardCreated(data as FlashCard) // Pass the created card back
        setFront('') // Reset form
        setBack('')
        // Parent closes the modal via onCardCreated
      } else {
        throw new Error("No se recibieron datos después de la inserción de la tarjeta.")
      }

    } catch (error: any) {
      console.error("Error creating card:", error)
      setError(`Error al crear la tarjeta: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Reset state when modal is closed/opened
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setFront('');
      setBack('');
      setError(null);
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Añadir Nueva Tarjeta</DialogTitle>
          <DialogDescription>
            Introduce el contenido para el anverso y reverso.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="front">Anverso</Label>
              <Textarea
                id="front"
                value={front}
                onChange={(e) => setFront(e.target.value)}
                placeholder="Ej: ¿Capital de Francia?"
                disabled={isLoading}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="back">Reverso</Label>
              <Textarea
                id="back"
                value={back}
                onChange={(e) => setBack(e.target.value)}
                placeholder="Ej: París"
                disabled={isLoading}
                rows={3}
              />
            </div>
            {error && <p className="text-red-600 text-sm text-center pt-2">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creando...' : 'Añadir Tarjeta'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 