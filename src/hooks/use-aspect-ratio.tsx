import * as React from 'react'

export const ASPECT_RATIOS = ['16:9', '9:16'] as const

export type AspectRatio = (typeof ASPECT_RATIOS)[number]

interface AspectRatioContextValue {
  aspectRatio: AspectRatio
  setAspectRatio: (ratio: AspectRatio) => void
  isVertical: boolean
}

export const AspectRatioContext = React.createContext<AspectRatioContextValue>({
  aspectRatio: '16:9',
  setAspectRatio: () => {},
  isVertical: false,
})

export function useAspectRatio() {
  return React.useContext(AspectRatioContext)
}
