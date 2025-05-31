import Link from "next/link"
import { MainNav } from "@/components/layout/main-nav"
import { UserNav } from "@/components/layout/user-nav"

export async function SiteHeader() {
  // 一旦ダミーのユーザー情報を使用
  const user = null

  // try {
  //   const supabase = await createClient()
  //   const {
  //     data: { session },
  //   } = await supabase.auth.getSession()

  //   if (session?.user) {
  //     const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  //     user = {
  //       id: session.user.id,
  //       email: session.user.email!,
  //       full_name: data?.full_name,
  //       avatar_url: data?.avatar_url,
  //     }
  //   }
  // } catch (error) {
  //   console.error("Error loading user session:", error)
  // }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white shadow-sm">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="text-xl font-bold text-primary-dark">乗馬クラブ予約</span>
        </Link>
        <MainNav />
        <div className="ml-auto flex items-center space-x-4">
          <UserNav user={user} />
        </div>
      </div>
    </header>
  )
}
