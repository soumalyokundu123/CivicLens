"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Check } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
  // --- NEW: pagination state ---
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [totalIssues, setTotalIssues] = useState<number>(0)
  const PAGE_SIZE = 10

  const fetchIssues = async (pageArg: number = page) => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`${BACKEND_BASE}/issues/all?page=${pageArg}&limit=${PAGE_SIZE}`)
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
      const pg = json?.data?.pagination
      if (pg) {
        setTotalPages(pg.totalPages || 1)
        setTotalIssues(pg.totalIssues || data.length)
        setPage(pg.currentPage || pageArg)
      } else {
        setTotalPages(1)
        setTotalIssues(data.length)
        setPage(1)
      }
    } catch (e: any) {
      setError(e?.message || "Failed to load issues")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIssues(1)
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
    <div className="w-full">
      <div className="overflow-x-auto rounded-lg border bg-card">
        <table className="w-full table-auto text-sm">
          <thead className="bg-muted/60">
            <tr>
              <th className="p-3 text-left font-medium">Issue ID</th>
              <th className="p-3 text-left font-medium">Title</th>
              <th className="p-3 text-left font-medium">Category</th>
              <th className="p-3 text-left font-medium">Location</th>
              <th className="p-3 text-left font-medium">Coords</th>
              <th className="p-3 text-left font-medium">Images</th>
              <th className="p-3 text-left font-medium">Status</th>
              <th className="p-3 text-left font-medium">Priority</th>
              <th className="p-3 text-left font-medium">Assigned To</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue, idx) => (
              <tr key={issue.issueId} className={idx % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                <td className="p-3 align-middle font-mono text-xs whitespace-nowrap">{issue.issueId}</td>
                <td className="p-3 align-middle">{issue.title}</td>
                <td className="p-3 align-middle whitespace-nowrap">{issue.category}</td>
                <td className="p-3 align-middle">{issue.location || "—"}</td>
                <td className="p-3 align-middle whitespace-nowrap">
                  {issue.coordinates ? `${issue.coordinates.lat.toFixed(4)}, ${issue.coordinates.lng.toFixed(4)}` : "—" }
                </td>
                <td className="p-3 align-middle">{issue.images?.length ?? 0}</td>
                <td className="p-3 align-middle">
                  <Select
                    value={issue.status}
                    onValueChange={(val) => updateIssue(issue.issueId, { status: val as Issue["status"] })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-3 align-middle">
                  <Select
                    value={issue.priority}
                    onValueChange={(val) => updateIssue(issue.issueId, { priority: val as Issue["priority"] })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-3 align-middle">
                  <Select
                    value={issue.assignedTo?._id ?? "UNASSIGNED"}
                    onValueChange={(val) => updateIssue(issue.issueId, { assignedTo: (val === "UNASSIGNED" ? undefined : val) })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UNASSIGNED">Unassigned</SelectItem>
                      {workers.map((w) => (
                        <SelectItem key={w._id} value={w._id}>{w.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-2 mt-4">
          <div className="text-sm text-muted-foreground">
            Showing page {page} of {totalPages} ({totalIssues} total)
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={page <= 1}
              onClick={() => fetchIssues(page - 1)}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => {
              const p = idx + 1
              return (
                <button
                  key={p}
                  className={`px-3 py-1 border rounded ${p === page ? "bg-accent text-accent-foreground" : ""}`}
                  onClick={() => fetchIssues(p)}
                >
                  {p}
                </button>
              )
            })}
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={page >= totalPages}
              onClick={() => fetchIssues(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
