
//APIルート（処理）。/api/reservationsにアクセスがあったときに処理されるバックエンドのコードが格納されている。
import {NextResponse} from 'next/server'
import {supabase} from '@/lib/supabase/client'

//----GET(一覧取得)GETメソッドは「ブラウザがアクセスして一覧を見るとき」に使われる。supabaseからreservationsテーブルのすべてのデータを取得する。
export async function GET() {
    const {data, error} = await supabase.from('reservations').select('*')
    if (error) return NextResponse.json({error: error.message}, {status:500})
        return NextResponse.json(data)
}
//----POST(新規作成)POSTメソッドは「新しいデータを送る」時に使う。
export async function POST(request: globalThis.Request) {
    const body = await request.json()
    const {data, error} = await supabase.from('reservations').insert([body])
    if (error) return NextResponse.json({error: error.message}, {status:500})
        return NextResponse.json(data)
}