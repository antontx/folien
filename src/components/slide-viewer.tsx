import { Children, isValidElement, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Link } from "@tanstack/react-router"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Separator } from "@/components/ui/separator"
import { Slide, type SlideProps } from "@/components/slide"
import { StepContext } from "@/components/step"

interface InternalSlide {
  content: React.ReactNode
  notes?: string
  steps: number
}

interface SlideViewerProps {
  children: React.ReactNode
}

export function SlideViewer({ children }: SlideViewerProps) {
  const slides = useMemo(() => {
    const result: InternalSlide[] = []
    Children.forEach(children, (child) => {
      if (isValidElement<SlideProps>(child) && child.type === Slide) {
        result.push({
          content: child.props.children,
          notes: child.props.notes,
          steps: child.props.steps ?? 0,
        })
      }
    })
    return result
  }, [children])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showBorder, setShowBorder] = useState(true)

  const slide = slides[currentIndex]
  const totalSteps = slide?.steps ?? 0

  const goNext = useCallback(() => {
    if (currentStep < totalSteps) {
      setCurrentStep((s) => s + 1)
    } else if (currentIndex < slides.length - 1) {
      setCurrentIndex((i) => i + 1)
      setCurrentStep(0)
    }
  }, [currentStep, totalSteps, currentIndex, slides.length])

  const goPrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1)
    } else if (currentIndex > 0) {
      const prevSlide = slides[currentIndex - 1]
      setCurrentIndex((i) => i - 1)
      setCurrentStep(prevSlide?.steps ?? 0)
    }
  }, [currentStep, currentIndex, slides])

  const slideRef = useRef<HTMLDivElement>(null)

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      slideRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return

      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault()
        goNext()
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault()
        goPrev()
      } else if (e.key === "Escape" && isFullscreen) {
        document.exitFullscreen()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [goNext, goPrev, isFullscreen])

  const isAtStart = currentIndex === 0 && currentStep === 0
  const isAtEnd = currentIndex === slides.length - 1 && currentStep === totalSteps

  return (
    <div className="h-screen w-screen bg-card flex overflow-hidden p-4 gap-4">
      <div className="flex flex-col shrink w-fit">
        <div className="pb-2 relative group px-2 pt-2 -mx-2 -mt-2">
          <Link to="/" className={`inline-block transition-opacity duration-200 ${showBorder ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            <h1 className="text-2xl font-serif tracking-tight text-foreground hover:text-foreground/80 transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
              atelier
            </h1>
          </Link>
        </div>
        <div ref={slideRef} className="flex items-center justify-center">
          <Card className={`${isFullscreen
            ? "w-screen h-screen max-w-none rounded-none"
            : "w-[1400px] max-w-[calc(100vw-320px-3rem)] aspect-video rounded-xl"
          } ${showBorder ? "" : "ring-0"}`}>
            <StepContext.Provider value={{ currentStep, totalSteps }}>
              {slide?.content}
            </StepContext.Provider>
          </Card>
        </div>
      </div>
      <Card className="flex-1 min-w-[320px] flex flex-col">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <ButtonGroup>
            <ButtonGroup>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
              >
                ⛶
              </Button>
              <Button
                variant={showBorder ? "outline" : "secondary"}
                size="sm"
                onClick={() => setShowBorder((v) => !v)}
              >
                ▢
              </Button>
            </ButtonGroup>
            <ButtonGroup>
              <Button
                variant="outline"
                size="sm"
                onClick={goPrev}
                disabled={isAtStart}
              >
                ←
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={goNext}
                disabled={isAtEnd}
              >
                →
              </Button>
            </ButtonGroup>
            <span className="text-xs text-muted-foreground font-mono flex items-center px-2">
              {currentIndex + 1} / {slides.length}
              {totalSteps > 0 && ` · ${currentStep}/${totalSteps}`}
            </span>
          </ButtonGroup>
        </CardHeader>
        <Separator />
        <CardContent className="flex-1 overflow-auto py-4">
          <pre className="whitespace-pre-wrap text-sm font-sans text-muted-foreground">
            {slide?.notes || "No notes for this slide"}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}
