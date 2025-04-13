"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Sun, Moon, Home, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { PLANETS } from "@/lib/planet-data"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  return (
    <nav className="w-full backdrop-blur-md bg-black/50 border-b border-white/10 fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-white font-bold text-xl">Solar Explorer</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link href="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              {PLANETS.map((planet) => (
                <Link
                  key={planet.id}
                  href={`/planet/${planet.id}`}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  style={{ color: planet.color }}
                >
                  {planet.name}
                </Link>
              ))}
              <Link href="/about" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                About
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="ml-2"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-black/90 backdrop-blur-md">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className="text-white block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center space-x-2">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </div>
            </Link>
            {PLANETS.map((planet) => (
              <Link
                key={planet.id}
                href={`/planet/${planet.id}`}
                className="block px-3 py-2 rounded-md text-base font-medium"
                style={{ color: planet.color }}
                onClick={() => setIsOpen(false)}
              >
                {planet.name}
              </Link>
            ))}
            <Link
              href="/about"
              className="text-gray-300 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center space-x-2">
                <Info className="h-4 w-4" />
                <span>About</span>
              </div>
            </Link>
            <div className="px-3 py-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setTheme(theme === "dark" ? "light" : "dark")
                  setIsOpen(false)
                }}
                className="w-full justify-start"
              >
                {theme === "dark" ? (
                  <div className="flex items-center space-x-2">
                    <Sun className="h-4 w-4" />
                    <span>Light Mode</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Moon className="h-4 w-4" />
                    <span>Dark Mode</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
