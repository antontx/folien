# atelier

code-driven slides for recordings & presentations

## what is it

slides as React/TypeScript - define presentations in code, render with shadcn/ui components. designed for AI-assisted coding with tools like Cursor and Claude Code.

## example

```tsx
const slides: Slide[] = [
  {
    id: "intro",
    content: (
      <div className="flex flex-col items-center gap-4">
        <Badge>Welcome</Badge>
        <h1 className="text-4xl font-bold">My Presentation</h1>
      </div>
    ),
    notes: "speaker notes go here"
  },
  // more slides...
]
```

## run

```bash
bun install
bun dev     # localhost:3000
```

## create a deck

1. add file: `src/routes/decks/{n}.tsx`
2. define slides array
3. export route with `createFileRoute`
4. add to deck list in `src/routes/index.tsx`

## features

- arrow keys / escape for navigation
- fullscreen mode
- speaker notes sidebar
- any React component in slides
- shadcn/ui components included

## stack

React 19 + TanStack Start + Tailwind + shadcn/ui
