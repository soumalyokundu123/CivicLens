"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReportIssueForm } from "@/components/report-issue-form"
import { IssueStatusList } from "@/components/issue-status-list"
import { MapView } from "@/components/map-view"
import { ChatbotWidget } from "@/components/chatbot-widget"
import { Plus, List, MapPin } from "lucide-react"

export default function CitizenDashboard() {
  const [activeTab, setActiveTab] = useState("report")

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-background to-muted py-12 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Citizen Dashboard</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Report issues, track progress, and help improve your community
            </p>
          </div>
        </section>

        {/* Dashboard Content */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-6xl">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="report" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Report Issue
                </TabsTrigger>
                <TabsTrigger value="status" className="flex items-center gap-2">
                  <List className="h-4 w-4" />
                  View Status
                </TabsTrigger>
                <TabsTrigger value="map" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Map View
                </TabsTrigger>
              </TabsList>

              <TabsContent value="report">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif flex items-center gap-2">
                      <Plus className="h-5 w-5 text-accent" />
                      Report a New Issue
                    </CardTitle>
                    <CardDescription>
                      Help us improve your community by reporting civic issues. Include photos and detailed descriptions
                      for faster resolution.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ReportIssueForm />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="status">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif flex items-center gap-2">
                      <List className="h-5 w-5 text-accent" />
                      Your Reported Issues
                    </CardTitle>
                    <CardDescription>
                      Track the progress of your submitted issues and see resolution updates.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <IssueStatusList />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="map">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-accent" />
                      Issue Map View
                    </CardTitle>
                    <CardDescription>View all reported issues in your area on an interactive map.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MapView />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      <Footer />
      <ChatbotWidget />
    </div>
  )
}
