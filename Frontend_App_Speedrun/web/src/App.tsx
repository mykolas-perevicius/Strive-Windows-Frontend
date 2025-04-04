// Remove the default Vite logos and CSS import if you want a clean slate
// import viteLogo from '/vite.svg'
// import './App.css' // Remove this if you cleared App.css content

import { Button } from "@/components/ui/button" // Import the Shadcn button

function App() {
  // Replace the default content with this
  return (
    <div className="flex flex-col items-center justify-center min-h-svh bg-background text-foreground p-4">
      <h1 className="text-2xl font-bold mb-4">Frontend App Speedrun</h1>
      <p className="mb-6">Vite + React + TypeScript + Tailwind v4 + Shadcn/ui</p>
      <Button variant="destructive" size="lg">
        Click Me!
      </Button>
    </div>
  )
}

export default App