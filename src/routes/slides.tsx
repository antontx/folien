import { createFileRoute } from "@tanstack/react-router"
import type {Slide} from "@/components/slide-viewer";
import {  SlideViewer } from "@/components/slide-viewer"

const slides: Array<Slide> = [
  {
    id: "1",
    content: (
      <div className="h-full flex flex-col items-center justify-center p-16">
        <h1 className="text-7xl font-bold mb-8">Welcome</h1>
        <p className="text-2xl text-gray-600">Use arrow keys to navigate</p>
      </div>
    ),
  },
  {
    id: "2",
    content: (
      <div className="h-full flex flex-col items-center justify-center p-16">
        <h1 className="text-5xl font-bold mb-8">Slide Two</h1>
        <p className="text-xl text-gray-600 max-w-2xl text-center">
          Define your slides directly in code. Each slide can contain any React content.
        </p>
      </div>
    ),
  },
  {
    id: "3",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    content: (
      <div className="h-full flex flex-col items-center justify-center p-16 text-white">
        <h1 className="text-5xl font-bold mb-8">Custom Backgrounds</h1>
        <p className="text-xl opacity-90">Slides support custom background colors and gradients</p>
      </div>
    ),
  },
  {
    id: "4",
    content: (
      <div className="h-full grid grid-cols-2 gap-8 p-16">
        <div className="flex flex-col justify-center">
          <h2 className="text-4xl font-bold mb-4">Flexible Layouts</h2>
          <p className="text-lg text-gray-600">Use any React/Tailwind layout</p>
        </div>
        <div className="bg-gray-100 rounded-2xl flex items-center justify-center">
          <span className="text-6xl">🎨</span>
        </div>
      </div>
    ),
  },
  {
    id: "5",
    background: "#1a1a2e",
    content: (
      <div className="h-full flex flex-col items-center justify-center p-16 text-white">
        <h1 className="text-5xl font-bold mb-8">The End</h1>
        <p className="text-xl opacity-70">Press ↑ to go back</p>
      </div>
    ),
  },
]

function SlidesPage() {
  return <SlideViewer slides={slides} />
}

export const Route = createFileRoute("/slides")({
  component: SlidesPage,
})
