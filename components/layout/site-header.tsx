"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { MainNav } from "@/components/layout/main-nav"
import { UserNav } from "@/components/layout/user-nav"
import { supabase } from "@/lib/supabase/client"
import { set } from "date-fns"


type UserType = {
  id: string
  email: string | undefined
  full_name: string
  avatar_url: string
}


export function SiteHeader() {
  const [user, setUser] = useState<UserType | null>(null)

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        console.error("セッション取得エラー:", error)
        return
      }

      const session = data.session
      if (session?.user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", session.user.id)
          .single()
        
        setUser({
          id: session.user.id,
          email: session.user.email,
          full_name: profileData?.full_name || "",
          avatar_url: profileData?.avatar_url || "",
        })
      }
    }

  fetchSession()
  }, [])

  // 以下修正前コード。必要に応じて削除・再利用の検討。
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
  //   console.error("ユーザーセッションの取得中にエラーが発生しました:", error)
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
