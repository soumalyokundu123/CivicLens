"use client"

import { useState } from "react"
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

// Mock data for field worker tasks
const mockTasks: Task[] = [
  {
    id: "CIV-A1B2C3D4",
    title: "Large pothole on Main Street",
    description:
      "Deep pothole causing vehicle damage, approximately 2 feet wide and 6 inches deep. Located near the intersection with 5th Avenue.",
    category: "Road Issues",
    status: "assigned",
    priority: "high",
    location: "Main Street & 5th Avenue",
    dateAssigned: "2024-01-15",
    dueDate: "2024-01-18",
    images: ["/pothole.png"],
  },
  {
    id: "CIV-E5F6G7H8",
    title: "Broken streetlight in park",
    description:
      "Streetlight has been out for over a week, creating safety concerns for evening joggers. Light fixture appears to be damaged.",
    category: "Infrastructure",
    status: "in-progress",
    priority: "medium",
    location: "Central Park, North Entrance",
    dateAssigned: "2024-01-10",
    dueDate: "2024-01-17",
    images: ["/streetlight.jpg"],
    notes: "Ordered replacement bulb and fixture. Will install tomorrow morning.",
  },
  {
    id: "CIV-Q7R8S9T0",
    title: "Damaged sidewalk",
    description: "Cracked and uneven sidewalk creating tripping hazard for pedestrians. Multiple sections need repair.",
    category: "Infrastructure",
    status: "completed",
    priority: "medium",
    location: "Elm Street, Block 200",
    dateAssigned: "2024-01-08",
    dueDate: "2024-01-15",
    notes: "Completed sidewalk repair. Used concrete patch for cracks and leveled uneven sections.",
  },
]

export default function FieldWorkerDashboard() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [activeTab, setActiveTab] = useState("tasks")

  const updateTaskStatus = (taskId: string, status: Task["status"], notes?: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, status, notes: notes || task.notes } : task)),
    )
    // Update selected task if it's the one being updated
    if (selectedTask?.id === taskId) {
      setSelectedTask((prev) => (prev ? { ...prev, status, notes: notes || prev.notes } : null))
    }
  }

  const assignedTasks = tasks.filter((task) => task.status === "assigned")
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress")
  const completedTasks = tasks.filter((task) => task.status === "completed")

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
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
