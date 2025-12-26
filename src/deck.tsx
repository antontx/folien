import type {CodeStep} from '@/components/slides/code-block';
import { SlideViewer } from '@/components/slides/slide-viewer'
import { Slide, SlideContent, SlideNotes } from '@/components/slides/slide'
import { CodeBlock  } from '@/components/slides/code-block'

// Code steps designed for smooth token animation:
// - Keep structure similar across steps where possible
// - type State is always at top
// - Function/usage comes after
const codeSteps: Array<CodeStep> = [
  // Step 0: The problem - bag of optionals
  {
    code: `type State = {
  status: 'loading' | 'success' | 'error'
  error?: string
  data?: Record<string, unknown>
}`,
  },
  // Step 1: Impossible states are possible
  {
    code: `type State = {
  status: 'loading' | 'success' | 'error'
  error?: string
  data?: Record<string, unknown>
}

// TypeScript allows this - but it's nonsense!
const badState: State = {
  status: 'loading',
  error: 'Oops!',   // ❌ shouldn't exist
  data: { id: 1 },  // ❌ shouldn't exist
}`,
  },
  // Step 2: Back to just the type
  {
    code: `type State = {
  status: 'loading' | 'success' | 'error'
  error?: string
  data?: Record<string, unknown>
}`,
  },
  // Step 3: The discriminated union solution
  {
    code: `type State =
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'success'; data: Record<string, unknown> }`,
  },
  // Step 4: Type safety examples - invalid vs valid
  {
    code: `type State =
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'success'; data: Record<string, unknown> }

// ❌ Type error: 'error' does not exist on loading
const invalid: State = {
  status: 'loading',
  error: 'Oops!',
}

// ✅ Compiles - each state has only its properties
const loading: State = { status: 'loading' }
const error: State = { status: 'error', error: 'Failed' }
const success: State = { status: 'success', data: { id: 1 } }`,
  },
  // Step 5: Highlight invalid section
  {
    code: `type State =
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'success'; data: Record<string, unknown> }

// ❌ Type error: 'error' does not exist on loading
const invalid: State = {
  status: 'loading',
  error: 'Oops!',
}

// ✅ Compiles - each state has only its properties
const loading: State = { status: 'loading' }
const error: State = { status: 'error', error: 'Failed' }
const success: State = { status: 'success', data: { id: 1 } }`,
    highlightedRanges: [[6, 10]],
  },
  // Step 6: Highlight valid section
  {
    code: `type State =
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'success'; data: Record<string, unknown> }

// ❌ Type error: 'error' does not exist on loading
const invalid: State = {
  status: 'loading',
  error: 'Oops!',
}

// ✅ Compiles - each state has only its properties
const loading: State = { status: 'loading' }
const error: State = { status: 'error', error: 'Failed' }
const success: State = { status: 'success', data: { id: 1 } }`,
    highlightedRanges: [[12, 15]],
  },
]

function DiscriminatedUnionsSlide() {
  return (
    <Slide>
      <SlideNotes>
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-lg">Step 0 - The Problem</h3>
            <p>
              Here's a common pattern for modeling async state - a type with
              status and optional error/data properties. This is a "bag of
              optionals" - properties that may or may not exist.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg">Step 1 - Impossible States</h3>
            <p>
              The problem is our type is too loose. Nothing prevents creating
              impossible states - like having both error and data during
              loading. This "bag of optionals" doesn't encode the relationship
              between status and its data.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg">Step 2 - Focus on the Type</h3>
            <p>
              Let's focus on just the type definition. How can we fix this "bag
              of optionals" problem?
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg">Step 3 - The Solution</h3>
            <p>
              The fix: a discriminated union. We split into separate types, each
              with only relevant properties. The status literal is the
              discriminant - it uniquely identifies each variant.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg">Step 4 - Type Safety</h3>
            <p>
              Now TypeScript catches invalid states at compile time. The invalid
              object with 'loading' status and an 'error' property fails to
              compile. Only valid combinations are allowed.
            </p>
          </div>
        </div>
      </SlideNotes>
      <SlideContent>
        <CodeBlock steps={codeSteps} />
      </SlideContent>
    </Slide>
  )
}

export const slides = (
  <>
    <DiscriminatedUnionsSlide />
  </>
)

export default function Deck() {
  return <SlideViewer>{slides}</SlideViewer>
}
