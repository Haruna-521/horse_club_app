import type React from "react"
import { SiteHeader } from "@/components/layout/site-header"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2024 乗馬クラブ予約システム All Rights Reserved.
          </p>
          <div className="flex gap-4">
            <a href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              利用規約
            </a>
            <a href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              プライバシーポリシー
            </a>
            <a href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
              お問い合わせ
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
