"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { addDays, format } from "date-fns"
import { ja } from "date-fns/locale"
import { supabase } from "@/lib/supabase/client"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function CalendarPage() {
  //CalendarPageという名前のコンポーネント（画面の部品）を作成しexport defaultでほかのファイルから使えるようにしている。
  const searchParams = useSearchParams()
  const initialClubId = searchParams.get("club") || ""
//URLの？club・・・のようなクエリパラメーターを読み取って、clubパラメーターがない場合は""(空文字)を使用。
  const [clubs, setClubs] = useState<any[]>([])
//クラブデータを取得：プルダウンメニューに表示するクラブ一覧、デフォルトで選択するクラブを決める、ために必要。
  const [schedules, setSchedules] = useState<any[]>([])//schedulesは変数（現在のスケジュール一覧を保存する箱）でsetSchedulesは関数（その箱の中身を更新する関数）。
  //schedules = []空の配列。次にsetschedules関数を実行するとsetScheduless([{id:a,titl...}])みたいなデータを入れる。そうすると変数schedulesにその値が入る（更新される）。setSchedulesはした（７０行目あたりから）
  const [selectedClub, setSelectedClub] = useState(initialClubId)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())//→<Date | undefined>：TypeScriptの型指定。Dateまたはundefinedのどちらかの値を持つよってこと。new Date():現在の日時を作るJavaScriptの命令、初期値として設定。undefinedは日時を削除したり日付未選択状態の可能性のため入れてる。
