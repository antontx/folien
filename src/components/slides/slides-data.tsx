import {
  Children,
  isValidElement,
  useMemo,
  type ReactNode,
  type ReactElement,
} from 'react'
import {
  Slide,
  getSlideContent,
  getSlideNotes,
} from '@/components/slides/slide'

export interface InternalSlide {
  content: React.ReactNode
  notes?: React.ReactNode
}

function extractSlideData(slideChildren: React.ReactNode): InternalSlide {
  return {
    content: getSlideContent(slideChildren),
    notes: getSlideNotes(slideChildren),
  }
}

interface PropsWithChildren {
  children?: ReactNode
}

export function extractSlides(children: React.ReactNode): InternalSlide[] {
  const result: InternalSlide[] = []

  function processNode(node: ReactNode): void {
    Children.forEach(node, (child) => {
      if (!isValidElement(child)) return

      const childElement = child as ReactElement<PropsWithChildren>

      // Direct Slide component
      if (child.type === Slide) {
        result.push(extractSlideData(childElement.props.children))
        return
      }

      // Function component - render it to get its children
      if (typeof child.type === 'function') {
        try {
          const rendered = (
            child.type as (
              props: PropsWithChildren,
            ) => ReactElement<PropsWithChildren>
          )(childElement.props)
          if (isValidElement(rendered)) {
            const renderedElement = rendered as ReactElement<PropsWithChildren>
            if (rendered.type === Slide) {
              result.push(extractSlideData(renderedElement.props.children))
            } else {
              // Could be a fragment or wrapper - recurse into its children
              processNode(renderedElement.props.children)
            }
          }
        } catch {
          // Component might need context, skip it
        }
        return
      }

      // Fragment or other element with children - recurse
      if (childElement.props.children) {
        processNode(childElement.props.children)
      }
    })
  }

  processNode(children)
  return result
}

export function useSlides(children: React.ReactNode): InternalSlide[] {
  return useMemo(() => extractSlides(children), [children])
}
