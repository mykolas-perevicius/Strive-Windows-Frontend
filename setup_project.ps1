# Define Base Directory and Project Name
$baseDir = "C:\Users\miciu\Strive-Windows-Frontend"
$projectName = "Frontend_App_Speedrun"
$projectPath = Join-Path -Path $baseDir -ChildPath $projectName
$webPath = Join-Path -Path $projectPath -ChildPath "web"

# --- 1. Scaffolding ---
Write-Host "Creating project directories..."
if (-not (Test-Path -Path $projectPath)) {
    New-Item -ItemType Directory -Path $projectPath | Out-Null
}
if (-not (Test-Path -Path $webPath)) {
    New-Item -ItemType Directory -Path $webPath | Out-Null
} else {
    Write-Warning "Directory '$webPath' already exists. Skipping creation."
}

# Navigate into the web directory
Write-Host "Changing directory to '$webPath'..."
Set-Location -Path $webPath

# --- 2. Vite Initialization ---
Write-Host "Initializing Vite project (React + TypeScript)..."
# Use '.' for the project name to initialize in the current directory
npm create vite@latest . --template react-ts

# --- 3. Initial Install ---
Write-Host "Running initial npm install..."
npm install

# --- 4. Tailwind Installation ---
Write-Host "Installing Tailwind CSS v4 and Vite plugin..."
# Install tailwindcss and the specific vite plugin for v4
npm install -D tailwindcss@latest @tailwindcss/vite@latest @types/node

# --- 5. Configure Tailwind CSS File ---
Write-Host "Configuring src/index.css for Tailwind..."
$cssPath = Join-Path -Path $webPath -ChildPath "src\index.css"
$tailwindDirectives = @"
@import "tailwindcss";
"@

# Ensure src directory exists (should be created by Vite)
if (Test-Path -Path (Split-Path $cssPath)) {
    Set-Content -Path $cssPath -Value $tailwindDirectives -Encoding UTF8 -Force
    Write-Host "Successfully updated '$cssPath'"
} else {
    Write-Error "Could not find src directory at '$(Split-Path $cssPath)'"
}


# --- Completion & Next Steps ---
Write-Host "`n-----------------------------------"
Write-Host "Script finished."
Write-Host "Next steps (Manual Configuration Required):"
Write-Host "1. Modify 'tsconfig.json' and 'tsconfig.app.json' for path aliases."
Write-Host "2. Update 'vite.config.ts' for path aliases and Tailwind plugin."
Write-Host "3. Run 'npx shadcn@latest init' to configure Shadcn/ui."
Write-Host "4. Add Shadcn/ui components (e.g., 'npx shadcn@latest add button')."
Write-Host "5. Start the dev server ('npm run dev')."
Write-Host "-----------------------------------"

# Optional: Open VS Code in the project directory if available
# if (Get-Command code -ErrorAction SilentlyContinue) {
#   code $projectPath
# }