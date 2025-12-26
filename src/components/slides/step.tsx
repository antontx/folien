import * as React from 'react'
import { cn } from '@/lib/utils'

interface StepContextValue {
  step: number
  totalSteps: number
  goNext: () => void
  goPrev: () => void
  setTotalSteps: (n: number) => void
}

export const StepContext = React.createContext<StepContextValue>({
  step: 0,
  totalSteps: 0,
  goNext: () => {},
  goPrev: () => {},
  setTotalSteps: () => {},
})

export function useSteps(totalSteps: number) {
  const { step, goNext, goPrev, setTotalSteps } = React.useContext(StepContext)

  // Use layout effect to ensure totalSteps is set before paint
  React.useLayoutEffect(() => {
    setTotalSteps(totalSteps)
  }, [totalSteps, setTotalSteps])

  return { step, goNext, goPrev }
}

/** @deprecated Use useSteps instead */
export function useStep() {
  const ctx = React.useContext(StepContext)
  return { currentStep: ctx.step, totalSteps: ctx.totalSteps }
}

interface StepProps {
  children: React.ReactNode
  visibleAt: number
  className?: string
}

export function Step({ children, visibleAt, className }: StepProps) {
  const { step } = React.useContext(StepContext)
  const isVisible = step >= visibleAt

  return (
    <div
      className={cn(
        'transition-opacity duration-300',
        isVisible ? 'opacity-100' : 'opacity-0',
        className,
      )}
    >
      {children}
    </div>
  )
}
