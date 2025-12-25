import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Slide, type SlideProps } from '@/components/slide'
import { StepContext } from '@/components/step'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar'

interface InternalSlide {
  content: React.ReactNode
  notes?: string
}

interface SlideViewerProps {
  children: React.ReactNode
}

export function SlideViewer({ children }: SlideViewerProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <SlideViewerInner>{children}</SlideViewerInner>
    </SidebarProvider>
  )
}

function SlideViewerInner({ children }: SlideViewerProps) {
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  const slides = useMemo(() => {
    const result: InternalSlide[] = []
    Children.forEach(children, (child) => {
      if (isValidElement<SlideProps>(child)) {
        // Direct Slide component
        if (child.type === Slide) {
          result.push({
            content: child.props.children,
            notes: child.props.notes,
          })
        } else if (typeof child.type === 'function') {
          // Component that returns a Slide
          const rendered = (
            child.type as (props: SlideProps) => React.ReactElement
          )(child.props)
          if (isValidElement<SlideProps>(rendered) && rendered.type === Slide) {
            result.push({
              content: rendered.props.children,
              notes: rendered.props.notes,
            })
          }
        }
      }
    })
    return result
  }, [children])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [totalSteps, setTotalSteps] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showBorder, setShowBorder] = useState(true)

  const slide = slides[currentIndex]

  // Reset steps when slide changes
  useEffect(() => {
    setCurrentStep(0)
    setTotalSteps(0)
  }, [currentIndex])

  // Step-aware navigation (→/←): advance through steps then slides
  const goNextStep = useCallback(() => {
    if (currentStep < totalSteps) {
      setCurrentStep((s) => s + 1)
    } else if (currentIndex < slides.length - 1) {
      setCurrentIndex((i) => i + 1)
      setCurrentStep(0)
    }
  }, [currentStep, totalSteps, currentIndex, slides.length])

  const goPrevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1)
    } else if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1)
      // Step 0 - slide will set its totalSteps on mount
    }
  }, [currentStep, currentIndex])

  // Direct slide navigation (↓/↑): jump to next/prev slide directly
  const goNextSlide = useCallback(() => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex((i) => i + 1)
      setCurrentStep(0)
    }
  }, [currentIndex, slides.length])

  const goPrevSlide = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1)
      setCurrentStep(0)
    }
  }, [currentIndex])

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
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return

      if (e.key === 'ArrowRight') {
        e.preventDefault()
        goNextStep()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrevStep()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        goNextSlide()
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        goPrevSlide()
      } else if (e.key === 'Escape' && isFullscreen) {
        document.exitFullscreen()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goNextStep, goPrevStep, goNextSlide, goPrevSlide, isFullscreen])

  const isAtStart = currentIndex === 0 && currentStep === 0
  const isAtEnd =
    currentIndex === slides.length - 1 && currentStep === totalSteps

  return (
    <>
      <main className="flex-1 flex flex-col p-4 overflow-hidden">
        <div ref={slideRef} className="flex-1 flex items-center justify-center">
          <Card
            className={`${
              isFullscreen
                ? 'w-screen h-screen max-w-none rounded-none'
                : 'w-[1400px] max-w-full aspect-video rounded-xl'
            } ${showBorder ? '' : 'ring-0'}`}
          >
            <StepContext.Provider
              value={{
                step: currentStep,
                totalSteps,
                goNext: goNextStep,
                goPrev: goPrevStep,
                setTotalSteps,
              }}
            >
              {slide?.content}
            </StepContext.Provider>
          </Card>
        </div>
      </main>

      <Sidebar side="right" collapsible="icon" className="border-l">
        <SidebarHeader
          className={`${isCollapsed ? 'flex-col' : 'flex-row'} items-center gap-2`}
        >
          <SidebarTrigger />
          <ButtonGroup orientation={isCollapsed ? 'vertical' : 'horizontal'}>
            <Button
              variant="outline"
              size={isCollapsed ? 'icon-sm' : 'sm'}
              onClick={toggleFullscreen}
            >
              ⛶
            </Button>
            <Button
              variant={showBorder ? 'outline' : 'secondary'}
              size={isCollapsed ? 'icon-sm' : 'sm'}
              onClick={() => setShowBorder((v) => !v)}
            >
              ▢
            </Button>
          </ButtonGroup>
        </SidebarHeader>

        <SidebarSeparator />

        <SidebarContent className="p-4">
          {!isCollapsed && (
            <pre className="whitespace-pre-wrap text-sm font-sans text-muted-foreground">
              {slide?.notes || 'No notes for this slide'}
            </pre>
          )}
        </SidebarContent>

        <SidebarSeparator />

        <SidebarFooter>
          <div
            className={`flex items-center gap-2 ${isCollapsed ? 'flex-col' : 'flex-row'}`}
          >
            <ButtonGroup orientation={isCollapsed ? 'vertical' : 'horizontal'}>
              <Button
                variant="outline"
                size={isCollapsed ? 'icon-sm' : 'sm'}
                onClick={goPrevStep}
                disabled={isAtStart}
              >
                {isCollapsed ? '↑' : '←'}
              </Button>
              <Button
                variant="outline"
                size={isCollapsed ? 'icon-sm' : 'sm'}
                onClick={goNextStep}
                disabled={isAtEnd}
              >
                {isCollapsed ? '↓' : '→'}
              </Button>
            </ButtonGroup>
            <span
              className={`text-xs text-muted-foreground font-mono ${isCollapsed ? '[writing-mode:vertical-rl]' : ''}`}
            >
              {currentIndex + 1}/{slides.length}
              {!isCollapsed &&
                totalSteps > 0 &&
                ` · ${currentStep}/${totalSteps}`}
            </span>
          </div>
        </SidebarFooter>
      </Sidebar>
    </>
  )
}
