import Navbar from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Github, Twitter, Mail } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="pt-24 pb-16 px-4 md:px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">About Solar Explorer</h1>

        <Card className="bg-black/50 border-white/10 mb-8">
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
            <CardDescription>Making space education accessible and engaging</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Solar Explorer is an interactive educational platform designed to make learning about our solar system fun
              and engaging. Our 3D models and interactive elements allow users to explore the planets, their orbits, and
              fascinating facts about each celestial body.
            </p>
            <p>
              We believe that education should be immersive and interactive. By combining accurate scientific data with
              engaging visuals and interactive elements, we hope to inspire curiosity about space and astronomy in
              people of all ages.
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-black/50 border-white/10">
            <CardHeader>
              <CardTitle>Educational Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>Our content is based on the latest scientific data from:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>NASA Solar System Exploration</li>
                <li>European Space Agency (ESA)</li>
                <li>International Astronomical Union</li>
                <li>Space Telescope Science Institute</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-white/10">
            <CardHeader>
              <CardTitle>Technology</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>This interactive experience is built with:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Next.js for the application framework</li>
                <li>React Three Fiber for 3D rendering</li>
                <li>Three.js for WebGL-based graphics</li>
                <li>Tailwind CSS for styling</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-black/50 border-white/10">
          <CardHeader>
            <CardTitle>Contact & Connect</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="https://github.com/cybrite"
                target="_blank"
                className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-md transition-colors"
              >
                <Github className="h-5 w-5" />
                <span>GitHub</span>
              </Link>

              {/* <Link
                href="https://twitter.com"
                target="_blank"
                className="flex items-center space-x-2 bg-blue-800 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span>Twitter</span>
              </Link> */}

              <Link
                href="mailto:harshtanishq2002@gmail.com"
                className="flex items-center space-x-2 bg-purple-800 hover:bg-purple-700 px-4 py-2 rounded-md transition-colors"
              >
                <Mail className="h-5 w-5" />
                <span>Email Us</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
