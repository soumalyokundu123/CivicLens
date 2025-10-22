"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock, AlertTriangle, CheckCircle } from "lucide-react"

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

interface TaskListProps {
  tasks: Task[]
  onSelectTask: (task: Task) => void
  selectedTaskId?: string
}

export function TaskList({ tasks, onSelectTask, selectedTaskId }: TaskListProps) {
  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "assigned":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "medium":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "low":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "assigned":
        return <Clock className="h-3 w-3" />
      case "in-progress":
        return <AlertTriangle className="h-3 w-3" />
      case "completed":
        return <CheckCircle className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString()
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-serif text-lg font-semibold text-foreground mb-2">No Tasks</h3>
        <p className="text-muted-foreground">No tasks in this category at the moment.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <Card
          key={task.id}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedTaskId === task.id ? "ring-2 ring-accent" : ""
          }`}
          onClick={() => onSelectTask(task)}
        >
          <CardContent className="p-4">
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif font-semibold text-foreground leading-tight truncate">{task.title}</h3>
                  <p className="text-sm text-muted-foreground font-mono">{task.id}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Badge className={getPriorityColor(task.priority)} variant="outline">
                    {task.priority}
                  </Badge>
                  <Badge className={getStatusColor(task.status)}>
                    {getStatusIcon(task.status)}
                    <span className="ml-1 capitalize">{task.status.replace("-", " ")}</span>
                  </Badge>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{task.description}</p>

              {/* Metadata */}
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-accent/20 rounded flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                  </div>
                  <span>{task.category}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate max-w-32">{task.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span
                    className={`${
                      isOverdue(task.dueDate) && task.status !== "completed" ? "text-red-600 font-medium" : ""
                    }`}
                  >
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Overdue Warning */}
              {isOverdue(task.dueDate) && task.status !== "completed" && (
                <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Task is overdue</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
