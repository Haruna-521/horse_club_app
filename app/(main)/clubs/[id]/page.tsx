import Link from "next/link"
import { CalendarDays, ChevronLeft, MapPin, Users } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export default async function ClubDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()

  // 実際の実装ではSupabaseからデータを取得
  // const { data: club, error } = await supabase
  //   .from('clubs')
  //   .select('*')
  //   .eq('id', params.id)
  //   .single()

  // if (error || !club) {
  //   notFound()
  // }

  // ダミーデータ
  const club = {
    id: 1,
    name: "東京乗馬クラブ",
    location: "東京都世田谷区",
    description:
      "都心から近い、初心者から上級者まで楽しめる乗馬クラブです。広々とした馬場と経験豊富なインストラクターが、あなたの乗馬ライフをサポートします。初心者向けのレッスンから、競技志向の方向けの高度なトレーニングまで幅広く対応しています。",
    difficulty: "初級〜中級",
    image_url: "/placeholder.svg?height=400&width=800",
    facilities: ["屋内馬場", "屋外馬場", "クラブハウス", "シャワールーム"],
    staff: [
      { name: "鈴木 一郎", role: "チーフインストラクター" },
      { name: "田中 花子", role: "インストラクター" },
      { name: "佐藤 健", role: "スタッフ" },
    ],
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/clubs">
              <ChevronLeft className="mr-1 h-4 w-4" />
              クラブ一覧に戻る
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-6 aspect-video w-full overflow-hidden rounded-xl shadow-md">
              <img src={club.image_url || "/placeholder.svg"} alt={club.name} className="h-full w-full object-cover" />
            </div>

            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">{club.name}</h1>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/10 text-primary-dark border-primary-light">
                  {club.difficulty}
                </Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="mr-1 h-4 w-4" /> {club.location}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">クラブ紹介</h2>
                <Separator className="my-2" />
                <p className="text-muted-foreground">{club.description}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold">施設情報</h2>
                <Separator className="my-2" />
                <ul className="grid grid-cols-2 gap-2">
                  {club.facilities.map((facility, index) => (
                    <li key={index} className="flex items-center">
                      <span className="mr-2 h-2 w-2 rounded-full bg-primary" />
                      {facility}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold">スタッフ紹介</h2>
                <Separator className="my-2" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {club.staff.map((staff, index) => (
                    <Card key={index} className="rounded-xl shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{staff.name}</CardTitle>
                        <CardDescription>{staff.role}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <Card className="rounded-xl shadow-md sticky top-20">
              <CardHeader>
                <CardTitle>予約する</CardTitle>
                <CardDescription>このクラブの空き状況を確認して予約しましょう</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <Button className="w-full rounded-xl" asChild>
                  <Link href={`/calendar?club=${club.id}`}>
                    <CalendarDays className="mr-2 h-4 w-4" />
                    予約カレンダーを見る
                  </Link>
                </Button>
                <Button variant="outline" className="w-full rounded-xl" asChild>
                  <Link href={`/clubs/${club.id}/staff`}>
                    <Users className="mr-2 h-4 w-4" />
                    スタッフ一覧
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
