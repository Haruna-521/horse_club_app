import Link from "next/link"
import { RegisterForm } from "./register-form"
import { supabase } from "@/lib/supabase/client"
import { redirect } from "next/navigation"
export default async function RegisterPage() {
  // 認証チェックは一旦コメントアウト（後で有効化）
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session) {
      redirect("/mypage")
    }
  } catch (error) {
    console.error("Supabase client error:", error)
  }

  return (
    <div className="container relative flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-primary-dark" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Link href="/" className="flex items-center">
            乗馬クラブ予約システム
          </Link>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;会員登録して、乗馬クラブの予約をもっと便利に。スケジュール管理や予約履歴もすべてオンラインで完結します。&rdquo;
            </p>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">会員登録</h1>
            <p className="text-sm text-muted-foreground">以下の情報を入力して会員登録してください</p>
          </div>
          <RegisterForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            すでにアカウントをお持ちの方は{" "}
            <Link href="/login" className="underline underline-offset-4 hover:text-primary">
              ログイン
            </Link>
            してください
          </p>
        </div>
      </div>
    </div>
  )
}
