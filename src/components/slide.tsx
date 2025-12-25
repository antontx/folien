import * as React from "react"

export interface SlideProps {
  children: React.ReactNode
  notes?: string
}

export function Slide({ children }: SlideProps) {
  return <>{children}</>
}

export function isSlideElement(
  element: React.ReactNode
): element is React.ReactElement<SlideProps> {
  return React.isValidElement(element) && element.type === Slide
}
