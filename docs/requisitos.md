# Documento de Especificación de Requisitos (v0.1)
## Flashcards Web‑App

### 1. Objetivo
Crear una aplicación web ligera que me ayude a preparar exámenes mediante tarjetas de memoria (flashcards). Si la app resulta útil, se abrirá la posibilidad de monetizarla para otros estudiantes.

### 2. Alcance
- Uso individual: cada usuario gestiona sus propios mazos.
- Sin rol de profesor ni funciones de aula.
- Integración futura de IA para generar flashcards a partir de texto.

### 3. Stack y dependencias clave
- **Frontend**: React + Vite + DaisyUI (sobre Tailwind).
- **Backend / BaaS**: Supabase  
  - Auth (email + OAuth)  
  - Base de datos Postgres  
  - Realtime para sincronizar mazos.
- **Pagos**: Stripe (suscripción premium).
- **Infra**: Docker, desplegable en Vercel / Fly.io (cualquiera con soporte para edge functions de Supabase).

### 4. Roles y casos de uso
| Rol | Descripción |
| --- | ----------- |
| Usuario | Registra sesión, crea mazos, repasa, ve estadísticas, gestiona suscripción. |
| Admin (futuro) | Solo para moderar y ver métricas de uso. No en MVP. |

### 5. Historias de usuario principales
- **U‑1**: _“Como usuario quiero importar un mazo en CSV para no crear las tarjetas una a una.”_
- **U‑2**: _“Como usuario quiero que la app me diga qué tarjetas repasar hoy basándose en spaced‑repetition.”_
- **U‑3**: _“Como usuario quiero pagar para desbloquear almacenamiento ilimitado de imágenes y backups automáticos.”_
- **U‑4 (futuro)**: _“Como usuario quiero subir un PDF o DOCX y que la IA me sugiera tarjetas.”_

### 6. Requisitos funcionales (RF)
| ID | Descripción |
|----|-------------|
| RF‑1 | Registro y login mediante Supabase Auth. |
| RF‑2 | CRUD de mazos y tarjetas con texto y opcionalmente imágenes. |
| RF‑3 | Algoritmo SM‑2 para repetición espaciada. |
| RF‑4 | Vista de repaso con atajos de teclado (desktop) y gestos swipe (móvil). |
| RF‑5 | Sincronización en tiempo real entre dispositivos utilizando Supabase. |
| RF‑6 | Estadísticas: tarjetas vistas hoy, tasa de aciertos, racha. |
| RF‑7 | Exportar / importar mazos en formato JSON o CSV. |
| RF‑8 | Gestión de subscripción Stripe (checkout, webhooks). |
| RF‑9 | Límite de 3 mazos y 300 tarjetas para cuentas gratuitas. |
| RF‑10 (futuro) | Generación de tarjetas vía IA a partir de archivo o texto pegado. |

### 7. Requisitos no funcionales (RNF)
- RNF‑1 Tiempo de render inicial < 2 s en conexiones 4G (~1 MB bundle).
- RNF‑2 PWA: modo offline para último mazo abierto.
- RNF‑3 Accesibilidad WCAG 2.1 AA.
- RNF‑4 99% uptime mensual (reflejando SLA de Supabase).
- RNF‑5 Pruebas unitarias y e2e con cobertura ≥ 80 %.
- RNF‑6 Internacionalización mínima (ES, EN) usando i18next.

### 8. MVP – listo cuando…
1. Registro/login → dashboard vacío.  
2. Crear mazo y tarjetas.  
3. Repasar con SM‑2 y estadísticas básicas.  
4. Límite de uso gratuito aplicado.  
5. Checkout Stripe activo y desbloqueo de límites.

### 9. Roadmap post‑MVP
- IA para auto‑generar mazos (OpenAI embeddings + RAG sobre resumen del documento).  
- Compartir mazos por enlace público.  
- App móvil nativa con React Native + Expo (si el PWA no cubre).  

### 10. Fuera de alcance (v0.1)
- Mercado de mazos de pago entre usuarios.  
- Colaboración en tiempo real.  
- Integraciones con LMS (Moodle, Blackboard…).

---

_Fecha: 18‑04‑2025_  
_Autor: Jesus (con ChatGPT)_

