"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Check } from "lucide-react"

type Issue = {
  issueId: string
  title: string
  status: "pending" | "in-progress" | "resolved" | "rejected"
  priority: "low" | "medium" | "high" | "urgent"
  category: string
  assignedTo?: { _id: string; name: string; email: string } | null
  location?: string
  coordinates?: { lat: number; lng: number } | null
  images?: string[]
}

const BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"

export function IssueManagementTable() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [workers, setWorkers] = useState<Array<{ _id: string; name: string }>>([])

  const fetchIssues = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`${BACKEND_BASE}/issues/all?limit=50`)
      if (!res.ok) throw new Error(`Failed to load issues (${res.status})`)
      const json = await res.json()
      const data = (json?.data?.issues || []).map((i: any) => ({
        issueId: i.issueId,
        title: i.title,
        status: i.status,
        priority: i.priority,
        category: i.category,
        assignedTo: i.assignedTo ? { _id: i.assignedTo._id, name: i.assignedTo.name, email: i.assignedTo.email } : null,
        location: i.location || "",
        coordinates: i.coordinates ? { lat: i.coordinates.lat, lng: i.coordinates.lng } : null,
        images: Array.isArray(i.images) ? i.images : [],
      })) as Issue[]
      setIssues(data)
    } catch (e: any) {
      setError(e?.message || "Failed to load issues")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIssues()
    ;(async () => {
      try {
        const res = await fetch(`${BACKEND_BASE}/auth/users?category=worker`)
        if (res.ok) {
          const json = await res.json()
          const list = (json?.data || []).map((u: any) => ({ _id: u._id, name: u.name }))
          setWorkers(list)
        }
      } catch (e) {
        // ignore
      }
    })()
  }, [])

  const updateIssue = async (
    issueId: string,
    patch: Partial<Pick<Issue, "status" | "priority">> & { assignedTo?: string }
  ) => {
    try {
      const res = await fetch(`${BACKEND_BASE}/issues/${issueId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      })
      if (!res.ok) throw new Error("Update failed")
      await fetchIssues()
    } catch (e) {
      console.error(e)
    }
  }

  const statusOptions = useMemo(
    () => ["pending", "in-progress", "resolved", "rejected"] as const,
    []
  )
  const priorityOptions = useMemo(
    () => ["low", "medium", "high", "urgent"] as const,
    []
  )

  if (loading) return <div className="p-4">Loading issues…</div>
  if (error) return <div className="p-4 text-red-600">{error}</div>

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className="border p-2 text-left">Issue ID</th>
          <th className="border p-2 text-left">Title</th>
          <th className="border p-2 text-left">Category</th>
          <th className="border p-2 text-left">Location</th>
          <th className="border p-2 text-left">Coords</th>
          <th className="border p-2 text-left">Images</th>
          <th className="border p-2 text-left">Status</th>
          <th className="border p-2 text-left">Priority</th>
          <th className="border p-2 text-left">Assigned To</th>
        </tr>
      </thead>
      <tbody>
        {issues.map((issue) => (
          <tr key={issue.issueId}>
            <td className="border p-2 font-mono text-xs">{issue.issueId}</td>
            <td className="border p-2">{issue.title}</td>
            <td className="border p-2">{issue.category}</td>
            <td className="border p-2">{issue.location || "—"}</td>
            <td className="border p-2">
              {issue.coordinates ? `${issue.coordinates.lat.toFixed(4)}, ${issue.coordinates.lng.toFixed(4)}` : "—"}
            </td>
            <td className="border p-2">{issue.images?.length ?? 0}</td>
            <td className="border p-2">
              <select
                className="border rounded px-2 py-1"
                value={issue.status}
                onChange={(e) => updateIssue(issue.issueId, { status: e.target.value as Issue["status"] })}
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </td>
            <td className="border p-2">
              <select
                className="border rounded px-2 py-1"
                value={issue.priority}
                onChange={(e) => updateIssue(issue.issueId, { priority: e.target.value as Issue["priority"] })}
              >
                {priorityOptions.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </td>
            <td className="border p-2">
              <select
                className="border rounded px-2 py-1"
                value={issue.assignedTo?._id || ""}
                onChange={(e) => updateIssue(issue.issueId, { assignedTo: e.target.value || undefined })}
              >
                <option value="">Unassigned</option>
                {workers.map((w) => (
                  <option key={w._id} value={w._id}>{w.name}</option>
                ))}
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
