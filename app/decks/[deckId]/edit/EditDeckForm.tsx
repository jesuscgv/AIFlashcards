'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/browser-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Database } from "@/lib/supabase/database.types"

type Deck = Database["public"]["Tables"]["decks"]["Row"]
type Flashcard = Database["public"]["Tables"]["flashcards"]["Row"]

interface EditDeckFormProps {
  deckId: string
}

export default function EditDeckForm({ deckId }: EditDeckFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deck, setDeck] = useState<Deck | null>(null)
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])

  useEffect(() => {
    const fetchDeck = async () => {
      try {
        const { data: deck, error: deckError } = await supabase
          .from("decks")
          .select("*")
          .eq("id", deckId)
          .single()

        if (deckError) throw deckError

        const { data: cards, error: cardsError } = await supabase
          .from("flashcards")
          .select("*")
          .eq("deck_id", deckId)
          .order("created_at", { ascending: true })

        if (cardsError) throw cardsError

        setDeck(deck)
        setFlashcards(cards || [])
      } catch (error: any) {
        toast.error("Error al cargar el mazo")
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDeck()
  }, [deckId, supabase])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)

    try {
      const formData = new FormData(e.currentTarget)
      const name = formData.get("title") as string
      const description = formData.get("description") as string

      // Actualizar el mazo
      const { error: deckError } = await supabase
        .from("decks")
        .update({ name, description })
        .eq("id", deckId)

      if (deckError) throw deckError

      // Actualizar las tarjetas
      const cardUpdates = flashcards.map((card, index) => {
        const front = formData.get(`card-front-${index}`) as string
        const back = formData.get(`card-back-${index}`) as string
        return supabase
          .from("flashcards")
          .update({ front, back })
          .eq("id", card.id)
      })

      const results = await Promise.all(cardUpdates)
      const errors = results.filter(result => result.error)

      if (errors.length > 0) {
        throw new Error("Error al actualizar algunas tarjetas")
      }

      toast.success("Mazo actualizado correctamente")
      router.push("/dashboard")
    } catch (error: any) {
      toast.error("Error al guardar los cambios")
      console.error("Error:", error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return null // El Suspense mostrará el skeleton
  }

  if (!deck) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-2">Mazo no encontrado</h2>
        <p className="text-muted-foreground mb-4">
          El mazo que intentas editar no existe o no tienes acceso a él.
        </p>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          Volver al panel
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Editar Mazo</h1>
        <Input
          name="title"
          defaultValue={deck.name}
          placeholder="Título del mazo"
          required
        />
        <Textarea
          name="description"
          defaultValue={deck.description || ""}
          placeholder="Descripción (opcional)"
          rows={3}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Tarjetas</h2>
        <div className="grid gap-4">
          {flashcards.map((card, index) => (
            <div key={card.id} className="grid gap-4">
              <Textarea
                name={`card-front-${index}`}
                defaultValue={card.front}
                placeholder="Frente de la tarjeta"
                required
              />
              <Textarea
                name={`card-back-${index}`}
                defaultValue={card.back}
                placeholder="Reverso de la tarjeta"
                required
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard")}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>
    </form>
  )
} 