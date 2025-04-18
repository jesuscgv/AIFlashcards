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
import { createClient } from '@/lib/supabase/browser-client'
import { Database } from '@/lib/supabase/database.types'
import { User } from '@supabase/supabase-js'

type Deck = Database['public']['Tables']['decks']['Row']

interface CreateDeckModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateDeck: (name: string) => Promise<void>
}

export default function CreateDeckModal({ isOpen, onClose, onCreateDeck }: CreateDeckModalProps) {
  const supabase = createClient()
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      setError("No se pudo autenticar al usuario. Intenta iniciar sesión de nuevo.")
      setIsLoading(false)
      return
    }

    if (!name.trim()) {
      setError("El nombre del mazo no puede estar vacío.")
      setIsLoading(false)
      return
    }

    try {
      await onCreateDeck(name.trim())
      setName('')
      onClose()
    } catch (error: any) {
      console.error("Error creating deck:", error)
      setError(`Error al crear el mazo: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear nuevo mazo</DialogTitle>
          <DialogDescription>
            Ingresa un nombre para tu nuevo mazo de flashcards.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre del mazo</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Vocabulario de español"
                disabled={isLoading}
              />
            </div>
            {error && <p className="text-red-600 text-sm col-span-4 text-center">{error}</p>}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || !name.trim()}>
              {isLoading ? "Creando..." : "Crear mazo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 