"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationSystem } from "@/components/notification-system"
import { Menu, X, MapPin } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
              <Button asChild>
                {/* <Link href="/citizen">Report Issue</Link> */}
              </Button>
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
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
              <Button asChild className="w-full">
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link></Button>

            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
