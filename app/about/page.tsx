import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Target, Eye, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-background to-muted py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto text-center max-w-4xl">
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              About CivicLens
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">
              Bridging the gap between citizens and government through technology, transparency, and collaborative
              problem-solving.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
                We believe that every citizen deserves a voice in improving their community. CivicLens empowers
                residents to report issues, track progress, and work collaboratively with local government to create
                positive change.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle className="font-serif">Our Purpose</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    To create a transparent, efficient system that connects citizens with their local government,
                    ensuring community issues are addressed promptly and effectively.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                    <Eye className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle className="font-serif">Our Vision</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    A future where every community thrives through active citizen engagement, responsive governance, and
                    collaborative problem-solving powered by technology.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Helps Section */}
        <section className="bg-muted py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">How CivicLens Helps</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Citizens */}
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-foreground">For Citizens</h3>
                </div>
                <ul className="space-y-4 text-muted-foreground">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Easy reporting with photos, GPS location, and detailed descriptions</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Real-time tracking of issue status from submission to resolution</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Transparent communication with government agencies</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>AI-powered chatbot support for guidance and assistance</span>
                  </li>
                </ul>
              </div>

              {/* Government */}
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mr-4">
                    <Heart className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-foreground">For Government</h3>
                </div>
                <ul className="space-y-4 text-muted-foreground">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Centralized issue management with automated classification</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Priority-based assignment system for efficient resource allocation</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Analytics and reporting for data-driven decision making</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Improved citizen satisfaction through transparent processes</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-12">Our Core Values</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-4">Transparency</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Open communication and clear processes that build trust between citizens and government.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-4">Efficiency</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Streamlined workflows and smart technology that accelerate issue resolution.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-4">Community</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Fostering collaboration and civic engagement to build stronger, more connected communities.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
