import Link from "next/link"
import { CalendarDays, ChevronRight, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default async function MyPage() {
  // 一旦ダミーデータを使用
  const session = { user: { email: "test@example.com" } }
  const profile = { full_name: "テストユーザー" }

  // 予約情報を取得（ダミーデータ）
  const reservations = [
    {
      id: "1",
      clubName: "東京乗馬クラブ",
      date: "2024-06-05",
      startTime: "10:00",
      endTime: "11:00",
      instructor: "鈴木 一郎",
      status: "confirmed", // confirmed, cancelled
    },
    {
      id: "2",
      clubName: "横浜ホースパーク",
      date: "2024-06-10",
      startTime: "13:00",
      endTime: "14:00",
      instructor: "山田 太郎",
      status: "confirmed",
    },
    {
      id: "3",
      clubName: "東京乗馬クラブ",
      date: "2024-05-20",
      startTime: "15:00",
      endTime: "16:00",
      instructor: "田中 花子",
      status: "cancelled",
    },
  ]

  // 直近の予約
  const upcomingReservations = reservations
    .filter((r) => r.status === "confirmed" && new Date(r.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // 過去の予約
  const pastReservations = reservations
    .filter((r) => new Date(r.date) < new Date() || r.status === "cancelled")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const fullName = profile?.full_name || session?.user.email?.split("@")[0] || "ユーザー"
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">マイページ</h1>
          <p className="text-muted-foreground">予約状況や会員情報を確認・管理できます</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="rounded-xl shadow-md">
            <CardHeader>
              <CardTitle>会員情報</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-4 text-center p-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={""} alt={fullName} />
                <AvatarFallback className="text-lg bg-primary/20 text-primary-dark">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-medium">{fullName}</h3>
                <p className="text-sm text-muted-foreground">{session?.user.email}</p>
              </div>
            </CardContent>
            <CardFooter className="p-6">
              <Button variant="outline" className="w-full rounded-xl" asChild>
                <Link href="/mypage/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  設定
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="md:col-span-2 rounded-xl shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>直近の予約</CardTitle>
                <CardDescription>今後の予約スケジュール</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/mypage/reservations">
                  すべて見る
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              {upcomingReservations.length > 0 ? (
                <div className="space-y-4">
                  {upcomingReservations.slice(0, 3).map((reservation) => (
                    <div key={reservation.id} className="flex items-center justify-between rounded-xl border p-4">
                      <div className="space-y-1">
                        <h4 className="font-medium">{reservation.clubName}</h4>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <CalendarDays className="mr-1 h-4 w-4" />
                          {reservation.date} {reservation.startTime}-{reservation.endTime}
                        </div>
                        <p className="text-sm text-muted-foreground">インストラクター: {reservation.instructor}</p>
                      </div>
                      <Badge variant="outline" className="bg-primary/10 text-primary-dark border-primary-light">
                        予約済み
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-[100px] items-center justify-center rounded-xl border border-dashed">
                  <p className="text-muted-foreground">直近の予約はありません</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="p-6">
              <Button className="w-full rounded-xl" asChild>
                <Link href="/calendar">新しく予約する</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Card className="rounded-xl shadow-md">
          <CardHeader>
            <CardTitle>予約履歴</CardTitle>
            <CardDescription>過去の予約やキャンセルした予約</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {pastReservations.length > 0 ? (
              <div className="space-y-4">
                {pastReservations.slice(0, 5).map((reservation) => (
                  <div key={reservation.id} className="flex items-center justify-between rounded-xl border p-4">
                    <div className="space-y-1">
                      <h4 className="font-medium">{reservation.clubName}</h4>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CalendarDays className="mr-1 h-4 w-4" />
                        {reservation.date} {reservation.startTime}-{reservation.endTime}
                      </div>
                      <p className="text-sm text-muted-foreground">インストラクター: {reservation.instructor}</p>
                    </div>
                    <Badge variant={reservation.status === "cancelled" ? "destructive" : "secondary"}>
                      {reservation.status === "cancelled" ? "キャンセル済み" : "完了"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-[100px] items-center justify-center rounded-xl border border-dashed">
                <p className="text-muted-foreground">予約履歴はありません</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="p-6">
            <Button variant="outline" className="w-full rounded-xl" asChild>
              <Link href="/mypage/reservations">すべての履歴を見る</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
