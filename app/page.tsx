import SolarSystem from "@/components/solar-system"
import Navbar from "@/components/navbar"
import AudioController from "@/components/audio-controller"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-black">
      <Navbar />
      <div className="relative w-full h-screen">
        <SolarSystem />
        <div className="absolute bottom-4 right-4">
          <AudioController />
        </div>
      </div>
    </main>
  )
}
