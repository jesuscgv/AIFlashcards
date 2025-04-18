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
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { Database } from '@/lib/supabase/database.types'
import { User } from '@supabase/supabase-js'

type Deck = Database['public']['Tables']['decks']['Row']

interface CreateDeckModalProps {
  isOpen: boolean
  onClose: () => void
  onDeckCreated: (newDeck: Deck) => void
}

export default function CreateDeckModal({ isOpen, onClose, onDeckCreated }: CreateDeckModalProps) {
  const supabase = createClient()
  const [deckName, setDeckName] = useState('')
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

    if (!deckName.trim()) {
      setError("El nombre del mazo no puede estar vacío.")
      setIsLoading(false)
      return
    }

    try {
      const { data, error: insertError } = await supabase
        .from('decks')
        .insert({
          name: deckName.trim(),
          user_id: user.id,
        })
        .select() // Select the newly inserted row
        .single() // Expect only one row back

      if (insertError) {
        throw insertError
      }

      if (data) {
        onDeckCreated(data as Deck) // Pass the created deck back
        setDeckName('') // Reset form
        // onClose() is handled by the parent now via onDeckCreated
      } else {
        throw new Error("No se recibieron datos después de la inserción.")
      }

    } catch (error: any) {
      console.error("Error creating deck:", error)
      setError(`Error al crear el mazo: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Reset state when modal is closed/opened
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setDeckName('');
      setError(null);
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Mazo</DialogTitle>
          <DialogDescription>
            Dale un nombre a tu nuevo mazo de flashcards.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nombre
              </Label>
              <Input
                id="name"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                className="col-span-3"
                placeholder="Ej: Conceptos de React"
                disabled={isLoading}
              />
            </div>
            {error && <p className="text-red-600 text-sm col-span-4 text-center">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creando...' : 'Crear Mazo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 