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
  let club = null
  let staff = []
    try {
    const supabase = await createClient()
    const { data:clubData, error:clubError } = await supabase.from("clubs").select("*").eq('id', params.id).single()
    const { data:staffData, error:staffError } = await supabase.from("staff").select("*").eq('club_id', params.id)
    if (clubError || staffError) {
      console.error("データ取得エラー", clubError || staffError)
    } else {
      club = clubData
      staff = staffData || []
    }
  } catch (error) {
    console.error("Supabase connection error:", error)
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
                  {(club.facilities?.split('、')?? []).map((facility: string, index:number) => (
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
                  {staff.map((member:any, index:number) => (
                    <Card key={index} className="rounded-xl shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{member.name}</CardTitle>
                        <CardDescription>{member.role}</CardDescription>
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
