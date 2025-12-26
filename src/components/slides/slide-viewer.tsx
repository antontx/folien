import { useCallback, useEffect, useRef, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { StepContext } from '@/components/slides/step'
import { useSlides } from '@/components/slides/slides-data'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ThemeSwitcher } from '@/components/ui/theme-switcher'
import {
  usePresenterChannel,
  type PresenterMessage,
} from '@/hooks/use-presenter-channel'
import {
  AspectRatioContext,
  ASPECT_RATIOS,
  type AspectRatio,
} from '@/hooks/use-aspect-ratio'

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

  const slides = useSlides(children)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [totalSteps, setTotalSteps] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showBorder, setShowBorder] = useState(true)
  const [isPoppedOut, setIsPoppedOut] = useState(false)
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9')

  const slide = slides[currentIndex]
  const popupRef = useRef<Window | null>(null)

  // Handle messages from presenter window
  const handleMessage = useCallback(
    (msg: PresenterMessage) => {
      if (msg.type === 'navigate') {
        switch (msg.action) {
          case 'nextStep':
            if (currentStep < totalSteps) {
              setCurrentStep((s) => s + 1)
            } else if (currentIndex < slides.length - 1) {
              setCurrentIndex((i) => i + 1)
              setCurrentStep(0)
            }
            break
          case 'prevStep':
            if (currentStep > 0) {
              setCurrentStep((s) => s - 1)
            } else if (currentIndex > 0) {
              setCurrentIndex((i) => i - 1)
            }
            break
          case 'nextSlide':
            if (currentIndex < slides.length - 1) {
              setCurrentIndex((i) => i + 1)
              setCurrentStep(0)
            }
            break
          case 'prevSlide':
            if (currentIndex > 0) {
              setCurrentIndex((i) => i - 1)
              setCurrentStep(0)
            }
            break
          case 'goTo':
            if (
              msg.index !== undefined &&
              msg.index >= 0 &&
              msg.index < slides.length
            ) {
              setCurrentIndex(msg.index)
              setCurrentStep(0)
            }
            break
        }
      } else if (msg.type === 'control') {
        if (msg.action === 'fullscreen') {
          if (msg.value && !document.fullscreenElement) {
            slideRef.current?.requestFullscreen()
          } else if (!msg.value && document.fullscreenElement) {
            document.exitFullscreen()
          }
        } else if (msg.action === 'border') {
          setShowBorder(msg.value)
        } else if (msg.action === 'aspectRatio') {
          setAspectRatio(msg.value)
        }
      } else if (msg.type === 'connected') {
        setIsPoppedOut(true)
      } else if (msg.type === 'disconnected') {
        setIsPoppedOut(false)
        popupRef.current = null
      }
    },
    [currentStep, totalSteps, currentIndex, slides.length],
  )

  const { send } = usePresenterChannel(handleMessage)

  // Broadcast state changes to presenter window
  useEffect(() => {
    if (isPoppedOut) {
      send({
        type: 'state',
        index: currentIndex,
        step: currentStep,
        totalSteps,
        showBorder,
        isFullscreen,
        aspectRatio,
      })
    }
  }, [
    isPoppedOut,
    currentIndex,
    currentStep,
    totalSteps,
    showBorder,
    isFullscreen,
    aspectRatio,
    send,
  ])

  // Reset current step when slide changes (totalSteps will be set by useSteps)
  useEffect(() => {
    setCurrentStep(0)
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

  const toggleBorder = useCallback(() => {
    setShowBorder((v) => !v)
  }, [])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const popOut = useCallback(() => {
    const popup = window.open(
      '/presenter',
      'atelier-presenter',
      'width=400,height=600,resizable=yes',
    )
    if (popup) {
      popupRef.current = popup
      setIsPoppedOut(true)
    }
  }, [])

  const popIn = useCallback(() => {
    if (popupRef.current) {
      popupRef.current.close()
      popupRef.current = null
    }
    setIsPoppedOut(false)
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
      } else if (e.key === 'Escape') {
        if (isPoppedOut) {
          popIn()
        } else if (isFullscreen) {
          document.exitFullscreen()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    goNextStep,
    goPrevStep,
    goNextSlide,
    goPrevSlide,
    isFullscreen,
    isPoppedOut,
    popIn,
  ])

  const isAtStart = currentIndex === 0 && currentStep === 0
  const isAtEnd =
    currentIndex === slides.length - 1 && currentStep === totalSteps

  return (
    <>
      <main className="flex-1 flex flex-col p-4 overflow-hidden">
        <div ref={slideRef} className="flex-1 flex items-center justify-center">
          <Card
            className={`bg-background ${
              isFullscreen
                ? 'w-screen h-screen max-w-none rounded-none'
                : aspectRatio === '16:9'
                  ? 'w-[1400px] max-w-full aspect-video rounded-xl'
                  : 'h-[80vh] max-h-full aspect-[9/16] rounded-xl'
            } ${showBorder ? '' : 'ring-0'}`}
          >
            <AspectRatioContext.Provider
              value={{
                aspectRatio,
                setAspectRatio,
                isVertical: aspectRatio === '9:16',
              }}
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
                <div className="flex-1 h-full w-full overflow-hidden">
                  {slide.content}
                </div>
              </StepContext.Provider>
            </AspectRatioContext.Provider>
          </Card>
        </div>
      </main>

      {/* Only show sidebar when not popped out */}
      {!isPoppedOut && (
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
                onClick={toggleBorder}
              >
                ▢
              </Button>
            </ButtonGroup>
            {!isCollapsed && (
              <Select
                value={aspectRatio}
                onValueChange={(v) => v && setAspectRatio(v)}
              >
                <SelectTrigger size="sm" className="font-mono text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ASPECT_RATIOS.map((ratio) => (
                    <SelectItem key={ratio} value={ratio}>
                      {ratio}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <ThemeSwitcher />
            {!isCollapsed && (
              <Button
                variant="outline"
                size="sm"
                onClick={popOut}
                title="Pop out to separate window"
              >
                ⧉
              </Button>
            )}
          </SidebarHeader>

          <SidebarSeparator />

          <SidebarContent className="p-4 overflow-auto">
            {!isCollapsed && (
              <div className="slide-notes text-sm text-muted-foreground">
                {slide.notes || <p>No notes for this slide</p>}
              </div>
            )}
          </SidebarContent>

          <SidebarSeparator />

          <SidebarFooter>
            <div
              className={`flex items-center gap-2 ${isCollapsed ? 'flex-col' : 'flex-row'}`}
            >
              <ButtonGroup
                orientation={isCollapsed ? 'vertical' : 'horizontal'}
              >
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
      )}
    </>
  )
}
