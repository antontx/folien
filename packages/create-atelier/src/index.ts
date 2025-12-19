#!/usr/bin/env node
import { existsSync } from "node:fs"
import path from "node:path"
import pc from "picocolors"

const REPO = "antontx/atelier"

async function main() {
  const args = process.argv.slice(2)
  const projectName = args[0]

  if (!projectName) {
    console.log(`
${pc.bold("create-atelier")} - Create a new Atelier slide deck

${pc.dim("Usage:")}
  npx create-atelier ${pc.cyan("<project-name>")}

${pc.dim("Example:")}
  npx create-atelier my-presentation
`)
    process.exit(1)
  }

  const targetDir = path.resolve(process.cwd(), projectName)

  if (existsSync(targetDir)) {
    console.error(pc.red(`Error: Directory "${projectName}" already exists`))
    process.exit(1)
  }

  console.log()
  console.log(`Creating ${pc.cyan(projectName)}...`)
  console.log()

  try {
    // Use degit to clone the template
    const degit = (await import("degit")).default
    const emitter = degit(REPO, { cache: false, force: true })

    await emitter.clone(targetDir)

    console.log(pc.green("Done!"))
    console.log()
    console.log("Next steps:")
    console.log()
    console.log(`  cd ${pc.cyan(projectName)}`)
    console.log(`  npm install`)
    console.log(`  npm run dev`)
    console.log()
  } catch (err) {
    console.error(pc.red("Failed to create project:"), err)
    process.exit(1)
  }
}

main()
