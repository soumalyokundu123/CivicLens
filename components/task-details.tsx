"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Calendar, MapPin, Play, CheckCircle, FileText, Camera, Clock, AlertTriangle } from "lucide-react"

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

interface TaskDetailsProps {
  task: Task
  onUpdateStatus: (taskId: string, status: Task["status"], notes?: string) => void
}

export function TaskDetails({ task, onUpdateStatus }: TaskDetailsProps) {
  const [notes, setNotes] = useState(task.notes || "")
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusUpdate = async (newStatus: Task["status"]) => {
    setIsUpdating(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onUpdateStatus(task.id, newStatus, notes)
    setIsUpdating(false)
  }

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

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString()
  }

  return (
    <div className="space-y-4">
      {/* Task Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="font-serif text-lg leading-tight">{task.title}</CardTitle>
              <CardDescription className="font-mono text-sm">{task.id}</CardDescription>
            </div>
            <div className="flex flex-col gap-2">
              <Badge className={getPriorityColor(task.priority)} variant="outline">
                {task.priority} priority
              </Badge>
              <Badge className={getStatusColor(task.status)}>
                {task.status === "assigned" && <Clock className="h-3 w-3 mr-1" />}
                {task.status === "in-progress" && <AlertTriangle className="h-3 w-3 mr-1" />}
                {task.status === "completed" && <CheckCircle className="h-3 w-3 mr-1" />}
                {task.status.replace("-", " ")}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Task Info */}
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-4 h-4 bg-accent/20 rounded flex items-center justify-center">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
              </div>
              <span>{task.category}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{task.location}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Assigned: {new Date(task.dateAssigned).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span
                className={`${
                  isOverdue(task.dueDate) && task.status !== "completed"
                    ? "text-red-600 font-medium"
                    : "text-muted-foreground"
                }`}
              >
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Overdue Warning */}
          {isOverdue(task.dueDate) && task.status !== "completed" && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded">
              <AlertTriangle className="h-4 w-4" />
              <span>This task is overdue</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Task Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Description
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">{task.description}</p>
        </CardContent>
      </Card>

      {/* Task Images */}
      {task.images && task.images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Images
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {task.images.map((image, index) => (
                <img
                  key={index}
                  src={image || "/placeholder.svg"}
                  alt={`Task image ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg border"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Work Notes</CardTitle>
          <CardDescription>Add notes about your progress or any issues encountered</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add notes about your work on this task..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Update Status</CardTitle>
          <CardDescription>Change the status of this task based on your progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {task.status === "assigned" && (
              <Button
                onClick={() => handleStatusUpdate("in-progress")}
                disabled={isUpdating}
                className="w-full justify-center"
              >
                <Play className="h-4 w-4 mr-2" />
                {isUpdating ? "Starting..." : "Start Working"}
              </Button>
            )}

            {task.status === "in-progress" && (
              <Button
                onClick={() => handleStatusUpdate("completed")}
                disabled={isUpdating}
                className="w-full justify-center"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {isUpdating ? "Completing..." : "Mark as Completed"}
              </Button>
            )}

            {task.status === "completed" && (
              <div className="text-center py-4">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Task completed successfully!</p>
              </div>
            )}

            <Separator />

            <div className="text-xs text-muted-foreground">
              <p>
                <strong>Assigned:</strong> Tasks assigned to you by administrators
              </p>
              <p>
                <strong>In Progress:</strong> Tasks you're actively working on
              </p>
              <p>
                <strong>Completed:</strong> Tasks you've finished successfully
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
