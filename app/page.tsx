import Link from "next/link"
import { DogIcon as Horse, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light/10 to-background">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-dark">乗馬クラブ予約システム</h1>
          <div className="flex gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">ログイン</Link>
            </Button>
            <Button asChild>
              <Link href="/register">会員登録</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="mb-16 text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-800">乗馬クラブの予約をもっと簡単に</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            会員登録して、お好みのクラブやスケジュールを簡単に予約。 キャンセルや履歴確認もオンラインで完結します。
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary-dark" asChild>
            <Link href="/register">今すぐ始める</Link>
          </Button>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="rounded-xl shadow-md card-hover">
            <CardHeader className="pb-2">
              <Horse className="h-12 w-12 text-primary mb-2" />
              <CardTitle>クラブを探す</CardTitle>
              <CardDescription>お近くの乗馬クラブを検索して詳細を確認できます</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-600">
                地域や難易度で絞り込み、あなたに最適なクラブを見つけましょう。
                各クラブの特徴やスタッフ情報も確認できます。
              </p>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Button variant="outline" className="w-full rounded-xl" asChild>
                <Link href="/clubs">クラブ一覧を見る</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="rounded-xl shadow-md card-hover">
            <CardHeader className="pb-2">
              <Calendar className="h-12 w-12 text-primary mb-2" />
              <CardTitle>予約する</CardTitle>
              <CardDescription>カレンダーから希望の日時を選んで簡単予約</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-600">
                空き状況をリアルタイムで確認し、ワンクリックで予約完了。 予約の変更やキャンセルも簡単に行えます。
              </p>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Button variant="outline" className="w-full rounded-xl" asChild>
                <Link href="/calendar">予約カレンダーを見る</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="rounded-xl shadow-md card-hover">
            <CardHeader className="pb-2">
              <User className="h-12 w-12 text-primary mb-2" />
              <CardTitle>マイページ</CardTitle>
              <CardDescription>予約履歴や個人情報を管理できます</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-600">
                過去の予約履歴や今後の予定を一覧で確認。 会員情報の更新や通知設定もこちらから行えます。
              </p>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Button variant="outline" className="w-full rounded-xl" asChild>
                <Link href="/mypage">マイページへ</Link>
              </Button>
            </CardFooter>
          </Card>
        </section>
      </main>

      <footer className="bg-white border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 mb-4 md:mb-0">© 2024 乗馬クラブ予約システム All Rights Reserved.</p>
            <div className="flex gap-4">
              <Link href="/terms" className="text-gray-600 hover:text-primary">
                利用規約
              </Link>
              <Link href="/privacy" className="text-gray-600 hover:text-primary">
                プライバシーポリシー
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-primary">
                お問い合わせ
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
