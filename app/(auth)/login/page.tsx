import Link from "next/link"
import { LoginForm } from "./login-form"
import { supabase } from "@/lib/supabase/client"
import { redirect } from "next/navigation"
export default async function LoginPage() {
  
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session) {
      redirect("/")
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
              &ldquo;乗馬クラブの予約をもっと簡単に。いつでもどこでも、スマートに予約管理ができます。&rdquo;
            </p>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">アカウントにログイン</h1>
            <p className="text-sm text-muted-foreground">メールアドレスとパスワードを入力してログインしてください</p>
          </div>
          <LoginForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            アカウントをお持ちでない場合は{" "}
            <Link href="/register" className="underline underline-offset-4 hover:text-primary">
              会員登録
            </Link>
            してください
          </p>
        </div>
      </div>
    </div>
  )
}
