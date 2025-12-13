import { useEffect, useCallback, useState } from "react"

export interface Slide {
  id: string
  content: React.ReactNode
  background?: string
}

interface SlideViewerProps {
  slides: Slide[]
}

export function SlideViewer({ slides }: SlideViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goNext = useCallback(() => {
    setCurrentIndex((i) => Math.min(i + 1, slides.length - 1))
  }, [slides.length])

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(i - 1, 0))
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault()
        goNext()
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault()
        goPrev()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [goNext, goPrev])

  const slide = slides[currentIndex]

  return (
    <div className="h-screen w-screen bg-black flex items-center justify-center overflow-hidden">
      <div
        className="w-full h-full max-w-[calc(100vh*16/9)] max-h-[calc(100vw*9/16)] aspect-video"
        style={{ background: slide?.background ?? "white" }}
      >
        {slide?.content}
      </div>
      <div className="absolute bottom-4 right-4 text-white/50 text-sm font-mono">
        {currentIndex + 1} / {slides.length}
      </div>
    </div>
  )
}
