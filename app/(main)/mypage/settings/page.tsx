"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { supabase } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"

//formSchemaというバリデーションルールの塊を作っている。formSchemaという名前でZodのオブジェクトスキーマを定義。
//fullNameは文字列で2文字以上必須。
//emailはメールアドレス形式。.optional()は入力自体がなくてもOK。
//optional()の中にあるphone,address,bioは文字列で入力が任意。
const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "氏名は2文字以上で入力してください",
  }),
  email: z
    .string()
    .email({
      message: "有効なメールアドレスを入力してください",
    })
    .optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().optional(),
})


export default function SettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
//32：useRouter()という関数を用いてルーティング（ページ遷移など）を制御できるオブジェクトを取得している。例：更新後トップページへ戻るなど。
//33：useToast()というカスタムフック（useから始まるやつをフックHookという。自分で作ったuse〇〇をカスタムフックという）からtoastという関数を取り出している。トースト（画面に表示される一時的な通知メッセージ）をつかって、成功/エラーなどを表示。
//34:読み込み中かどうか管理るための状態（state)を作っている。useStateはReactの中で状態（state)を管理する仕組み。初期値はfalese（ローディングしていない状態から始めたいから）
//35:プロフィール画像（アバター）のURL管理をする状態。最初は（null=何もない）。型は文字列、またはnull。

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      bio: "",
    },
  })
//41:React Hook FormのuseFormを使ってフォームの状態を管理する。z.infer<typeof formSchema>はZodのスキーマから自動的に型を推測する。
//42:ZodとReact Hook Formをつなぐ設定をしている。zodResolverを使ってformSchemaに従ったバリデーション（入力チェック）を自動で行う。resolver:という書き方はReact Hook Formで決まっている。
//43:フォームの初期値。フォームに入力されていないときに表示される内容。今回は""なので空白。
  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          router.push("/login")
          return
        }
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        if (error) {
          throw error
        }
//54:useEffectはReactのフックでページが読み込まれたときや特定の条件が変わったときに一度だけ実行される処理。
//55:async(非同期処理、時間がかかる処理)をこの関数の中で使うよってこと。
//56:try...catchはエラーが起きるかもしれない処理を安全に行うために使う。tryの中でエラーが起きたらcatchに処理が移る。
//57:supabaseの認証機能(auth)を使って現在ログインしているユーザーのセッション情報を取得するための関数。authはログインなどの機能をまとめたモジュール。getSessionは今誰がログインしているかの確認に使われる。セッションとは「今ログインしているこの人が誰なのか」を一時的に記憶しておく仕組み。supabaseがログインしたユーザーにセッションID（鍵）を発行しそれをもとにこの人はこのユーザーと追跡できる仕組み。
//59:もし（if)ログインしていない（セッションがない!session)なら/loginページへリダイレクトし、処理を終了（return）
//64:supabaseのprofilesテーブルからすべてのカラムをえらんで、idが現在のユーザーID（セッションから取得したID）と一致するレコードだけ取得し結果が1件であることを前提として配列ではなく1つのオブジェクト（配列はモノを順番に並べたリストのようなもの。オブジェクトは名前付き（name:田中のようにkey:valueのセット）の情報の塊。1個しか返ってこない前提なので配列（リスト化）する必要がない）として取り出す。
//70:エラーがあれば明示的にthrow(投げる)してcatchに移行。throwはエラーを投げるという意味のJavaScriptの構文。この先の処理をやめてエラー扱いして！という命令。つまり、ここで強制的にエラーを起こしてcatchの処理に移行してという命令。
        if (data) {
          form.reset({
            fullName: data.full_name || "",
            email: session.user.email || "",
            phone: data.phone || "",
            address: data.address || "",
            bio: data.bio || "",
          })
          
          setAvatarUrl(data.avatar_url)
        }
      } catch (error) {
        console.error("Error loading profile:", error)
        toast({
          title: "エラーが発生しました",
          description: "プロフィール情報の読み込みに失敗しました",
          variant: "destructive",
        })
      }
    }
    
    loadProfile()
  }, [supabase, router, toast, form])
