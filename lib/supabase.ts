import { createClient } from '@supabase/supabase-js'

// 确保在构建阶段不会崩溃
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock_key'

export const supabase = createClient(supabaseUrl, supabaseKey)