"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationSystem } from "@/components/notification-system"
import { Menu, X, MapPin, User as UserIcon, LogOut } from "lucide-react"

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.split(";").map(c => c.trim()).find(c => c.startsWith(name + "="))
  return match ? decodeURIComponent(match.split("=")[1]) : null
}

function decodeJwtPayload(token: string): any | null {
  try {
    const payload = token.split(".")[1]
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<{ name?: string; category?: string } | null>(null)

  useEffect(() => {
    const token = readCookie("token")
    if (!token) { setUser(null); return }
    const payload = decodeJwtPayload(token)
    if (payload) {
      setUser({ name: payload?.name || payload?.username || "User", category: payload?.category })
    } else {
      setUser(null)
    }
  }, [])

  const signOut = () => {
    // Expire cookie
    document.cookie = "token=; path=/; max-age=0";
    setUser(null)
    window.location.href = "/login"
  }

  const dashboardPath = user?.category === 'admin' ? '/admin' : user?.category === 'worker' ? '/worker' : user?.category === 'citizen' ? '/citizen' : null

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <MapPin className="h-8 w-8 text-accent" />
            <span className="font-serif text-xl font-bold text-foreground">CivicLens</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
              Contact
            </Link>
            {/* <Link href="/admin" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
              Government
            </Link> */}
            {/* <Link href="/worker" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
              Worker
            </Link> */}
            <div className="flex items-center space-x-4">
              <NotificationSystem />
              <ThemeToggle />
              {user ? (
                <div className="flex items-center gap-3">
                  <Link href="/profile" className="flex items-center gap-2 rounded-md border px-3 py-1.5 hover:bg-muted transition-colors">
                    <UserIcon className="h-4 w-4" />
                    <span className="text-sm font-medium text-foreground">{user.name}</span>
                    {user.category && (
                      <span className="text-xs text-muted-foreground">({user.category})</span>
                    )}
                  </Link>
                  {dashboardPath && (
                    <Button asChild variant="secondary">
                      <Link href={dashboardPath}>My Dashboard</Link>
                    </Button>
                  )}
                  <Button variant="outline" onClick={signOut} className="flex items-center gap-2">
                    <LogOut className="h-4 w-4" /> Sign out
                  </Button>
                </div>
              ) : (
                <Button asChild>
                  <Link href="/login">Login</Link>
                </Button>
              )}
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 md:hidden">
            <NotificationSystem />
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <nav className="flex flex-col space-y-4 px-4 py-6">
              <Link
                href="/"
                className="text-sm font-medium text-foreground hover:text-accent transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-foreground hover:text-accent transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium text-foreground hover:text-accent transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              {/* <Link
                href="/admin"
                className="text-sm font-medium text-foreground hover:text-accent transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Government Dashboard
              </Link> */}
              {/* <Link
                href="/worker"
                className="text-sm font-medium text-foreground hover:text-accent transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Worker Dashboard
              </Link> */}
              {/* <Button asChild className="w-full">
                <Link href="/citizen" onClick={() => setIsMenuOpen(false)}>
                  Report Issue
                </Link> */}
                
              {/* </Button> */}
              {user ? (
                <>
                  <Link href="/profile" className="flex items-center gap-2 rounded-md border px-3 py-2 hover:bg-muted transition-colors">
                    <UserIcon className="h-4 w-4" />
                    <div className="text-sm">
                      <div className="font-medium text-foreground">{user.name}</div>
                      {user.category && <div className="text-muted-foreground">{user.category}</div>}
                    </div>
                  </Link>
                  {dashboardPath && (
                    <Button asChild className="w-full" onClick={() => setIsMenuOpen(false)}>
                      <Link href={dashboardPath}>My Dashboard</Link>
                    </Button>
                  )}
                  <Button className="w-full" onClick={() => { setIsMenuOpen(false); signOut() }}>
                    <LogOut className="h-4 w-4 mr-2" /> Sign out
                  </Button>
                </>
              ) : (
                <Button asChild className="w-full">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                </Button>
              )}

            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
