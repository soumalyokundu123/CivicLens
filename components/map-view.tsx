"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Layers, Filter } from "lucide-react"

interface MapIssue {
  id: string
  title: string
  category: string
  status: "pending" | "in-progress" | "resolved"
  priority: "low" | "medium" | "high"
  lat: number
  lng: number
  dateSubmitted: string
}

// Mock issues with coordinates
const mockMapIssues: MapIssue[] = [
  {
    id: "CIV-A1B2C3D4",
    title: "Large pothole on Main Street",
    category: "Road Issues",
    status: "pending",
    priority: "high",
    lat: 40.7128,
    lng: -74.006,
    dateSubmitted: "2024-01-15",
  },
  {
    id: "CIV-E5F6G7H8",
    title: "Broken streetlight in park",
    category: "Infrastructure",
    status: "in-progress",
    priority: "medium",
    lat: 40.7589,
    lng: -73.9851,
    dateSubmitted: "2024-01-10",
  },
  {
    id: "CIV-I9J0K1L2",
    title: "Graffiti on public building",
    category: "Public Spaces",
    status: "pending",
    priority: "low",
    lat: 40.7505,
    lng: -73.9934,
    dateSubmitted: "2024-01-18",
  },
  {
    id: "CIV-M3N4O5P6",
    title: "Overflowing trash bin",
    category: "Public Spaces",
    status: "resolved",
    priority: "medium",
    lat: 40.7282,
    lng: -73.7949,
    dateSubmitted: "2024-01-12",
  },
]

export function MapView() {
  const [issues, setIssues] = useState<MapIssue[]>(mockMapIssues)
  const [selectedIssue, setSelectedIssue] = useState<MapIssue | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.006 })

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ lat: latitude, lng: longitude })
          setMapCenter({ lat: latitude, lng: longitude })
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }, [])

  const getStatusColor = (status: MapIssue["status"]) => {
    switch (status) {
      case "pending":
        return "#f59e0b"
      case "in-progress":
        return "#3b82f6"
      case "resolved":
        return "#10b981"
      default:
        return "#6b7280"
    }
  }

  const getPrioritySize = (priority: MapIssue["priority"]) => {
    switch (priority) {
      case "high":
        return 16
      case "medium":
        return 12
      case "low":
        return 8
      default:
        return 12
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Map Container */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif flex items-center gap-2">
              <MapPin className="h-5 w-5 text-accent" />
              Issue Location Map
            </CardTitle>
            <CardDescription>Interactive map showing all reported issues in your area</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Simulated Map Interface */}
            <div className="relative bg-muted rounded-lg h-96 overflow-hidden">
              {/* Map Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900">
                {/* Grid lines to simulate map */}
                <div className="absolute inset-0 opacity-20">
                  <div className="grid grid-cols-8 grid-rows-6 h-full">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <div key={i} className="border border-gray-400"></div>
                    ))}
                  </div>
                </div>

                {/* Street labels */}
                <div className="absolute top-4 left-4 text-xs font-medium text-muted-foreground bg-background/80 px-2 py-1 rounded">
                  Main Street
                </div>
                <div className="absolute bottom-16 right-8 text-xs font-medium text-muted-foreground bg-background/80 px-2 py-1 rounded">
                  Central Park
                </div>
                <div className="absolute top-1/2 left-8 text-xs font-medium text-muted-foreground bg-background/80 px-2 py-1 rounded">
                  5th Avenue
                </div>

                {/* Issue Markers */}
                {issues.map((issue, index) => (
                  <div
                    key={issue.id}
                    className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
                    style={{
                      left: `${20 + index * 15}%`,
                      top: `${30 + index * 10}%`,
                    }}
                    onClick={() => setSelectedIssue(issue)}
                  >
                    <div
                      className="rounded-full border-2 border-white shadow-lg flex items-center justify-center"
                      style={{
                        backgroundColor: getStatusColor(issue.status),
                        width: getPrioritySize(issue.priority),
                        height: getPrioritySize(issue.priority),
                      }}
                    >
                      <MapPin className="h-2 w-2 text-white" />
                    </div>
                  </div>
                ))}

                {/* User Location */}
                {userLocation && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 bg-accent rounded-full border-2 border-white shadow-lg animate-pulse">
                      <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Map Controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button size="icon" variant="secondary" className="h-8 w-8">
                  <Navigation className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="secondary" className="h-8 w-8">
                  <Layers className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="secondary" className="h-8 w-8">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 text-xs">
                <h4 className="font-semibold mb-2">Legend</h4>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span>Pending</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span>In Progress</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Resolved</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Issue Details Sidebar */}
      <div className="lg:col-span-1">
        {selectedIssue ? (
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-lg">Issue Details</CardTitle>
              <CardDescription>Information about the selected issue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-1">{selectedIssue.title}</h3>
                <p className="text-sm text-muted-foreground font-mono">{selectedIssue.id}</p>
              </div>

              <div className="flex gap-2">
                <Badge
                  className={
                    selectedIssue.status === "pending"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                      : selectedIssue.status === "in-progress"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                  }
                >
                  {selectedIssue.status.replace("-", " ")}
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    selectedIssue.priority === "high"
                      ? "border-red-500 text-red-700 dark:text-red-400"
                      : selectedIssue.priority === "medium"
                        ? "border-orange-500 text-orange-700 dark:text-orange-400"
                        : "border-gray-500 text-gray-700 dark:text-gray-400"
                  }
                >
                  {selectedIssue.priority} priority
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-accent/20 rounded flex items-center justify-center">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                  </div>
                  <span>{selectedIssue.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {selectedIssue.lat.toFixed(4)}, {selectedIssue.lng.toFixed(4)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 flex items-center justify-center">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                  </div>
                  <span>Reported: {new Date(selectedIssue.dateSubmitted).toLocaleDateString()}</span>
                </div>
              </div>

              <Button className="w-full bg-transparent" variant="outline">
                View Full Details
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-serif text-lg font-semibold text-foreground mb-2">Select an Issue</h3>
              <p className="text-muted-foreground text-sm">
                Click on a marker on the map to view issue details and location information.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Map Statistics */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="font-serif text-base">Area Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Issues</span>
                <span className="font-medium">{issues.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pending</span>
                <span className="font-medium">{issues.filter((i) => i.status === "pending").length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">In Progress</span>
                <span className="font-medium">{issues.filter((i) => i.status === "in-progress").length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Resolved</span>
                <span className="font-medium">{issues.filter((i) => i.status === "resolved").length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
