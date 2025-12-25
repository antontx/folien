import { SlideViewer } from '@/components/slides/slide-viewer'
import { Slide, SlideContent, SlideNotes } from '@/components/slides/slide'
import { Step, useSteps } from '@/components/slides/step'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

function SlideTest() {
  return (
    <Slide>
      <SlideNotes>
        <p>This is a test slide</p>
      </SlideNotes>
      <SlideContent>
        <div className="h-full flex flex-col items-center justify-center p-16">
          <h1 className="text-5xl font-bold mb-8">Slide Test</h1>
        </div>
      </SlideContent>
    </Slide>
  )
}

function StepsDemo() {
  const { step } = useSteps(2)
  return (
    <div className="h-full flex flex-col items-center justify-center p-16">
      <h1 className="text-5xl font-bold mb-8">Progressive Reveal</h1>
      <p className="text-xl text-muted-foreground mb-6">
        Press → to reveal steps (step: {step})
      </p>
      <div className="flex flex-col gap-4 items-center">
        <Step visibleAt={1}>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            Step 1: First item appears
          </Badge>
        </Step>
        <Step visibleAt={2}>
          <Badge className="text-lg px-4 py-2">
            Step 2: Second item appears
          </Badge>
        </Step>
      </div>
    </div>
  )
}

export default function Deck() {
  return (
    <SlideViewer>
      <SlideTest />

      <Slide>
        <SlideNotes>
          <h1>Welcome slide</h1>
          <ul>
            <li>Introduce yourself</li>
            <li>Set the agenda</li>
            <li>Press 'n' to toggle notes</li>
          </ul>
        </SlideNotes>
        <SlideContent>
          <div className="h-full flex flex-col items-center justify-center p-16">
            <h1 className="text-7xl font-bold mb-8">Welcome</h1>
            <p className="text-2xl text-muted-foreground">
              Use arrow keys to navigate
            </p>
            <Badge className="mt-4">Getting Started</Badge>
          </div>
        </SlideContent>
      </Slide>

      <Slide>
        <SlideContent>
          <div className="h-full flex flex-col items-center justify-center p-16">
            <h1 className="text-5xl font-bold mb-8">Slide Two</h1>
            <p className="text-xl text-muted-foreground max-w-2xl text-center">
              Define your slides directly in code. Each slide can contain any
              React content.
            </p>
            <div className="flex gap-2 mt-6">
              <Button variant="outline">Learn More</Button>
              <Button>Get Started</Button>
            </div>
          </div>
        </SlideContent>
      </Slide>

      <Slide>
        <SlideNotes>
          <h2>Component showcase</h2>
          <p>Highlight the key technologies:</p>
          <ul>
            <li>React for UI</li>
            <li>TypeScript for type safety</li>
            <li>Tailwind for styling</li>
          </ul>
        </SlideNotes>
        <SlideContent>
          <div className="h-full flex flex-col items-center justify-center p-16">
            <h1 className="text-5xl font-bold mb-8">Components</h1>
            <p className="text-xl text-muted-foreground mb-6">
              Use shadcn/ui components in slides
            </p>
            <div className="flex gap-2">
              <Badge>React</Badge>
              <Badge variant="secondary">TypeScript</Badge>
              <Badge variant="outline">Tailwind</Badge>
            </div>
          </div>
        </SlideContent>
      </Slide>

      <Slide>
        <SlideContent>
          <div className="h-full grid grid-cols-2 gap-8 p-16">
            <div className="flex flex-col justify-center">
              <h2 className="text-4xl font-bold mb-4">Flexible Layouts</h2>
              <p className="text-lg text-muted-foreground">
                Use any React/Tailwind layout
              </p>
              <Separator className="my-4" />
              <p className="text-sm text-muted-foreground">
                Combine components freely
              </p>
            </div>
            <Card className="flex flex-col justify-center">
              <CardHeader>
                <CardTitle>Nested Cards</CardTitle>
                <CardDescription>Cards work inside slides</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-4xl">🎨</span>
              </CardContent>
            </Card>
          </div>
        </SlideContent>
      </Slide>

      <Slide>
        <SlideNotes>
          <h2>Steps Demo</h2>
          <p>Press → to reveal each step progressively.</p>
          <p>Steps are great for:</p>
          <ul>
            <li>Building up complex ideas</li>
            <li>Animations and reveals</li>
            <li>Controlling presentation pace</li>
          </ul>
        </SlideNotes>
        <SlideContent>
          <StepsDemo />
        </SlideContent>
      </Slide>

      <Slide>
        <SlideContent>
          <div className="h-full flex flex-col items-center justify-center p-16">
            <h1 className="text-5xl font-bold mb-8">The End</h1>
            <p className="text-xl text-muted-foreground mb-6">
              Press ↑ to go back
            </p>
            <Button variant="outline">↑</Button>
          </div>
        </SlideContent>
      </Slide>
    </SlideViewer>
  )
}
