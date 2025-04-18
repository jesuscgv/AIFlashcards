import './globals.css'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import { ThemeProvider } from '@/components/providers/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'FlashLearn - Aprende más rápido',
  description: 'Plataforma de flashcards para aprendizaje efectivo',
}

function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="mt-2">Cargando...</p>
      </div>
    </div>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={<Loading />}>
            {children}
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  )
}
