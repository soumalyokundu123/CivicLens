"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Eye, Clock } from "lucide-react"

interface Issue {
  id: string
  title: string
  category: string
  status: "pending" | "in-progress" | "resolved"
  classification: string
  dateSubmitted: string
  location: string
  thumbnail?: string
}

// Mock data for demonstration
const mockIssues: Issue[] = [
  {
    id: "CIV-A1B2C3D4",
    title: "Large pothole on Main Street",
    category: "Road Issues",
    status: "in-progress",
    classification: "Pothole",
    dateSubmitted: "2024-01-15",
    location: "Main Street & 5th Avenue",
    thumbnail: "/pothole.jpg",
  },
  {
    id: "CIV-E5F6G7H8",
    title: "Broken streetlight in park",
    category: "Infrastructure",
    status: "resolved",
    classification: "Streetlight",
    dateSubmitted: "2024-01-10",
    location: "Central Park, North Entrance",
    thumbnail: "/streetlight2.jpg",
  },
  {
    id: "CIV-I9J0K1L2",
    title: "Graffiti on public building",
    category: "Public Spaces",
    status: "pending",
    classification: "Graffiti",
    dateSubmitted: "2024-01-18",
    location: "City Hall, East Wall",
    thumbnail: "/graffiti.jpg",
  },
  {
    id: "CIV-M3N4O5P6",
    title: "Overflowing trash bin",
    category: "Public Spaces",
    status: "resolved",
    classification: "Garbage",
    dateSubmitted: "2024-01-12",
    location: "Oak Street Bus Stop",
    thumbnail: "/garbageoverflow.jpg",
  },
]

export function IssueStatusList() {
  const [issues] = useState<Issue[]>(mockIssues)

  const getStatusColor = (status: Issue["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getStatusText = (status: Issue["status"]) => {
    switch (status) {
      case "pending":
        return "Pending Review"
      case "in-progress":
        return "In Progress"
      case "resolved":
        return "Resolved"
      default:
        return "Unknown"
    }
  }

  if (issues.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Eye className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-serif text-lg font-semibold text-foreground mb-2">No Issues Reported Yet</h3>
        <p className="text-muted-foreground mb-4">
          You haven't reported any issues yet. Click "Report Issue" to get started.
        </p>
        <Button variant="outline">Report Your First Issue</Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {issues.map((issue) => (
        <Card key={issue.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Thumbnail */}
              {issue.thumbnail && (
                <div className="flex-shrink-0">
                  <img
                    src={issue.thumbnail || "/placeholder.svg"}
                    alt={`${issue.title} thumbnail`}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Issue Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-serif font-semibold text-foreground text-lg leading-tight">{issue.title}</h3>
                    <p className="text-sm text-muted-foreground">ID: {issue.id}</p>
                  </div>
                  <Badge className={getStatusColor(issue.status)}>{getStatusText(issue.status)}</Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-4 h-4 bg-accent/20 rounded flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                    </div>
                    <span className="truncate">{issue.category}</span>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{new Date(issue.dateSubmitted).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{issue.location}</span>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">AI: {issue.classification}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
