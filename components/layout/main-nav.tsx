"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function MainNav() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/",
      label: "ホーム",
      active: pathname === "/",
    },
    {
      href: "/clubs",
      label: "クラブ一覧",
      active: pathname === "/clubs" || pathname.startsWith("/clubs/"),
    },
    {
      href: "/calendar",
      label: "予約カレンダー",
      active: pathname === "/calendar",
    },
    {
      href: "/mypage",
      label: "マイページ",
      active: pathname === "/mypage" || pathname.startsWith("/mypage/"),
    },
  ]

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {routes.map((route) => (
        <Button key={route.href} variant={route.active ? "default" : "ghost"} asChild>
          <Link
            href={route.href}
            className={cn(
              "text-sm font-medium transition-colors",
              route.active ? "text-primary-foreground" : "text-muted-foreground hover:text-primary",
            )}
          >
            {route.label}
          </Link>
        </Button>
      ))}
    </nav>
  )
}
