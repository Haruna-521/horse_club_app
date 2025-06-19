"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
//↓ユーザー入力フォームのバリデーション（入力チェック）を行うためのスキーマ（ルール定義）をしている。Zod（ゾッド）というバリデーションルールをコードで定義できるライブラリを使っている。
//formSchemaという変数に3つの入力項目のチェックルールを定義したスキーマを作っている。z.の後に各入力項目の条件を記述。Zodの構文で型＋バリデーションルール＋エラーメッセージを組み合わせて書いている。emaiやpasswordなどはそれぞれキー（項目名）。
//z.string():文字列であることをチェック。.email():その文字列がメールアドレス形式かどうかチェック。message:からはバリデーションに失敗したときのエラーメッセージ
const formSchema = z.object({
  email: z.string().email({
    message: "有効なメールアドレスを入力してください",
  }),
  password: z.string().min(6, {
    message: "パスワードは6文字以上で入力してください",
  }),
  fullName: z.string().min(2, {
    message: "氏名は2文字以上で入力してください",
  }),
})
//以下はReactの関数コンポーネント。exportしているのでほかのファイルからこの関数をimportできる。やってることはフォームを表示・処理する機能をもったＵＩコンポーネントを作る。
//Next.jsではappまたはpagesフォルダにあるファイルの名前がURLのパスと対応している。useRouterとはReavtのカスタムフックというやつで現在のルーティング状態を操作できる。useRouterのimportとconst router=useRouter()で「ページ移動などができる便利なオブジェクト」が使えるようになった。
//toastについて：トースト（通知）表示のための関数。usetoastはライブラリで提供されるカスタムフックというやつ。
export function RegisterForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)//useStateはReactのフックで「状態（ステート）を管理。isLoading(今処理中かどうか)の状態を持っている。isLoading:現在の状態（trueかfalse）setIsLoading:その状態を更新するための関数。useState(false):初期値はfalse(処理していない状態)→なんでtrueかfalseかわかるのかというと。。。falseを初期値としたことでTypeScriptは「これはboolean型だ」と自動で推論する。つまりuseState()の中に入れた値の型がそのままstateの型になるということ。
//useFormはReact Hook Formの関数。「フォームのロジック（入力取得・エラー管理など））を提供する。
//<z.infer<typeof formSchema>>はZodのスキーマ（formSchema）から型を自動で推論してReact Hook Formに伝える。inferは推論という意味。なんでformSchemaがあるのにz.inferで自動推論するのか。。。目的が違うから。formschema(Zod)は実行時にバリデーションとして働くけれどほかは特にやらない。対してz.infer(TypeScriptの型)は実行時には何もしないけれどコードを書くときに型を補完したりフォームで型をチェックしたりAPIやDBとのやりとりを安全に行うために使われる。Zodの方は実行時つまりユーザーがフォームに入力して送信した瞬間に使われて満たしていなければエラーが表示される。TypeScript（z.infer)の方は開発時に別のところでemailとかを出してもTypeScriptがわからないと言ってくる。そのためTypeScriptにformSchemaをみて型を補完してねーーと伝えているということ。formSchemaを参照して推論するので自分で手書きするより漏れや抜けがないのでエラーが出にくいよね！
//resolverはバリデーションの方法を指定するオプション。zodRResolverはReact Hook FormでZodをつかってバリデーションするための関数。
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),//resolver:React Hook Formにどのルーツでバリデーションをするかを教える。zodReasolver():Zod用に作られた専用の変換関数。formSchema:ルールの本体で私が定義したやつ。useForm({})のなかでresolverというキーが必要なのはそういう決まりだから。zodResolver(formSchema)という書き方も決まり（仕様）
    defaultValues: {//ここからのはuseFormに渡す初期値を設定している。ユーザーがまだ入力していないときは空っぽにしておくために""という空文字にしている。
      email: "",
      password: "",
      fullName: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {//onSubmitという関数を定義していてasyncなので非同期処理（時間のかかる処理）を行うよという宣言。引数の部分はz.infer（TypeScript）の自動推論で型を自動的にformSchemaを参照して取得してくれる。つまり、value={email:string,password:string,fullname:string}みたいな形で自動的にデータを入れてくれる。
    try {
      setIsLoading(true)

      // ユーザー登録
      const { data: authData, error: authError } = await supabase.auth.signUp({//これは分割代入ってやつ。supabaseの.signUp()はdata,errorの二つの値を返す。成功ならdataに情報が入って、失敗ならerrorにメッセージが入るのでそれをauthDataとauthErrorという名前にして使う。supabase.auth.signUpの処理を実行、awiatでその処理が終わるまで待つよといってる。
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
          },
        },
      })//emailもpasswordも認証処理で基本情報。valuesは入力内容がまとめて入ったオブジェクト。values.emailと書くことでvaluesのemailを取り出してねってことになる。
      //supabaseに認証（auth)とユーザープロフィールは分かれている。authで登録できるのは基本的にemailとpasswordだけ。名前やプロフィール画像などを一緒に保存したいときはoptions.dataの中に書く必要がある。これはsupabase側で「ユーザーごとの情報（メタデータ）」として管理される。なおここら辺はsupabaseが自動で持っているauth.usersという専用のテーブルが非表示で存在している。signUp()を使うとこのテーブルに自動で追加される。

      if (authError) {
        toast({
          title: "登録に失敗しました",
          description: authError.message,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "会員登録が完了しました",
        description: "メールアドレスの確認をお願いします",
      })

      router.push("/login")
    } catch (error) {
      toast({
        title: "エラーが発生しました",
        description: "登録に失敗しました。もう一度お試しください。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
//form.handleSubmit(onSubmit)はReact Hook Formが用意した関数でフォームが送信されたとき、入力値をバリデーションして、問題なければonSubmitにデータを渡してくれる。
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>氏名</FormLabel>
              <FormControl>
                <Input type="text" placeholder="山田 太郎" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>メールアドレス</FormLabel>
              <FormControl>
                <Input type="email" placeholder="example@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>パスワード</FormLabel>
              <FormControl>
                <Input type="password" placeholder="******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full rounded-xl" disabled={isLoading}>
          {isLoading ? "登録中..." : "会員登録"}
        </Button>
      </form>
    </Form>
  )
}