//80:if(data)という条件、例えば{full_name:"田中",phone:"08012345678"}みたいなオブジェクトをsupanaseから取得できたかを確認している。
//81:from.reset()はReact Hook Formというライブラリの機能。フォームに初期値をセットしなおす関数。=>取得したデータを初期値として設定するという意味がある。つまり表示されるフォームに保存されていたプロフィール情報を初期表示として反映させるという目的がある。
//82:data.full_nameがあればfull_nameに代入。なければエラー防止で""(空文字)を入れる。||(論理和演算子)は左側がfalseなら右側を使う。
//83:emailはsupabaseのsuth.usersにあり、profilesではないためこの書き方。
//89:setAvatarUlrでプロフィールのアバター画像を状態（avatarUrl)に保存している。
//91:tryの中でエラーが起きたとき、ここに飛んでくる。
//92:エラーが起きたこととその詳細をコンソールに出力する。デバッグ（原因調査のために必要。）
//93:UIにエラー通知のポップアップを表示している。variant:"destructive"は見た目をエラーっぽい赤にする指定。これは決まっているやつでほかにもバリエーションがある。
//101:async function loadProfile()を実行している。ここで実行されたので初めてプロフィールの読み込みが実践される。
//102:useEffectの配列の書き方。この場合、supabaseやrouterなどが変わったときにloadProfile()を再実行する。
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push("/login")
        return
      }
//113:async(非同期処理) function onsubmit(onsubmitという関数を宣言している) valuesはフォームに入力されたデータを受け取る引数。z.infer~はZodで定義した型から型を自動で推論するReact Hook Formの書き方。つまりフォームの入力を受け取って型をチェックしてねっていうこと。
//114:この中でエラーが起きたらcatchの処理に移行してね。
//115:setIsLoadingによってisLoadingという状態をtrueで保存する。今ロード（保存処理中です）という合図。
//117:.auth.getSessionはsupabaseの関数。今ログインしている人の情報を頂戴といっている。{data:{session}}はdataオブジェクトの中のsessionを直接取り出す構文。つまり現在ログインしている人のセッション情報を取得しており、awaitがあるのでその処理が終わるまで待機している。
//119:もしログインしていない状態（セッションがない）なら/loginページへ遷移するReact Router関数。retuenによって処理を終了している。
       await supabase
        .from('profiles')
        .update({
          full_name: values.fullName,
          phone: values.phone,
          address: values.address,
          bio: values.bio,
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.user.id)
    const {data,error} =await supabase
        .from('profiles')
        .select('*')
        .eq('id',session.user.id)
        .single()
      if (data) {
        form.reset({
          fullName:data.full_name || "",
          phone:data.phone || "",
          address: data.address || "",
          bio: data.bio || "",
        })
      }
//128:supabaseのupdateメソッドはconst {data,error} = await supabase.from('テーブル名').update(...)という形で、dataは成功時のデータ。errorは失敗時のエラー情報。今回の書き方は成功したデータは使わずにエラーだけが必要だからerrorだけを受け取っている。つまり、成功時のデータを受け取っていない上、それを表示する構造がない。よって修正。
//129:purofilesテーブルを 130:更新（update)して。 132:values.fullNameなどはフォームから受け取った値。
//135:updated_atにnew Date().toISOString()をつかって今の時刻を記録する。
//137:idに一致するデータ（本人のデータ）だけ）を更新する。
      if (error) {
        throw error
      }
//141:更新中にエラーが発生したらそのエラーをcatchに渡す（例外としてthrow,投げる）。throwは自分がいる関数のtry→catchへエラーを送るという意味。
      toast({
        title: "設定を保存しました",
        description: "プロフィール情報が更新されました",
      })
      
      router.refresh()
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "エラーが発生しました",
        description: "設定の保存に失敗しました",
        variant: "destructive",
      })
    }
  }
}