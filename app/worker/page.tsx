"use client"

import { useEffect, useMemo, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TaskList } from "@/components/task-list"
import { TaskDetails } from "@/components/task-details"
import { Wrench, CheckCircle, Clock, AlertTriangle } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  category: string
  status: "assigned" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  location: string
  dateAssigned: string
  dueDate: string
  images?: string[]
  notes?: string
}

const BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"

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

export default function FieldWorkerDashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [activeTab, setActiveTab] = useState("tasks")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [workerId, setWorkerId] = useState<string | null>(null)

  const fetchTasks = async (uid: string) => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`${BACKEND_BASE}/issues/all?assignedTo=${uid}&limit=100`)
      if (!res.ok) throw new Error(`Failed to load tasks (${res.status})`)
      const json = await res.json()
      const issues = (json?.data?.issues || []) as any[]
      const mapped: Task[] = issues.map((i) => ({
        id: i.issueId,
        title: i.title,
        description: i.description,
        category: i.category,
        status: i.status === "resolved" ? "completed" : i.status === "in-progress" ? "in-progress" : "assigned",
        priority: i.priority === "urgent" ? "high" : (i.priority as any),
        location: i.location || "",
        dateAssigned: new Date(i.submittedAt).toISOString().slice(0, 10),
        dueDate: "",
        images: Array.isArray(i.images) ? i.images : [],
        notes: "",
      }))
      setTasks(mapped)
    } catch (e: any) {
      setError(e?.message || "Failed to load tasks")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Read JWT token and decode worker id
    const token = readCookie("token")
    if (!token) { setError("Not logged in"); return }
    const payload = decodeJwtPayload(token)
    const uid = payload?._id || payload?.id
    const category = (payload?.category || "").toString().toLowerCase()
    if (!uid) { setError("Invalid session"); return }
    setWorkerId(uid)
    // Optionally guard non-worker
    if (category !== "worker") {
      // still allow fetch so admins can preview with a query override if needed
    }
    fetchTasks(uid)
  }, [])

  const updateTaskStatus = async (taskId: string, status: Task["status"], notes?: string) => {
    try {
      // Map UI statuses to backend
      const backendStatus = status === "completed" ? "resolved" : status === "assigned" ? "in-progress" : "in-progress"
      const res = await fetch(`${BACKEND_BASE}/issues/${taskId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: backendStatus })
      })
      if (!res.ok) throw new Error("Failed to update status")
      await fetchTasks(workerId!)
      // Keep panel selection consistent
      if (selectedTask?.id === taskId) {
        setSelectedTask(prev => prev ? { ...prev, status } as Task : null)
      }
    } catch (e) {
      setError("Update failed")
    }
  }

  const assignedTasks = useMemo(() => tasks.filter((t) => t.status === "assigned"), [tasks])
  const inProgressTasks = useMemo(() => tasks.filter((t) => t.status === "in-progress"), [tasks])
  const completedTasks = useMemo(() => tasks.filter((t) => t.status === "completed"), [tasks])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        {error && (
          <div className="px-4 py-2 text-sm text-red-500">{error}</div>
        )}
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-background to-muted py-12 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center gap-3 mb-4">
              <Wrench className="h-8 w-8 text-accent" />
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Field Worker Dashboard</h1>
            </div>
            <p className="text-lg text-muted-foreground text-pretty">
              Manage your assigned tasks and update issue resolution progress
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
                      <p className="text-sm font-medium text-muted-foreground">Assigned Tasks</p>
                      <p className="text-2xl font-bold text-foreground">{assignedTasks.length}</p>
                    </div>
                    <Clock className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                      <p className="text-2xl font-bold text-foreground">{inProgressTasks.length}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Completed Today</p>
                      <p className="text-2xl font-bold text-foreground">
                        {
                          completedTasks.filter(
                            (task) => new Date(task.dateAssigned).toDateString() === new Date().toDateString(),
                          ).length
                        }
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Completed</p>
                      <p className="text-2xl font-bold text-foreground">{completedTasks.length}</p>
                    </div>
                    <Wrench className="h-8 w-8 text-accent" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Dashboard Content */}
        <section className="py-2 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Task List */}
              <div className="lg:col-span-2">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="tasks" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      My Tasks ({assignedTasks.length + inProgressTasks.length})
                    </TabsTrigger>
                    <TabsTrigger value="in-progress" className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      In Progress ({inProgressTasks.length})
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Completed ({completedTasks.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="tasks">
                    <Card>
                      <CardHeader>
                        <CardTitle className="font-serif flex items-center gap-2">
                          <Clock className="h-5 w-5 text-accent" />
                          Active Tasks
                        </CardTitle>
                        <CardDescription>Tasks assigned to you that need attention</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <TaskList
                          tasks={[...assignedTasks, ...inProgressTasks]}
                          onSelectTask={setSelectedTask}
                          selectedTaskId={selectedTask?.id}
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="in-progress">
                    <Card>
                      <CardHeader>
                        <CardTitle className="font-serif flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-accent" />
                          In Progress Tasks
                        </CardTitle>
                        <CardDescription>Tasks you're currently working on</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <TaskList
                          tasks={inProgressTasks}
                          onSelectTask={setSelectedTask}
                          selectedTaskId={selectedTask?.id}
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="completed">
                    <Card>
                      <CardHeader>
                        <CardTitle className="font-serif flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-accent" />
                          Completed Tasks
                        </CardTitle>
                        <CardDescription>Tasks you've successfully completed</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <TaskList
                          tasks={completedTasks}
                          onSelectTask={setSelectedTask}
                          selectedTaskId={selectedTask?.id}
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Task Details */}
              <div className="lg:col-span-1">
                {selectedTask ? (
                  <TaskDetails task={selectedTask} onUpdateStatus={updateTaskStatus} />
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-serif text-lg font-semibold text-foreground mb-2">Select a Task</h3>
                      <p className="text-muted-foreground text-sm">
                        Click on a task from the list to view details and update its status.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
