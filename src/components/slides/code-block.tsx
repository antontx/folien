import * as React from 'react'
import { createHighlighter } from 'shiki'
import { ShikiMagicMove } from 'shiki-magic-move/react'
import type { HighlighterCore } from 'shiki'
import { useSteps } from '@/components/slides/step'
import 'shiki-magic-move/dist/style.css'

export interface CodeStep {
  code: string
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

  React.useEffect(() => {
    createHighlighter({
      themes: ['github-dark', 'github-light'],
      langs: ['typescript', 'javascript'],
    }).then(setHighlighter)
  }, [])

  const currentStep = Math.min(step, steps.length - 1)
  const currentCode = steps[currentStep]?.code.trim() ?? ''
  const theme = isDark ? 'github-dark' : 'github-light'

  if (!highlighter) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex-1 h-full w-full flex items-start justify-center overflow-hidden p-4 pt-8">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .shiki-magic-move-container {
              font-size: 0.8rem;
              line-height: 1.4;
              font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
              max-width: 100%;
              max-height: 100%;
              background: transparent !important;
            }
            .shiki-magic-move-container pre {
              padding: 1.25rem 1.5rem;
              margin: 0;
              background: transparent !important;
            }
          `,
        }}
      />
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
  )
}
