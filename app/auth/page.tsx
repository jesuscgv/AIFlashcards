'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/lib/supabase/client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation' // Use next/navigation for App Router

export default function AuthPage() {
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const subscription = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        // Redirect to dashboard after sign in
        router.push('/dashboard') 
      }
      // Optional: Handle other events like SIGNED_OUT if needed
    })

    // Cleanup subscription on component unmount
    return () => {
      subscription.data.subscription.unsubscribe()
    }
  }, [supabase, router])

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border bg-card p-8 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-semibold">Iniciar Sesión / Registrarse</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={['google', 'github']} // Add OAuth providers if configured in Supabase
          redirectTo="/auth/callback" // Ensure you have this callback route set up if using OAuth
          localization={{
            variables: {
              sign_in: {
                email_label: 'Correo electrónico',
                password_label: 'Contraseña',
                email_input_placeholder: 'tu@email.com',
                password_input_placeholder: 'Tu contraseña',
                button_label: 'Iniciar sesión',
                loading_button_label: 'Iniciando sesión...',
                social_provider_text: 'Continuar con {{provider}}',
                link_text: '¿Ya tienes cuenta? Inicia sesión',
                confirmation_text: 'Revisa tu correo para el enlace de confirmación.',
              },
              sign_up: {
                email_label: 'Correo electrónico',
                password_label: 'Contraseña',
                email_input_placeholder: 'tu@email.com',
                password_input_placeholder: 'Crea una contraseña',
                button_label: 'Registrarse',
                loading_button_label: 'Registrando...',
                social_provider_text: 'Continuar con {{provider}}',
                link_text: '¿No tienes cuenta? Regístrate',
                confirmation_text: 'Revisa tu correo para el enlace de confirmación.',
              },
              forgotten_password: {
                email_label: 'Correo electrónico',
                password_label: 'Contraseña',
                email_input_placeholder: 'tu@email.com',
                button_label: 'Enviar instrucciones',
                loading_button_label: 'Enviando...',
                link_text: '¿Olvidaste tu contraseña?',
                confirmation_text: 'Revisa tu correo para el enlace de reseteo.',
              },
              // Add more localization as needed
            },
          }}
        />
      </div>
    </div>
  )
} 