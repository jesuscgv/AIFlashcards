import { Suspense } from 'react'
import EditDeckForm from './EditDeckForm'
import { DeckFormSkeleton } from '@/app/components/skeletons/DeckFormSkeleton'

interface Props {
  params: {
    deckId: string
  }
}

export default function EditDeckPage({ params }: Props) {
  const { deckId } = params

  return (
    <Suspense fallback={
      <div className="container mx-auto py-8">
        <DeckFormSkeleton />
      </div>
    }>
      <EditDeckForm deckId={deckId} />
    </Suspense>
  )
} 