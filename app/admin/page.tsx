"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IssueManagementTable } from "@/components/issue-management-table"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { Shield, BarChart3, Users, AlertTriangle } from "lucide-react"

const BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("issues")
  const [stats, setStats] = useState<{ pending: number; inProgress: number; resolvedToday: number; avgResolutionHours: number | null } | null>(null)
  const [loadingStats, setLoadingStats] = useState(false)
  const [statsError, setStatsError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true)
        setStatsError(null)
        const res = await fetch(`${BACKEND_BASE}/issues/stats`)
        if (!res.ok) throw new Error(`Failed to load stats (${res.status})`)
        const json = await res.json()
        setStats(json?.data || null)
      } catch (e: any) {
        setStatsError(e?.message || "Failed to load stats")
      } finally {
        setLoadingStats(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-background to-muted py-12 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-8 w-8 text-accent" />
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                Government Admin Dashboard
              </h1>
            </div>
            <p className="text-lg text-muted-foreground text-pretty">
              Manage civic issues, assign field workers, and track community improvement progress
            </p>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Pending Issues</p>
                      <p className="text-2xl font-bold text-foreground">{loadingStats ? '…' : (stats?.pending ?? 0)}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">In Progress</p>
                      <p className="text-2xl font-bold text-foreground">{loadingStats ? '…' : (stats?.inProgress ?? 0)}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Resolved Today</p>
                      <p className="text-2xl font-bold text-foreground">{loadingStats ? '…' : (stats?.resolvedToday ?? 0)}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Avg. Resolution</p>
                      <p className="text-2xl font-bold text-foreground">
                        {loadingStats ? '…' : (stats?.avgResolutionHours != null ? `${(stats.avgResolutionHours / 24).toFixed(1)}d` : '—')}
                      </p>
                    </div>
                    <Shield className="h-8 w-8 text-accent" />
                  </div>
                </CardContent>
              </Card>
            </div>
            {statsError && (
              <p className="text-sm text-red-500">{statsError}</p>
            )}
          </div>
        </section>

        {/* Dashboard Tabs */}
        <section className="py-2 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-6xl">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* Tab Buttons */}
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="issues">
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Issue Management
                  </span>
                </TabsTrigger>

                <TabsTrigger value="analytics">
                  <span className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Analytics
                  </span>
                </TabsTrigger>
              </TabsList>

              {/* Issues Tab */}
              <TabsContent value="issues">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-accent" />
                      Issue Management
                    </CardTitle>
                    <CardDescription>
                      Review, prioritize, and assign civic issues to field workers for resolution.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <IssueManagementTable />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics">
                <AnalyticsDashboard />
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
