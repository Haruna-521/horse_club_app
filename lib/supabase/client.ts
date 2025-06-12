
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
// Supabaseクライアント設定
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, //セッション情報（認証トークンなど）をブラウザに紐づくローカルストレージに保存
    autoRefreshToken: true, // トークンの有効期限が近づいたら自動で更新する
    detectSessionInUrl: true, // URLにセッション情報がある場合、それを検出してログイン状態を初期化する
  }
})

//これ↓はV0の初期コード
//   export function createClient() {
//   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
//  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

//   if (!supabaseUrl || !supabaseAnonKey) {
//     console.error("Missing Supabase environment variables:", {
//       url: !!supabaseUrl,
//       key: !!supabaseAnonKey,
//     })
//     throw new Error("Missing Supabase environment variables")
//   }

//   return createBrowserClient(supabaseUrl, supabaseAnonKey)
// }



// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// // lib/supabase/client.ts
// import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'

// export const createClient = () => createBrowserSupabaseClient()

// export const supabase = createClient(supabaseUrl, supabaseAnonKey)