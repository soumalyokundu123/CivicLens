"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Upload, X, Camera } from "lucide-react"

interface ImagePreview {
  id: string
  file: File
  url: string
}

export function ReportIssueForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
  })
  const [images, setImages] = useState<ImagePreview[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleCategoryChange = (value: string) => {
    setFormData({
      ...formData,
      category: value,
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const id = Math.random().toString(36).substr(2, 9)
        const url = URL.createObjectURL(file)
        setImages((prev) => [...prev, { id, file, url }])
      }
    })
  }

  const removeImage = (id: string) => {
    setImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === id)
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url)
      }
      return prev.filter((img) => img.id !== id)
    })
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation({ lat: latitude, lng: longitude })
          setFormData({
            ...formData,
            location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          })
        },
        (error) => {
          console.error("Error getting location:", error)
          alert("Unable to get your location. Please enter it manually.")
        },
      )
    } else {
      alert("Geolocation is not supported by this browser.")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate a mock issue ID
    const issueId = `CIV-${Math.random().toString(36).substr(2, 8).toUpperCase()}`

    alert(`Issue reported successfully! Your tracking ID is: ${issueId}`)

    // Reset form
    setFormData({
      title: "",
      description: "",
      category: "",
      location: "",
    })
    setImages([])
    setLocation(null)
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Issue Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Issue Title *</Label>
        <Input
          id="title"
          name="title"
          type="text"
          placeholder="Brief description of the issue"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Select value={formData.category} onValueChange={handleCategoryChange} required>
          <SelectTrigger>
            <SelectValue placeholder="Select issue category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="road">Road & Traffic</SelectItem>
            <SelectItem value="infrastructure">Streetlights & Electricity</SelectItem>
            <SelectItem value="public-spaces">Water Supply & Drainage</SelectItem>
            <SelectItem value="public-safety">Waste & Sanitation</SelectItem>
            <SelectItem value="utilities">Public Safety</SelectItem>
            <SelectItem value="other">Public Infrastructure</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Detailed Description *</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Please provide a detailed description of the issue, including when you first noticed it and any relevant details..."
          rows={4}
          value={formData.description}
          onChange={handleInputChange}
          required
        />
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <div className="flex gap-2">
          <Input
            id="location"
            name="location"
            type="text"
            placeholder="Address or coordinates"
            value={formData.location}
            onChange={handleInputChange}
            className="flex-1"
          />
          <Button type="button" variant="outline" onClick={getCurrentLocation}>
            <MapPin className="h-4 w-4 mr-2" />
            Get GPS
          </Button>
        </div>
        {location && (
          <p className="text-sm text-muted-foreground">
            GPS coordinates captured: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
          </p>
        )}
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Label htmlFor="images">Photos (Optional)</Label>
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
          <input id="images" type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
          <Label htmlFor="images" className="cursor-pointer">
            <div className="flex flex-col items-center gap-2">
              <Camera className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Click to upload photos or drag and drop</span>
              <span className="text-xs text-muted-foreground">PNG, JPG up to 10MB each</span>
            </div>
          </Label>
        </div>

        {/* Image Previews */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {images.map((image) => (
              <Card key={image.id} className="relative">
                <CardContent className="p-2">
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt="Issue preview"
                    className="w-full h-24 object-cover rounded"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={() => removeImage(image.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Upload className="h-4 w-4 mr-2 animate-spin" />
            Submitting Issue...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            Submit Issue Report
          </>
        )}
      </Button>
    </form>
  )
}
