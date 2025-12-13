import { createFileRoute, Link } from "@tanstack/react-router"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const decks = [
  {
    id: "1",
    title: "Welcome to Atelier",
    description: "Introduction to building slides with React components",
    slides: 5,
  },
]

export const Route = createFileRoute("/")({ component: DecksPage })

function DecksPage() {
  return (
    <div className="min-h-screen bg-card p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-block mb-2">
          <h1 className="text-2xl font-serif tracking-tight text-foreground hover:text-foreground/80 transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
            atelier
          </h1>
        </Link>
        <p className="text-muted-foreground mb-8">Select a deck to present</p>
        <div className="grid gap-4">
          {decks.map((deck) => (
            <Link key={deck.id} to="/decks/1">
              <Card className="transition-colors hover:bg-muted/50 cursor-pointer">
                <CardHeader className="flex-row items-start justify-between space-y-0">
                  <div className="space-y-1">
                    <CardTitle>{deck.title}</CardTitle>
                    <CardDescription>{deck.description}</CardDescription>
                    <div className="flex gap-2 pt-2">
                      <span className="text-sm text-muted-foreground font-mono">
                        {deck.slides} slides
                      </span>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
