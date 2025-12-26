import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { ThemeSwitcher } from '@/components/ui/theme-switcher'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ASPECT_RATIOS, type AspectRatio } from '@/hooks/use-aspect-ratio'

export interface PresenterPanelProps {
  // State
  currentIndex: number
  totalSlides: number
  currentStep: number
  totalSteps: number
  notes: React.ReactNode
  showBorder: boolean
  isFullscreen: boolean
  aspectRatio: AspectRatio

  // Callbacks
  onNextStep: () => void
  onPrevStep: () => void
  onToggleFullscreen: () => void
  onToggleBorder: () => void
  onAspectRatioChange: (ratio: AspectRatio) => void

  // Pop-out specific
  isPoppedOut?: boolean
  onPopOut?: () => void
  onPopIn?: () => void

  // Layout
  layout?: 'sidebar' | 'standalone'
}

export function PresenterPanel({
  currentIndex,
  totalSlides,
  currentStep,
  totalSteps,
  notes,
  showBorder,
  aspectRatio,
  onNextStep,
  onPrevStep,
  onToggleFullscreen,
  onToggleBorder,
  onAspectRatioChange,
  isPoppedOut = false,
  onPopOut,
  onPopIn,
  layout = 'sidebar',
}: PresenterPanelProps) {
  const isStandalone = layout === 'standalone'
  const isAtStart = currentIndex === 0 && currentStep === 0
  const isAtEnd = currentIndex === totalSlides - 1 && currentStep === totalSteps

  return (
    <div className={`flex flex-col h-full ${isStandalone ? 'bg-sidebar' : ''}`}>
      {/* Header */}
      <div className="flex flex-row items-center gap-2 p-2">
        <ButtonGroup orientation="horizontal">
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleFullscreen}
            title="Toggle fullscreen"
          >
            ⛶
          </Button>
          <Button
            variant={showBorder ? 'outline' : 'secondary'}
            size="sm"
            onClick={onToggleBorder}
            title="Toggle border"
          >
            ▢
          </Button>
        </ButtonGroup>
        <Select
          value={aspectRatio}
          onValueChange={(v) => v && onAspectRatioChange(v)}
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
        <ThemeSwitcher />
        <div className="flex-1" />
        {!isPoppedOut && onPopOut && (
          <Button
            variant="outline"
            size="sm"
            onClick={onPopOut}
            title="Pop out to separate window"
          >
            ⧉
          </Button>
        )}
        {isPoppedOut && onPopIn && (
          <Button
            variant="outline"
            size="sm"
            onClick={onPopIn}
            title="Pop back into main window"
          >
            ⇲
          </Button>
        )}
      </div>

      <Separator />

      {/* Notes Content */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="slide-notes text-sm text-muted-foreground">
          {notes || <p>No notes for this slide</p>}
        </div>
      </div>

      <Separator />

      {/* Footer */}
      <div className="p-2">
        <div className="flex items-center gap-2">
          <ButtonGroup orientation="horizontal">
            <Button
              variant="outline"
              size="sm"
              onClick={onPrevStep}
              disabled={isAtStart}
            >
              ←
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onNextStep}
              disabled={isAtEnd}
            >
              →
            </Button>
          </ButtonGroup>
          <span className="text-xs text-muted-foreground font-mono">
            {currentIndex + 1}/{totalSlides}
            {totalSteps > 0 && ` · ${currentStep}/${totalSteps}`}
          </span>
        </div>
      </div>
    </div>
  )
}
