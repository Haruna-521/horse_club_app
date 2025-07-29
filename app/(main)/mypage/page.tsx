"use client"
//このコンポーネントがクライアント側（ブラウザ）で動くことを明示。
import Link from "next/link"
import { CalendarDays, ChevronRight, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase/client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { error } from "console"

export default function MyPage() {

  const [session,setSession] = useState<any>(null)
//nullつまり最初は情報がない状態にしている。setSession()で後からセッション情報を保存する。
  const [profile,setProfile] = useState<any>(null)
  //ユーザーのプロフィール（名前など）を保存するために関数。
  const [lessonData,setLessonData] = useState<any[]>([])
  useEffect(() => {
    //Reactの仕組み。このページが表示されたら○○を処理する、というやつ。
    const fetchUserData = async () => {
      //async:非同期処理（時間のかかる処理ですよ）というやつ。
      // const {data:sessionData,error:sessionError} = await supabase.auth.getSession()
            // const session =sessionData?.session
      //data:sessionにユーザーがログインしているならそのセッションが入る。errorは失敗した場合エラーが入る。
        //     if (sessionError || !session || !session.user) {
        // console.error("セッションの取得に失敗、またはユーザー情報がありません",sessionError)
      const sessionRes = await supabase.auth.getSession()//supabaseからセッション情報を取得する。(ログインしているかチェック)
      const session = sessionRes.data.session//セッション（ログイン状態）の中身だけ取り出す。

      if (!session) {
        console.error("セッションがありません。ログインしてください。")
        return
      }//セッション取得に失敗したらエラーを表示して処理を止める。

      setSession(session)//取得したセッションをstateに保存した。

      //情報の取得↓(schedulesテーブルを内部結合してる)
    const {data:reservations,error:reservationError} = await supabase
    .from("reservations")
    .select(`
      id,
      schedule_id,
      status,
      schedules(
        lesson_name,
        date,
        start_time,
        end_time,
        club_id,
        staff(name)
      )
    `)
      //↑で渡されるデータはこんな感じのイメージ。id:予約id,schedule_id:スケジュールのID,status:confirmed or cancelled,schedules:{lesson_name:レッスン名,data:2025-06-30,start_time.....""略}
    .eq("user_id",session.user.id)
    
    if (reservationError) {
      console.error("予約情報の取得エラー:",reservationError)
      return
    }

    console.log("取得できた予約情報：",reservations)
    setLessonData(reservations || [])
          
  }

      fetchUserData()
    },[])

    //表示用データを成形する↓
    const fullName =
      profile?.full_name ||
      session?.user.user_metadata?.full_name ||
      session?.user.email?.split("@")[0] ||
      "ユーザー"

    const initials = fullName
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      //fullName.split("")は名前を空白で分割して配列にする。例"太郎 山田"→["太郎","山田"]。map((n)=>n[0])は各単語の最初の１文字を取り出す。例["太郎","山田"]→["太","山"]。join("")はバラバラになった文字をくっつけて文字列にする。例["太","山"]→"太山"。

      //pastReservationsは過去の予約を抽出した配列。lessonDataから「確定済み（confirmed）」で「今日より前」の予約だけを取り出している。sort()で日付順に並び替え。
      const pastReservations = lessonData
      .filter((r) => {
        const today = new Date()
        const lessonDate = new Date(r.schedules.date)
        return (
        (r.status === "confirmed" || r.status === null) && lessonDate < today)
      })
      .sort((a, b) => new Date(b.schedules.date).getTime() - new Date(a.schedules.date).getTime())


      //直近の予約↓
    const upcomingReservations = lessonData//lessonDataはsupabaseから取得した予約データの配列。このlessonDataから今後の予約だけを抜き出してupcomingReservationsに代入する。
      .filter((r) => {//filter()は配列から条件に合うものだけを取り出す関数。rは配列の１つ１つの要素（予約１件）を表している。
      const today = new Date()//今日の日付・時間を取得している。
      const lessonDate = new Date(r.schedules.date)//各予約のスケジュールの日付をDateオブジェクトに変換してる（文字列のままだと比較できないため）
      return (
        (r.status === "confirmed" || r.status === null) && lessonDate >= today)//予約がconfirmed（=確定)で日付が「今日以降（未来）である」
      })
      .sort((a, b) => new Date(b.schedules.date).getTime() - new Date(a.schedules.date).getTime())

        return (

    // const pastReservations = lessonData
    //  .filter((r)=>{
    //   const today = new Date()
    //   const lessonData = new Date(r.schedules.date)
    //   return r.status === "cancelled" || lessonData <today
    //  })
    //  .sort((a,b) => {
    //   const aDate = new Date(a.schedules.date).getTime()
    //   const bDate = new Date(b.schedules.date).getTime()
    //   return bDate - aDate
    //  })
//   // 直近の予約
//   const upcomingReservations = 
//     .filter((r) => r.status === "confirmed" && new Date(r.date) >= new Date())
//     .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
// //.filter()は配列の中から「条件に合うものだけを残す」ための処理。(r)は配列の中から１つ１つの予約（１件分）。
// //r.status === "confirmed":予約の状態が「確定済み（confirmed)」ということ。。new Date(r.date) >= new Date():予約日が「今日以降」。
// //.sort()は配列の順番を並び替える処理。

//   // 過去の予約
//   const pastReservations = reservations
//     .filter((r) => new Date(r.date) < new Date() || r.status === "cancelled")
//     .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
// //new Date(r.date) < new Date():予約日が「今日より前」か、r.status === "cancelled":予約が「キャンセル」されたか。


//94:profile?.full_name→ユーザーのプロフィール情報（名前）があればそれ。||→または。nullやundefinedの場合次の値を使う。session?.user.email?.split("@")[0]→名前がない場合メールアドレスの「＠より前の部分」を使う。||(または)、"ユーザー"→それでも値がなければユーザーという文字列を使用する。
//95:fullName.split("")→名前を空白（スペース）で分けて配列にする。例"太郎 山田"；["太郎","山田"].map((n)=>n[0])→各単語の最初の１文字を取り出す。例["太郎","山田"];["太","山"].join("")→バラバラになった文字をくっつけて文字列にする。例"太山"

//return()→Reactコンポーネントの画面に表示する部分。className=""{Tailwindd Cssというライブラリでcontainerは中央寄せ、py-10は上下の余白。flex flex-colは要素を縦方向に並ぶFlexboxの指定。gap-8要素の間に大きめの隙間（８単位）をあける。text-3×1は大きな文字サイズ。font-boldは太字。tracking-trghtは文字間を狭くする。　p className~サブタイトル的なテキスト。text-muted-foregroundは少し色を薄くして控えめな印象にする。} 
//card:UIコンポーネント。外枠を表す。rounded-x1は角を大きく丸める。shadow-mdは中程度の立体感のある影をつける。
//CardHeader:ヘッダー部分。　items-center:縦方向の中央揃え。space-y-4:縦の要素同士に適度なスペースをあける。text-center:テキスト中央揃え。p-6：内側にパディングを６単位。
//AvatarImage:今は""空白のため表示されない。　AvatatFallback:画像がないときに代わりに表示。initialsで作成した文字列を使用する。text-lg:少し大きめの文字。bg-primary/20:メインカラーの20％薄い背景色。text-primary-dark:メインカラーの濃い文字色。
//CardFooter:カードの一番下。button:見た目がボタンのようになる。asChilsを指定してLinkを中に入れる（リンク型のボタンにする。Link href=~クリックすると設定ページに遷移。Settings:アイコン
//md:col-span-2:中サイズ以上の画面で横に２列分使う。rounded-x1:角を丸くする。
//flex+flex-row:横並びに配置。items-ceter:縦方向に中央揃え。justify-between左右端に要素を配置（スペースを等しく分ける。）
//CardTitle：タイトル。CardDescription:小見出しや補足説明。
//button valiant=~ボタン風のリンクを作成。/mypage/reservations???これどこだ？？？？variant="ghost"ボタンに拝啓がないスタイル。ChevronRight:→のような右矢印アイコン。
//{upcomingReservations.length>0?()}→upcomingReservationsが１件以上あるかの確認。→lessonDataに変更してみた。.map()は配列の各要素を1つずつ表示する、Reactの基本構文。
//div key=~→１件の予約カード。keyはReactがリストを管理するために必要な識別子（予約ＩＤ）。
//div className="flex items-center text-sm text-muted-foreground" CalendarDays className=~→カレンダーアイコンと日付、時間を表示。
//p className= "text-sm text-muted-foreground"インストラクター:~→担当インストラクターの名前を表示。
//badge variant="outline"~→小さなラベル（バッジ）で「予約済み」と表示。
//直近の予約はありませんと部分：予約がないときの「何もありません」という表示。
//cardFooterカードの下部。ボタンクリックで/calendarに移動（予約ページ）
    <div className="container py-10">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">マイページ</h1>
          <p className="text-muted-foreground">予約状況や会員情報を確認・管理できます</p>
        </div>
        {/* 会員情報カード */}
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

          {/* 直近の予約カード */}
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
                  {upcomingReservations.slice(0, 3).map((r) => (
                    <div key={r.id || r.schedule_id} className="flex items-center justify-between rounded-xl border p-4">
                      <div className="space-y-1">
                        <h4 className="font-medium">{r.schedules.lesson_name || "レッスン未設定"}</h4>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <CalendarDays className="mr-1 h-4 w-4" />
                          {r.schedules.date} {r.schedules.start_time}-{r.schedules.end_time}
                        </div>
                        <p className="text-sm text-muted-foreground">インストラクター: {r.schedules.staff?.name || "未設定"}</p>
                      </div>
                      <Badge variant={r.status === "cancelled" ? "destructive" : "secondary"}>
                        {r.status === "cancelled" ? "キャンセル済み" : "予約済み"}
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
              <Button className="w-full rounded-xl" asChild>
                 <Link href="/calendar">新しく予約する</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
              {/* 予約履歴カード */}
        <Card className="rounded-xl shadow-md">
          <CardHeader>
            <CardTitle>予約履歴</CardTitle>
            <CardDescription>過去の予約やキャンセルした予約</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {pastReservations.length > 0 ? (
              <div className="space-y-4">
                {pastReservations.slice(0, 5).map((reservation) => (
                  <div key={reservation.id || reservation.schedule_id} className="flex items-center justify-between rounded-xl border p-4">
                     <div className="space-y-1">
      <h4 className="font-medium">{reservation.schedules.lesson_name || "レッスン未設定"}</h4>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarDays className="mr-1 h-4 w-4" />
                    {reservation.schedules.date} {reservation.schedules.start_time} - {reservation.schedules.end_time}
                      </div>
                      <p className="text-sm text-muted-foreground">インストラクター: {reservation.schedules.staff?.name || "未設定"}</p>
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
  )
}
//pastReservationsの件数が１件以上あるか。pastReservationsとは....???
//?（三項演算子）で条件分岐。予約履歴を表示、なければ「履歴はありません」と表示。
//.slice(0,5):予約履歴の中から最大５件を取り出す。.map():１件ずつ表示するために繰り返す。reservationは今表示しようとしている１件分のデータ。
//key:Reactがリストを扱うために必要な一意の識別子（予約ＩＤ）
//reservation.clubName:予約したクラブの名前を表示。
//calendarDays：カレンダーのアイコン。
//{reservation.date}{reservation.start_time}--{reservation.end_time}:日付＋開始時間～終了時刻の表示。
//Badge:小さなラベルのようなもの。variant=...→ステータスに応じて見た目を変える。cancelledなら「赤っぽい警告表示（destructive)」それ以外（完了）は「グレー系(secondary)」
//reservation.status==="cancelled" ? "キャンセル済み":"完了"→ラベルの文字。statusがcancelledならキャンセル済み、それ以外は完了。