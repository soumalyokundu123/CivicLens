"use client"

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

// Mock data for charts
const issueTypeData = [
  { name: "Road Issues", value: 45, color: "#8b5cf6" },
  { name: "Infrastructure", value: 32, color: "#3b82f6" },
  { name: "Public Spaces", value: 28, color: "#10b981" },
  { name: "Public Safety", value: 15, color: "#f59e0b" },
  { name: "Utilities", value: 12, color: "#ef4444" },
  { name: "Other", value: 8, color: "#6b7280" },
]

const monthlyTrendData = [
  { month: "Jul", reported: 45, resolved: 38 },
  { month: "Aug", reported: 52, resolved: 45 },
  { month: "Sep", reported: 48, resolved: 42 },
  { month: "Oct", reported: 61, resolved: 55 },
  { month: "Nov", reported: 58, resolved: 52 },
  { month: "Dec", reported: 67, resolved: 59 },
  { month: "Jan", reported: 72, resolved: 65 },
]

const resolutionTimeData = [
  { category: "Road Issues", avgDays: 4.2 },
  { category: "Infrastructure", avgDays: 6.8 },
  { category: "Public Spaces", avgDays: 2.1 },
  { category: "Public Safety", avgDays: 1.5 },
  { category: "Utilities", avgDays: 5.3 },
  { category: "Other", avgDays: 3.7 },
]

export function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-2xl font-bold text-foreground">140</p>
            <p className="text-sm text-muted-foreground">Total Issues</p>
            <p className="text-xs text-green-600 mt-1">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-2xl font-bold text-foreground">76%</p>
            <p className="text-sm text-muted-foreground">Resolution Rate</p>
            <p className="text-xs text-green-600 mt-1">+3% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-2xl font-bold text-foreground">3.8</p>
            <p className="text-sm text-muted-foreground">Avg. Days to Resolve</p>
            <p className="text-xs text-red-600 mt-1">+0.2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-2xl font-bold text-foreground">4.6</p>
            <p className="text-sm text-muted-foreground">Citizen Satisfaction</p>
            <p className="text-xs text-green-600 mt-1">+0.3 from last month</p>
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
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Monthly Trends</CardTitle>
            <CardDescription>Issues reported vs resolved over time</CardDescription>
          </CardHeader>
          <CardContent>
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
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={resolutionTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis label={{ value: "Days", angle: -90, position: "insideLeft" }} />
                <Tooltip formatter={(value) => [`${value} days`, "Average Resolution Time"]} />
                <Bar dataKey="avgDays" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
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
