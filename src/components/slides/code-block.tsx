import * as React from 'react'
import { createHighlighter } from 'shiki'
import { ShikiMagicMove } from 'shiki-magic-move/react'
import type { HighlighterCore } from 'shiki'
import { useSteps } from '@/components/slides/step'
import { useAspectRatio } from '@/hooks/use-aspect-ratio'
import 'shiki-magic-move/dist/style.css'

export interface CodeStep {
  code: string
  topLine?: number // 1-indexed line to show at top
  highlightedRanges?: [number, number][] // [[start, end], ...] - 1-indexed, inclusive
}

interface CodeBlockProps {
  steps: Array<CodeStep>
  lang?: string
}

function useTheme() {
  const [isDark, setIsDark] = React.useState(
    () =>
      typeof document !== 'undefined' &&
      document.documentElement.classList.contains('dark'),
  )

  React.useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }

    // Watch for class changes on html element
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [])

  return isDark
}

export function CodeBlock({ steps, lang = 'typescript' }: CodeBlockProps) {
  const { step } = useSteps(steps.length - 1)
  const [highlighter, setHighlighter] = React.useState<HighlighterCore>()
  const isDark = useTheme()
  const { isVertical } = useAspectRatio()
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    createHighlighter({
      themes: ['github-dark', 'github-light'],
      langs: ['typescript', 'javascript'],
    }).then(setHighlighter)
  }, [])

  const currentStep = Math.min(step, steps.length - 1)
  const currentCode = steps[currentStep]?.code.trim() ?? ''
  const topLine = steps[currentStep]?.topLine
  const highlightedRanges = steps[currentStep]?.highlightedRanges
  const theme = isDark ? 'github-dark' : 'github-light'

  // Scroll to topLine when it changes
  React.useEffect(() => {
    if (!containerRef.current || !topLine) return

    const lineHeight = 17.92 // 0.8rem * 1.4 line-height * 16px base
    const scrollTop = (topLine - 1) * lineHeight

    containerRef.current.scrollTo({
      top: scrollTop,
      behavior: 'smooth',
    })
  }, [currentStep, topLine])

  // Tag tokens with data-line attributes after render
  React.useEffect(() => {
    if (!containerRef.current) return

    const tagLines = () => {
      const container = containerRef.current?.querySelector(
        '.shiki-magic-move-container',
      )
      if (!container) return

      let lineNum = 1
      for (const node of container.childNodes) {
        if (node.nodeName === 'BR') {
          lineNum++
        } else if (node instanceof HTMLElement) {
          node.dataset.line = String(lineNum)
        }
      }
    }

    // Tag immediately and after animation completes
    tagLines()
    const timeout = setTimeout(tagLines, 50)

    // Also observe for changes during animation
    const container = containerRef.current.querySelector(
      '.shiki-magic-move-container',
    )
    if (container) {
      const observer = new MutationObserver(tagLines)
      observer.observe(container, { childList: true, subtree: true })
      return () => {
        clearTimeout(timeout)
        observer.disconnect()
      }
    }

    return () => clearTimeout(timeout)
  }, [currentStep, currentCode])

  // Generate CSS for highlighted lines
  const hasHighlights = highlightedRanges && highlightedRanges.length > 0
  const highlightedSelectors = hasHighlights
    ? highlightedRanges
        .flatMap(([start, end]) =>
          Array.from(
            { length: end - start + 1 },
            (_, i) => `.shiki-magic-move-container [data-line="${start + i}"]`,
          ),
        )
        .join(',\n')
    : ''

  if (!highlighter) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  const highlightStyles = hasHighlights
    ? `
      .shiki-magic-move-container [data-line] {
        opacity: 0.3;
        transition: opacity 0.3s, text-shadow 0.3s;
      }
      ${highlightedSelectors} {
        opacity: 1;
        ${isDark ? 'text-shadow: 0 0 8px rgba(255, 255, 255, 0.3);' : ''}
      }
    `
    : ''

  return (
    <div className="flex-1 h-full w-full flex items-start justify-start overflow-hidden p-4 pt-8">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .shiki-magic-move-container {
              font-size: ${isVertical ? '0.65rem' : '0.8rem'};
              line-height: 1.4;
              font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
              background: transparent !important;
              padding: 0.75rem;
              ${isVertical ? 'white-space: pre-wrap; word-break: break-word;' : ''}
            }
            .shiki-magic-move-container pre {
              padding: 1.25rem 1.5rem;
              margin: 0;
              background: transparent !important;
            }
            .code-scroll-container {
              scrollbar-gutter: stable;
              scrollbar-width: none;
              -ms-overflow-style: none;
            }
            .code-scroll-container::-webkit-scrollbar {
              display: none;
            }
            ${highlightStyles}
          `,
        }}
      />
      <div
        ref={containerRef}
        className="code-scroll-container overflow-y-auto overflow-x-hidden max-h-full"
      >
        <ShikiMagicMove
          key={theme}
          highlighter={highlighter}
          code={currentCode}
          lang={lang}
          theme={theme}
          className="shiki-magic-move-container"
          options={{
            duration: 600,
            stagger: 2,
            lineNumbers: false,
          }}
        />
      </div>
    </div>
  )
}
