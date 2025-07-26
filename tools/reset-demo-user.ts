import dotenv from "dotenv"
dotenv.config()
console.log("SUPABASE URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log("SERVICE ROLE KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 10)) 
import { createClient } from "@supabase/supabase-js"



const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function resetDemoUser() {
  const userId = "6b572aaf-6dee-4996-8bee-0adc093e8ca0" 
  const newPassword = "DemoLogin01"

  const { data, error } = await supabase.auth.admin.updateUserById(userId, {
    password: newPassword,
    email_confirm: true,
  })

  if (error) {
    console.error("リセット失敗:", error.message)
  } else {
    console.log("パスワード変更＆認証スキップ成功:", data)
  }
}

resetDemoUser()