//useState：コンポーネント内でデータを保存・更新するためのReactの機能。[現在の値,値を更新する関数]。clubs:全クラブのリストを保存、schedules:スケジュールのリストを保存、selectedClub:現在選択されているクラブID、selectedData：現在選択されている日付。
  useEffect(() => {
//useEffect：コンポーネントが画面に表示されたときに自動実行される処理で主にデータの取得や初期設定で使用される。
    const fetchData = async () => {
      const { data: clubData, error: clubError } = await supabase.from("clubs").select("*").order("name")
//supabaseのclubsテーブルにアクセス。.select("*")：すべての列（フィールド）を取得、.order("name"):nameフィールドでアルファベット順に並び替え、await:データベースからの応答を待つ。=クラブデータを全件取得。
      if (clubError) {
        console.error("クラブの取得エラー:", clubError)
        return
      }
//データ取得に失敗した場合、エラーをコンソールに表示して処理を終了する。
//よって以上のコードはカレンダーページで「特定のクラブのスケジュールを表示する」機能の基礎部分。

      setClubs(clubData || [])
//取得したクラブデータをclubs状態に保存。||はまたはという意味。clubDataがnullやundefinedの間合いは空配列[]を使用。
//// clubDataが正常に取得できた場合
// clubData = [{id: 1, name: "サッカー部"}, {id: 2, name: "野球部"}]
//setClubs(clubData) // → clubsに配列が設定される
//clubDataが取得できなかった場合（null）
// clubData = null
// setClubs([]) // → clubsに空配列が設定される（エラー防止）
      const clubId = initialClubId || clubData?.[0]?.id
      if (!clubId) return
//initialClubIdは前に定義した「initialClubId = searchParams.get("club") || ""」のやつ。URLで指定されていればそれを使用、なければ最初のクラブを自動選択する。
//if~はclubIdが存在しない(null,undefined,"")場合、処理を停止しこれ以降の処理を実行しない。＝初期クラブ決定。

      setSelectedClub(clubId)
//選択したclubIdをselectedClubに状態を保存している。プルダウンで選択された状態を表示するため。ここまでのclubIdに関する処理は「ページを開いたときに適切なクラブを自動選択して、そのスケジュールを表示する」ロジック。

      const formattedDate = (selectedDate || new Date()).toISOString().split('T')[0]
      const { data: scheduleData, error: scheduleError } = await supabase
        .from("schedules")//schedulesデーブルを対象とする。
        .select("*")//すべての列を取得。
        .eq("club_id", clubId)//クラブＩＤが一致するレコードのみ。(カラム名,比較する値)という書き方。クラブで絞り込み。
        .eq("date", formattedDate)//日付で絞り込み。
        .order("start_time", { ascending: true })//開始時間順に並び替え。

      if (scheduleError) {
        console.error("スケジュールの取得エラー:", scheduleError)
        return
      }
//スケジュール取得に失敗した場合、エラーを表示して処理を終了する。

      setSchedules(scheduleData || [])
      //この()部分がschedulesに保存される。↑で絞り込みをしているので絞り込み済みのスケジュール配列が入る。
    }
//取得したスケジュールデータを状態に保存する。データがない場合は空配列を設定。
    fetchData()
  }, [])//初回のみ実行する。

  //選択変更時の処理
  const handleClubChange = async (newClubId: string) => {
    setSelectedClub(newClubId)

    //新しいクラブのスケジュールを取得
    const formattedDate = (selectedDate || new Date()).toISOString().split('T')[0]

    const {data:scheduleData,error} = await supabase
    .from("schedules")//schedulesデーブルを対象とする。
        .select("*")//すべての列を取得。
        .eq("club_id", newClubId)//クラブＩＤが一致するレコードのみ。(カラム名,比較する値)という書き方。クラブで絞り込み。
        .eq("date", formattedDate)//日付で絞り込み。
        .order("start_time", { ascending: true })//開始時間順に並び替え。
    if (!error) {
        setSchedules(scheduleData || [])
    }
  }
  const handleDateChange = async (newDate: Date | undefined) => {
    setSelectedDate(newDate)

    if (!newDate || !selectedClub) return
    //新しい日付のスケジュールを取得
    const formattedDate = newDate?.toISOString().split('T')[0]
    const { data: scheduleData,error} = await supabase
      .from("schedules")
      .select("*")
      .eq("club_id",selectedClub)
      .eq("date",formattedDate)
      .order("start_time", { ascending: true})
    if (!error) {
      setSchedules(scheduleData || [])
    }
  }

  //これ何？ const filteredSchedules = schedules.filter(
  //   (schedule) =>
  //     schedule.club_id === selectedClub &&
  //     schedule.date === format(selectedDate || new Date(), "yyyy-MM-dd")
  // )

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">予約カレンダー</h1>
          <p className="text-muted-foreground">
            クラブと日付を選択して、予約可能なスケジュールを確認しましょう
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* 左カラム */}
          <div className="space-y-4">
            <Card className="rounded-xl shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">予約条件</CardTitle>
                <CardDescription>クラブと日付を選択してください</CardDescription>
              </CardHeader>
              <div className="p-6 pt-0 space-y-4">
                <div>
                  <label className="text-sm font-medium">クラブを選択</label>
                  <Select value={selectedClub} onValueChange={setSelectedClub}>
                    <SelectTrigger className="w-full rounded-xl">
                      <SelectValue placeholder="クラブを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {clubs.map((club) => (
                        <SelectItem key={club.id} value={club.id}>
                          {club.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">日付を選択</label>
                  <div className="grid gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal rounded-xl">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? (
                            format(selectedDate, "yyyy年MM月dd日 (eee)", { locale: ja })
                          ) : (
                            <span>日付を選択</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                          disabled={(date) => date < new Date()}
                          className="rounded-xl"
                        />
                      </PopoverContent>
                    </Popover>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="w-full rounded-xl" onClick={() => setSelectedDate(new Date())}>
                        今日
                      </Button>
                      <Button variant="outline" size="sm" className="w-full rounded-xl" onClick={() => setSelectedDate(addDays(new Date(), 1))}>
                        明日
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* 右カラム */}
          <div className="md:col-span-2">
            <h2 className="mb-4 text-xl font-semibold">
              {selectedDate ? format(selectedDate, "yyyy年MM月dd日 (eee)", { locale: ja }) : "日付を選択してください"} のスケジュール
            </h2>

            {filteredSchedules.length > 0 ? (
              <div className="grid gap-4">
                {filteredSchedules.map((schedule) => (
                  <Card key={schedule.id} className="rounded-xl shadow-md">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {schedule.startTime} - {schedule.endTime}
                        </CardTitle>
                        <Badge variant={schedule.availableSpots > 0 ? "outline" : "destructive"}>
                          {schedule.availableSpots > 0 ? `残り${schedule.availableSpots}枠` : "満員"}
                        </Badge>
                      </div>
                      <CardDescription>
                        インストラクター: {schedule.instructor} | レベル: {schedule.level}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="p-6">
                      <Button className="w-full rounded-xl" disabled={schedule.availableSpots === 0} asChild>
                        <a href={`/reservation/${schedule.id}`}>
                          {schedule.availableSpots > 0 ? "予約する" : "予約できません"}
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex h-[200px] items-center justify-center rounded-xl border border-dashed">
                <p className="text-muted-foreground">この日のスケジュールはありません</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
