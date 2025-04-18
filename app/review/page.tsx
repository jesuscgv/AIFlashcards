"use client"

import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { ReviewLayout } from "@/app/components/layouts/ReviewLayout"
import { ReviewCardList } from "@/app/components/cards/ReviewCardList"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/browser-client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Database } from "@/lib/supabase/database.types"

type Flashcard = Database["public"]["Tables"]["flashcards"]["Row"]

export default function ReviewPage() {
  const router = useRouter()
  const supabase = createClient()
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push("/auth")
          return
        }

        const { data, error } = await supabase
          .from("flashcards")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (error) throw error

        setFlashcards(data)
      } catch (error: any) {
        console.error("Error fetching flashcards:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchFlashcards()
  }, [router, supabase])

  if (loading) {
    return (
      <ReviewLayout>
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64 mt-2" />
            </div>
            <Skeleton className="h-10 w-24" />
          </div>
          <Skeleton className="h-[400px] w-full" />
        </div>
      </ReviewLayout>
    )
  }

  if (error) {
    return (
      <ReviewLayout>
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-600">Error al cargar las tarjetas</h1>
          <p className="text-muted-foreground">{error}</p>
          <Button variant="outline" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al panel
            </Link>
          </Button>
        </div>
      </ReviewLayout>
    )
  }

  if (!flashcards || flashcards.length === 0) {
    return (
      <ReviewLayout>
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-2xl font-bold">¡No hay tarjetas para revisar!</h1>
          <p className="text-muted-foreground">
            Todas tus tarjetas están al día. Vuelve más tarde o crea nuevas tarjetas.
          </p>
          <Button variant="outline" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al panel
            </Link>
          </Button>
        </div>
      </ReviewLayout>
    )
  }

  return (
    <ReviewLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Sesión de Repaso</h1>
            <p className="text-muted-foreground mt-1">
              {flashcards.length} tarjetas para revisar
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al panel
            </Link>
          </Button>
        </div>

        <Suspense
          fallback={
            <div className="space-y-4">
              <Skeleton className="h-[400px] w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          }
        >
          <ReviewCardList initialCards={flashcards} />
        </Suspense>
      </div>
    </ReviewLayout>
  )
} 