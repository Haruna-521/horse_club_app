"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"

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
  const supabase = createClient()

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push("/login")
        return
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: values.fullName,
          phone: values.phone,
          address: values.address,
          bio: values.bio,
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.user.id)
      
      if (error) {
        throw error
      }
      
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
