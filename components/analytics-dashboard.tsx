"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  PieLabelRenderProps,
} from "recharts"

const BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"

export function AnalyticsDashboard() {
  const [issueTypeData, setIssueTypeData] = useState<Array<{ name: string; value: number; color: string }>>([])
  const [monthlyTrendData, setMonthlyTrendData] = useState<Array<{ month: string; reported: number; resolved: number }>>([])
  const [resolutionTimeData, setResolutionTimeData] = useState<Array<{ category: string; avgDays: number }>>([])
  const [totals, setTotals] = useState<{ totalIssues: number; resolvedTotal: number; resolutionRate: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`${BACKEND_BASE}/issues/analytics`)
        if (!res.ok) throw new Error(`Failed to load analytics (${res.status})`)
        const json = await res.json()
        const data = json?.data
        // Map categories to display names and colors
        const colorMap: Record<string, string> = {
          road: "#8b5cf6",
          infrastructure: "#3b82f6",
          "public-spaces": "#10b981",
          "public-safety": "#f59e0b",
          utilities: "#ef4444",
          other: "#6b7280",
        }
        const labelMap: Record<string, string> = {
          road: "Road Issues",
          infrastructure: "Infrastructure",
          "public-spaces": "Public Spaces",
          "public-safety": "Public Safety",
          utilities: "Utilities",
          other: "Other",
        }
        setIssueTypeData((data?.categoryDistribution || []).map((c: any) => ({ name: labelMap[c.name] || c.name, value: c.value, color: colorMap[c.name] || "#6b7280" })))
        setMonthlyTrendData(data?.monthlyTrend || [])
        setResolutionTimeData((data?.resolutionByCategory || []).map((r: any) => ({ category: labelMap[r.category] || r.category, avgDays: r.avgDays })))
        setTotals(data?.totals || null)
      } catch (e: any) {
        setError(e?.message || "Failed to load analytics")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-2xl font-bold text-foreground">{loading ? '…' : (totals?.totalIssues ?? 0)}</p>
            <p className="text-sm text-foreground">Total Issues</p>
            <p className="text-xs text-green-600 mt-1">&nbsp;</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-2xl font-bold text-foreground">{loading ? '…' : `${totals?.resolutionRate ?? 0}%`}</p>
            <p className="text-sm text-foreground">Resolution Rate</p>
            <p className="text-xs text-green-600 mt-1">&nbsp;</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-2xl font-bold text-foreground">{loading ? '…' : (typeof totals?.totalIssues === 'number' ? '' : '')}</p>
            <p className="text-sm text-foreground">Avg. Days to Resolve</p>
            <p className="text-xs text-red-600 mt-1">&nbsp;</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-2xl font-bold text-foreground">—</p>
            <p className="text-sm text-foreground">Citizen Satisfaction</p>
            <p className="text-xs text-green-600 mt-1">&nbsp;</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Issue Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Issue Types Distribution</CardTitle>
            <CardDescription>Breakdown of reported issues by category</CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <p className="text-red-500 text-sm">{error}</p>
            ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
  data={issueTypeData}
  cx="50%"
  cy="50%"
  outerRadius={80}
  dataKey="value"
  labelLine={false}
  label={({ name, percent }) => {
    // Ensure percent is a number
    const pct = typeof percent === "number" ? percent : 0
    return `${name} ${(pct * 100).toFixed(0)}%`
  }}
>
  {issueTypeData.map((entry, index) => (
    <Cell key={`cell-${index}`} fill={entry.color} />
  ))}
</Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Monthly Trends</CardTitle>
            <CardDescription>Issues reported vs resolved over time</CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <p className="text-red-500 text-sm">{error}</p>
            ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="reported" stroke="#8b5cf6" strokeWidth={2} name="Reported" />
                <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} name="Resolved" />
              </LineChart>
            </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 gap-6">
        {/* Resolution Time by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Average Resolution Time by Category</CardTitle>
            <CardDescription>How long it takes to resolve different types of issues</CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <p className="text-red-500 text-sm">{error}</p>
            ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={resolutionTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis label={{ value: "Days", angle: -90, position: "insideLeft" }} />
                <Tooltip formatter={(value) => [`${value} days`, "Average Resolution Time"]} />
                <Bar dataKey="avgDays" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Performance Summary</CardTitle>
          <CardDescription>Key insights and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-foreground mb-3">Top Performing Areas</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Public Safety issues resolved 40% faster than average</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Public Spaces category shows highest citizen satisfaction</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Overall resolution rate improved by 8% this quarter</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Areas for Improvement</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Infrastructure issues take 75% longer than target</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Road Issues category has highest volume, needs more resources</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Consider adding more field workers for peak periods</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
