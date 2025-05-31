import Link from "next/link"
import { MapPin } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default async function ClubsPage() {
  let clubs = []

  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("clubs").select("*").order("name")

    if (error) {
      console.error("Error fetching clubs:", error)
    } else {
      clubs = data || []
    }
  } catch (error) {
    console.error("Supabase connection error:", error)
  }

  // データがない場合はダミーデータを使用
  if (clubs.length === 0) {
    clubs = [
      {
        id: 1,
        name: "東京乗馬クラブ",
        location: "東京都世田谷区",
        description: "都心から近い、初心者から上級者まで楽しめる乗馬クラブです。",
        difficulty: "初級〜中級",
        image_url: "/placeholder.svg?height=200&width=400",
      },
      {
        id: 2,
        name: "横浜ホースパーク",
        location: "神奈川県横浜市",
        description: "広大な敷地で自然を感じながら乗馬を楽しめます。",
        difficulty: "初級〜上級",
        image_url: "/placeholder.svg?height=200&width=400",
      },
      {
        id: 3,
        name: "千葉ライディングクラブ",
        location: "千葉県千葉市",
        description: "経験豊富なインストラクターが丁寧に指導します。",
        difficulty: "初級",
        image_url: "/placeholder.svg?height=200&width=400",
      },
    ]
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">クラブ一覧</h1>
          <p className="text-muted-foreground">お近くの乗馬クラブを探して、詳細を確認しましょう</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {clubs.map((club) => (
            <Card key={club.id} className="overflow-hidden rounded-xl shadow-md card-hover">
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={club.image_url || "/placeholder.svg?height=200&width=400"}
                  alt={club.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{club.name}</CardTitle>
                  <Badge variant="outline" className="bg-primary/10 text-primary-dark border-primary-light">
                    {club.difficulty}
                  </Badge>
                </div>
                <CardDescription className="flex items-center">
                  <MapPin className="mr-1 h-3 w-3" /> {club.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{club.description}</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full rounded-xl">
                  <Link href={`/clubs/${club.id}`}>詳細を見る</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
