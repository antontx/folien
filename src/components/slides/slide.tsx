import * as React from 'react'

// SlideNotes - for speaker notes (JSX)
export interface SlideNotesProps {
  children: React.ReactNode
}

export function SlideNotes({ children }: SlideNotesProps) {
  return <>{children}</>
}

// SlideContent - for slide content (JSX)
export interface SlideContentProps {
  children: React.ReactNode
}

export function SlideContent({ children }: SlideContentProps) {
  return <>{children}</>
}

// Slide - container that holds SlideNotes and SlideContent
export interface SlideProps {
  children: React.ReactNode
}

export function Slide({ children }: SlideProps) {
  let content: React.ReactNode = null

  React.Children.forEach(children, (child) => {
    if (
      React.isValidElement<SlideContentProps>(child) &&
      child.type === SlideContent
    ) {
      content = child.props.children
    }
  })

  return <>{content}</>
}

// Helper to extract notes from Slide's children
export function getSlideNotes(children: React.ReactNode): React.ReactNode {
  let notes: React.ReactNode = null

  React.Children.forEach(children, (child) => {
    if (
      React.isValidElement<SlideNotesProps>(child) &&
      child.type === SlideNotes
    ) {
      notes = child.props.children
    }
  })

  return notes
}

// Helper to extract content from Slide's children
export function getSlideContent(children: React.ReactNode): React.ReactNode {
  let content: React.ReactNode = null

  React.Children.forEach(children, (child) => {
    if (
      React.isValidElement<SlideContentProps>(child) &&
      child.type === SlideContent
    ) {
      content = child.props.children
    }
  })

  return content
}

export function isSlideElement(
  element: React.ReactNode,
): element is React.ReactElement<SlideProps> {
  return React.isValidElement(element) && element.type === Slide
}
