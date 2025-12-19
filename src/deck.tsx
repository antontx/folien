import { SlideViewer } from "@/components/slide-viewer"
import { Slide } from "@/components/slide"
import { Step } from "@/components/step"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function Deck() {
  return (
    <SlideViewer>
      <Slide notes={`# Welcome slide

- Introduce yourself
- Set the agenda
- Press 'n' to toggle notes`}>
        <div className="h-full flex flex-col items-center justify-center p-16">
          <h1 className="text-7xl font-bold mb-8">Welcome</h1>
          <p className="text-2xl text-muted-foreground">Use arrow keys to navigate</p>
          <Badge className="mt-4">Getting Started</Badge>
        </div>
      </Slide>

      <Slide>
        <div className="h-full flex flex-col items-center justify-center p-16">
          <h1 className="text-5xl font-bold mb-8">Slide Two</h1>
          <p className="text-xl text-muted-foreground max-w-2xl text-center">
            Define your slides directly in code. Each slide can contain any React content.
          </p>
          <div className="flex gap-2 mt-6">
            <Button variant="outline">Learn More</Button>
            <Button>Get Started</Button>
          </div>
        </div>
      </Slide>

      <Slide notes={`## Component showcase

Highlight the key technologies:
- React for UI
- TypeScript for type safety
- Tailwind for styling`}>
        <div className="h-full flex flex-col items-center justify-center p-16">
          <h1 className="text-5xl font-bold mb-8">Components</h1>
          <p className="text-xl text-muted-foreground mb-6">Use shadcn/ui components in slides</p>
          <div className="flex gap-2">
            <Badge>React</Badge>
            <Badge variant="secondary">TypeScript</Badge>
            <Badge variant="outline">Tailwind</Badge>
          </div>
        </div>
      </Slide>

      <Slide>
        <div className="h-full grid grid-cols-2 gap-8 p-16">
          <div className="flex flex-col justify-center">
            <h2 className="text-4xl font-bold mb-4">Flexible Layouts</h2>
            <p className="text-lg text-muted-foreground">Use any React/Tailwind layout</p>
            <Separator className="my-4" />
            <p className="text-sm text-muted-foreground">Combine components freely</p>
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
      </Slide>

      <Slide steps={2} notes={`## Steps Demo

Press → to reveal each step progressively.
Steps are great for:
- Building up complex ideas
- Animations and reveals
- Controlling presentation pace`}>
        <div className="h-full flex flex-col items-center justify-center p-16">
          <h1 className="text-5xl font-bold mb-8">Progressive Reveal</h1>
          <p className="text-xl text-muted-foreground mb-6">Press → to reveal steps</p>
          <div className="flex flex-col gap-4 items-center">
            <Step visibleAt={1}>
              <Badge variant="secondary" className="text-lg px-4 py-2">Step 1: First item appears</Badge>
            </Step>
            <Step visibleAt={2}>
              <Badge className="text-lg px-4 py-2">Step 2: Second item appears</Badge>
            </Step>
          </div>
        </div>
      </Slide>

      <Slide>
        <div className="h-full flex flex-col items-center justify-center p-16">
          <h1 className="text-5xl font-bold mb-8">The End</h1>
          <p className="text-xl text-muted-foreground mb-6">Press ↑ to go back</p>
          <Button variant="outline">↑</Button>
        </div>
      </Slide>
    </SlideViewer>
  )
}
