import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MapPin, Users, Clock, CheckCircle, AlertTriangle, Wrench } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-background to-muted py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto text-center max-w-4xl">
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Report Civic Issues, Build Better Communities
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed text-pretty max-w-2xl mx-auto">
              Connect citizens with local government to efficiently report, track, and resolve community issues. From
              potholes to broken streetlights, make your voice heard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8 py-3">
                <Link href="/citizen">Report an Issue</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">How CivicLens Works</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                A simple, transparent process that connects citizens with their local government
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                    <MapPin className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle className="font-serif">Report Issues</CardTitle>
                  <CardDescription>
                    Easily report civic issues with photos, location, and detailed descriptions
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle className="font-serif">Government Review</CardTitle>
                  <CardDescription>
                    Local authorities receive, prioritize, and assign issues to field workers
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                    <CheckCircle className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle className="font-serif">Track Progress</CardTitle>
                  <CardDescription>Monitor the status of your reports from submission to resolution</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-muted py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-accent mb-2">2,847</div>
                <div className="text-sm text-muted-foreground">Issues Reported</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-accent mb-2">2,156</div>
                <div className="text-sm text-muted-foreground">Issues Resolved</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-accent mb-2">76%</div>
                <div className="text-sm text-muted-foreground">Resolution Rate</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-accent mb-2">3.2</div>
                <div className="text-sm text-muted-foreground">Avg. Days to Resolve</div>
              </div>
            </div>
          </div>
        </section>

        {/* Issue Types Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Common Issue Types</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                Report various types of civic issues that affect your community
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: AlertTriangle, title: "Road Issues", description: "Potholes, damaged roads, missing signs" },
                { icon: Wrench, title: "Infrastructure", description: "Broken streetlights, damaged sidewalks" },
                { icon: MapPin, title: "Public Spaces", description: "Park maintenance, graffiti, litter" },
                { icon: Users, title: "Public Safety", description: "Traffic concerns, unsafe conditions" },
                { icon: Clock, title: "Utilities", description: "Water leaks, power outages, drainage" },
                { icon: CheckCircle, title: "Other", description: "Any other community concerns" },
              ].map((item, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                        <item.icon className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <CardDescription className="text-sm">{item.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-accent py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-accent-foreground mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-lg text-accent-foreground/90 mb-8 max-w-2xl mx-auto text-pretty">
              Join thousands of citizens working together to improve their communities. Report an issue today and see
              the impact you can make.
            </p>
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-3">
              <Link href="/citizen">Get Started</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
