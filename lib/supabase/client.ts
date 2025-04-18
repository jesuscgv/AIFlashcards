import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Use environment variables in a real application
  const supabaseUrl = "https://nbldgegchqibizwstenx.supabase.co"
  const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ibGRnZWdjaHFpYml6d3N0ZW54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTUzMTksImV4cCI6MjA2MDU3MTMxOX0.lLnZCgOAQdb-YE_D3QjMWvSwfWZPYAGvxwh4ICEIshY"

  return createBrowserClient(supabaseUrl!, supabaseAnonKey!)
} 