"use client"

import React from "react"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@radix-ui/react-select"
import { Check, ChevronDown } from "lucide-react"

const mockIssues = [
  { id: 1, title: "Pothole on Main St", status: "pending", assignedTo: "John" },
  { id: 2, title: "Streetlight broken", status: "in-progress", assignedTo: "Alice" },
  { id: 3, title: "Graffiti removal", status: "resolved", assignedTo: "Bob" },
]

export function IssueManagementTable() {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className="border p-2 text-left">ID</th>
          <th className="border p-2 text-left">Title</th>
          <th className="border p-2 text-left">Status</th>
          <th className="border p-2 text-left">Assigned To</th>
        </tr>
      </thead>
      <tbody>
        {mockIssues.map((issue) => (
          <tr key={issue.id}>
            <td className="border p-2">{issue.id}</td>
            <td className="border p-2">{issue.title}</td>
            <td className="border p-2">
              <Select defaultValue={issue.status}>
                <SelectTrigger>
                  {/* Wrap icon + value in a single span */}
                  <span className="flex items-center justify-between w-full">
                    <SelectValue />
                    <ChevronDown className="ml-2 w-4 h-4 text-muted-foreground" />
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">
                    <span className="flex items-center gap-2">
                      <Check className="w-4 h-4" /> Pending
                    </span>
                  </SelectItem>
                  <SelectItem value="in-progress">
                    <span className="flex items-center gap-2">
                      <Check className="w-4 h-4" /> In Progress
                    </span>
                  </SelectItem>
                  <SelectItem value="resolved">
                    <span className="flex items-center gap-2">
                      <Check className="w-4 h-4" /> Resolved
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </td>
            <td className="border p-2">{issue.assignedTo}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
