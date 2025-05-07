"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Volume1 } from "lucide-react"
import { Slider } from "@/components/ui/slider"

export default function AudioController() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [audioError, setAudioError] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    try {
      audioRef.current = new Audio("/placeholder-audio.mp3")

      // Handle audio loading error
      audioRef.current.addEventListener("error", () => {
        console.error("Audio file could not be loaded")
        setAudioError(true)
      })

      audioRef.current.loop = true
      audioRef.current.volume = volume
    } catch (error) {
      console.error("Error initializing audio:", error)
      setAudioError(true)
    }

    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const toggleAudio = () => {
    if (!audioRef.current || audioError) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      const playPromise = audioRef.current.play()

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
          })
          .catch((error) => {
            console.error("Audio playback failed:", error)
            setAudioError(true)
          })
      }
    }

    setIsPlaying(!isPlaying)
  }

  if (audioError) {
    return (
      <div className="bg-black/50 backdrop-blur-md p-3 rounded-lg border border-white/20 flex items-center space-x-2">
        <span className="text-xs text-gray-400">No Audio</span>
      </div>
    )
  }

  return (
    <div className="bg-black/50 backdrop-blur-md p-3 rounded-lg border border-white/20 flex items-center space-x-2">
      <Button variant="ghost" size="icon" onClick={toggleAudio} className="text-white">
        {isPlaying ? (
          volume > 0.5 ? (
            <Volume2 className="h-5 w-5" />
          ) : (
            <Volume1 className="h-5 w-5" />
          )
        ) : (
          <VolumeX className="h-5 w-5" />
        )}
      </Button>

      <Slider
        value={[volume * 100]}
        onValueChange={(value) => setVolume(value[0] / 100)}
        max={100}
        step={1}
        className="w-24"
      />
    </div>
  )
}
