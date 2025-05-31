"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { CalendarIcon } from "lucide-react"
import { addDays, format } from "date-fns"
import { ja } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// ダミーデータ
const dummyClubs = [
  { id: "1", name: "東京乗馬クラブ" },
  { id: "2", name: "横浜ホースパーク" },
  { id: "3", name: "千葉ライディングクラブ" },
]

const dummySchedules = [
  {
    id: "1",
    clubId: "1",
    date: "2024-05-31",
    startTime: "10:00",
    endTime: "11:00",
    instructor: "鈴木 一郎",
    level: "初級",
    availableSpots: 3,
    totalSpots: 5,
  },
  {
    id: "2",
    clubId: "1",
    date: "2024-05-31",
    startTime: "13:00",
    endTime: "14:00",
    instructor: "田中 花子",
    level: "中級",
    availableSpots: 2,
    totalSpots: 5,
  },
  {
    id: "3",
    clubId: "1",
    date: "2024-05-31",
    startTime: "15:00",
    endTime: "16:00",
    instructor: "佐藤 健",
    level: "上級",
    availableSpots: 0,
    totalSpots: 5,
  },
  {
    id: "4",
    clubId: "2",
    date: "2024-05-31",
    startTime: "11:00",
    endTime: "12:00",
    instructor: "山田 太郎",
    level: "初級",
    availableSpots: 4,
    totalSpots: 5,
  },
]

export default function CalendarPage() {
  const searchParams = useSearchParams()
  const initialClubId = searchParams.get("club") || "1"

  const [selectedClub, setSelectedClub] = useState(initialClubId)
  const [date, setDate] = useState<Date>(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  // 選択された日付のスケジュールをフィルタリング
  const filteredSchedules = dummySchedules.filter(
    (schedule) =>
      schedule.clubId === selectedClub && schedule.date === format(selectedDate || new Date(), "yyyy-MM-dd"),
  )

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">予約カレンダー</h1>
          <p className="text-muted-foreground">クラブと日付を選択して、予約可能なスケジュールを確認しましょう</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
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
                      {dummyClubs.map((club) => (
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
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full rounded-xl"
                        onClick={() => setSelectedDate(new Date())}
                      >
                        今日
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full rounded-xl"
                        onClick={() => setSelectedDate(addDays(new Date(), 1))}
                      >
                        明日
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="md:col-span-2">
            <h2 className="mb-4 text-xl font-semibold">
              {selectedDate ? format(selectedDate, "yyyy年MM月dd日 (eee)", { locale: ja }) : "日付を選択してください"}
              のスケジュール
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
