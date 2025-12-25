import { createClient } from '@supabase/supabase-js'

// ⚠️ SUBSTITUA AQUI PELOS DADOS QUE VOCÊ PEGOU NO SITE
const supabaseUrl = 'https://uubckyfbrxshyxfeqdiq.supabase.co'
const supabaseKey = 'sb_publishable_GAwQljYXjingUVvGRj1tVg_wuua_bNA'

export const supabase = createClient(supabaseUrl, supabaseKey)