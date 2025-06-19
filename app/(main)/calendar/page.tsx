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
import { date } from "zod"

export default function CalendarPage() {
  
  const searchParams = useSearchParams()
  const initialClubId = searchParams.get("club") || ""

  const [clubs, setClubs] = useState<any[]>([])

  const [schedules, setSchedules] = useState<any[]>([])



  const [selectedClub, setSelectedClub] = useState(initialClubId)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())



  useEffect(() => {

    const fetchData = async () => {
      const { data: clubData, error: clubError } = await supabase.from("clubs").select("*").order("name")


      if (clubError) {
        console.error("クラブの取得エラー:", clubError)
        return
      }

      

      setClubs(clubData || [])
//取得したクラブデータをclubs状態に保存。||はまたはという意味。clubDataがnullやundefinedの間合いは空配列[]を使用。
//// clubDataが正常に取得できた場合
// clubData = [{id: 1, name: "サッカー部"}, {id: 2, name: "野球部"}]
//setClubs(clubData) // → clubsに配列が設定される
//clubDataが取得できなかった場合（null）
// clubData = null
// setClubs([]) // → clubsに空配列が設定される（エラー防止）
      const clubId = initialClubId || clubData?.[0]?.id
      if (!clubId) {
//initialClubIdは前に定義した「initialClubId = searchParams.get("club") || ""」のやつ。URLで指定されていればそれを使用、なければ最初のクラブを自動選択する。
//if~はclubIdが存在しない(null,undefined,"")場合、処理を停止しこれ以降の処理を実行しない。＝初期クラブ決定。

      setSelectedClub(clubId)
    }
  }
  fetchData()
},[])

      
  const fetchSchedules = async (clubId: string, date:Date | undefined) => {
      if (!selectedClub || !selectedDate) return

        const formattedDate = format( selectedDate,"yyyy-MM-dd")
      
        const { data: scheduleData, error: scheduleError } = await supabase
        .from("schedules")
        .select(`
          id,lesson_name,start_time,end_time,available_slots,level,
          staff:stahh_id(
            name)
        `)
        .eq("club_id", selectedClub)
        .eq("date", formattedDate)
        .order("start_time", { ascending: true })

        if (scheduleError) {
          console.error("スケジュールの取得エラー:", scheduleError)
        }else {
          setSchedules(scheduleData || [])
          console.log(scheduleData)
        }
  
  }
      //  !left(
      //       name
      //     )
  const handleClubChange = async (newClubId:string) => {
    setSelectedClub(newClubId)
    await fetchSchedules(newClubId,selectedDate)
  }
  const handleDateChange = async (newDate:Date | undefined) => {
    setSelectedDate(newDate)
    if (selectedClub){
      await fetchSchedules(selectedClub,newDate)
    }
  }

  // //useEffect入れてみる。
  // const useEffect(() => {
  //   //第一引数には実行したい副作用関数を記述
  //   const 
  //   }
  // },[依存する変数の配列])//第二引数には副作用関数の実行タイミングを制御する依存データを記述。
  // const filteredSchedules = schedules.filter(
  //   (schedule) =>
  //     schedule.club_id === selectedClub &&
  //     schedule.date === format(selectedDate || new Date(), "yyyy-MM-dd")
  // )
  //.filter()は「配列の中から条件にあうものだけを取り出す」メソッド。ここでは「選ばれたクラブIDと選ばれた日付に一致するスケジュールだけを抽出。supabaseのクエリパラメータでもフィルタしてるが念押し的にフィルタするケースが多い。
  //このfilteredSchedulesは今選ばれているクラブと日付に一致するスケジュールを抽出はできている。が書かれている場所は重要。Reactの関数コンポーネントのなかで書かれないと更新されても実行されない。

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
                  <Select value={selectedClub} onValueChange={handleClubChange}>
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
                          onSelect={handleDateChange}
                          initialFocus
                          disabled={(date) => date < new Date()}
                          className="rounded-xl"
                        />
                      </PopoverContent>
                    </Popover>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="w-full rounded-xl" onClick={() => handleDateChange(new Date())}>
                        今日
                      </Button>
                      <Button variant="outline" size="sm" className="w-full rounded-xl" onClick={() => handleDateChange(addDays(new Date(), 1))}>
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

            {schedules.length > 0 ? (
              <div className="grid gap-4">
                {schedules.map((schedule) => (
                  <Card key={schedule.id} className="rounded-xl shadow-md">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {schedule.start_time} - {schedule.end_time}
                        </CardTitle>
                        <Badge variant={schedule.available_slots > 0 ? "outline" : "destructive"}>
                          {schedule.available_slots > 0 ? `残り${schedule.available_slots}枠` : "満員"}
                        </Badge>
                      </div>
                      <CardDescription>
                        インストラクター: {schedule.staff?.name ||"取得失敗"} | レベル: {schedule.level}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="p-6">
                      <Button className="w-full rounded-xl" disabled={schedule.available_slots === 0} asChild>
                        <a href={`/reservation/${schedule.id}`}>
                          {schedule.available_slots > 0 ? "予約する" : "予約できません"}
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
