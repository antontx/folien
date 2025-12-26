import { createFileRoute } from '@tanstack/react-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { PresenterPanel } from '@/components/slides/presenter-panel'
import {
  usePresenterChannel,
  type PresenterMessage,
} from '@/hooks/use-presenter-channel'
import { extractSlides } from '@/components/slides/slides-data'
import { slidesFragment } from '@/slides'

export const Route = createFileRoute('/presenter')({
  component: PresenterView,
})

function PresenterView() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [totalSteps, setTotalSteps] = useState(0)
  const [showBorder, setShowBorder] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  // Extract slides from shared Slides component
  const slides = useMemo(
    () => extractSlides(slidesFragment),
    [],
  )

  const handleMessage = useCallback((msg: PresenterMessage) => {
    if (msg.type === 'state') {
      setCurrentIndex(msg.index)
      setCurrentStep(msg.step)
      setTotalSteps(msg.totalSteps)
      setShowBorder(msg.showBorder)
      setIsFullscreen(msg.isFullscreen)
      setIsConnected(true)
    } else if (msg.type === 'pong') {
      setIsConnected(true)
    }
  }, [slides.length])

  const { send } = usePresenterChannel(handleMessage)

  // Announce connection on mount
  useEffect(() => {
    send({ type: 'connected' })

    const handleBeforeUnload = () => {
      send({ type: 'disconnected' })
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      handleBeforeUnload()
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [send])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return

      if (e.key === 'ArrowRight') {
        e.preventDefault()
        send({ type: 'navigate', action: 'nextStep' })
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        send({ type: 'navigate', action: 'prevStep' })
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        send({ type: 'navigate', action: 'nextSlide' })
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        send({ type: 'navigate', action: 'prevSlide' })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [send])

  const slide = slides[currentIndex]

  const handleNextStep = useCallback(() => {
    send({ type: 'navigate', action: 'nextStep' })
  }, [send])

  const handlePrevStep = useCallback(() => {
    send({ type: 'navigate', action: 'prevStep' })
  }, [send])

  const handleToggleFullscreen = useCallback(() => {
    send({ type: 'control', action: 'fullscreen', value: !isFullscreen })
  }, [send, isFullscreen])

  const handleToggleBorder = useCallback(() => {
    send({ type: 'control', action: 'border', value: !showBorder })
  }, [send, showBorder])

  const handlePopIn = useCallback(() => {
    send({ type: 'disconnected' })
    window.close()
  }, [send])

  if (!isConnected) {
    return (
      <div className="h-screen flex items-center justify-center bg-sidebar text-muted-foreground">
        <div className="text-center">
          <p className="text-lg mb-2">Connecting to presentation...</p>
          <p className="text-sm">
            Make sure the main presentation window is open.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen">
      <PresenterPanel
        currentIndex={currentIndex}
        totalSlides={slides.length}
        currentStep={currentStep}
        totalSteps={totalSteps}
        notes={slide?.notes}
        showBorder={showBorder}
        isFullscreen={isFullscreen}
        onNextStep={handleNextStep}
        onPrevStep={handlePrevStep}
        onToggleFullscreen={handleToggleFullscreen}
        onToggleBorder={handleToggleBorder}
        isPoppedOut={true}
        onPopIn={handlePopIn}
        layout="standalone"
      />
    </div>
  )
}
