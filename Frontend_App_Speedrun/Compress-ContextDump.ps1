<#
.SYNOPSIS
  Concatenates the first 100 lines of specified project files for context sharing.

.DESCRIPTION
  This script reads a predefined list of files and directories relative to the
  project's root directory. For each specified file, it extracts the first
  100 lines and appends them, along with file path markers, to a single
  output string or file. This is useful for creating a condensed context
  snapshot for LLMs or code review.

.NOTES
  - Run this script from the root directory of the Frontend_App_Speedrun project.
  - Files with fewer than 100 lines will have their entire content included.
  - Ensure the $fileList variable accurately reflects the desired project files.
#>

# --- Configuration ---
$basePath = $PWD # Use the current directory as the base path
# Output file path (optional, uncomment Set-Content lines to enable file saving)
$outputFilePath = ".\project_context_100lines_dump.txt"

# --- List of files/directories to process (relative to $basePath) ---
# Based on the list provided previously.
$fileList = @(
    "web\public\vite.svg",
    "web\src\assets\react.svg",
    "web\src\components\contexts\appSettingsContext.ts",
    "web\src\components\contexts\AppSettingsProvider.tsx",
    "web\src\components\layout\BottomNav.tsx",
    "web\src\components\layout\MainLayout.tsx",
    "web\src\components\layout\SettingsLayout.tsx",
    "web\src\components\settings\SettingsAccountPage.tsx", # Note: This seems duplicated with the one under pages/app/settings? Keeping both as listed.
    "web\src\components\settings\SettingsNav.tsx",
    "web\src\components\ui\alert-dialog.tsx",
    "web\src\components\ui\avatar.tsx",
    "web\src\components\ui\button.tsx",
    "web\src\components\ui\calendar.tsx",
    "web\src\components\ui\card.tsx",
    "web\src\components\ui\command.tsx",
    "web\src\components\ui\dialog.tsx",
    "web\src\components\ui\input.tsx",
    "web\src\components\ui\label.tsx",
    "web\src\components\ui\popover.tsx",
    "web\src\components\ui\progress.tsx",
    "web\src\components\ui\radio-group.tsx",
    "web\src\components\ui\separator.tsx",
    "web\src\components\ui\table.tsx",
    "web\src\data\dummyStats.ts",
    "web\src\data\dummyWorkouts.ts",
    "web\src\data\exercises.ts",
    "web\src\hooks\useAppSettings.ts",
    "web\src\lib\utils.ts",
    "web\src\pages\app\settings\SettingsAccountPage.tsx",
    "web\src\pages\app\settings\SettingsAppearancePage.tsx",
    "web\src\pages\app\settings\SettingsContactPage.tsx",
    "web\src\pages\app\settings\SettingsLanguagePage.tsx",
    "web\src\pages\app\settings\SettingsPlaceholderPage.tsx",
    "web\src\pages\app\settings\SettingsSubscriptionPage.tsx",
    "web\src\pages\app\ActiveWorkoutPage.tsx",
    "web\src\pages\app\CalendarPage.tsx",
    "web\src\pages\app\CreateWorkoutPage.tsx",
    "web\src\pages\app\PersonalRecordsPage.tsx",
    "web\src\pages\app\PlaceholderPage.tsx",
    "web\src\pages\app\ProfilePage.tsx",
    "web\src\pages\app\StartWorkoutPage.tsx",
    "web\src\pages\app\StatsPage.tsx",
    "web\src\pages\app\WorkoutsPage.tsx",
    "web\src\pages\CreateProfilePage.tsx",
    "web\src\pages\LandingPage.tsx",
    "web\src\pages\LoginPage.tsx",
    "web\src\pages\RegisterPage.tsx",
    "web\src\types\workout.ts",
    "web\src\App.css", # Listed in structure, but maybe meant index.css? Including as listed.
    "web\src\App.tsx",
    "web\src\index.css",
    "web\src\main.tsx",
    "web\src\vite-env.d.ts",
    "web\.gitignore",
    "web\.prettierrc.json",
    "web\components.json",
    "web\eslint.config.js",
    "web\index.html",
    "web\package.json",
    "web\README.md",
    "web\tailwind.config.ts",
    "web\tsconfig.app.json",
    "web\tsconfig.json",
    "web\tsconfig.node.json",
    "web\vite.config.ts"
)

# --- Processing ---
$allContent = [System.Text.StringBuilder]::new()
$linesToTake = 100 # Define how many lines to take from the start of each file

Write-Host "Processing files (taking first $linesToTake lines)..."

foreach ($relativeFilePath in $fileList) {
    $fullFilePath = Join-Path -Path $basePath -ChildPath $relativeFilePath
    # Check if it exists and is a file (not a directory)
    if (Test-Path -Path $fullFilePath -PathType Leaf) {
        try {
            # Add a header indicating the file path and line limit
            $null = $allContent.AppendLine("`n--- START FILE (First $linesToTake lines): $($relativeFilePath) ---")

            # Get the first N lines of the file
            # Get-Content without -Raw returns an array of lines
            # -TotalCount N gets the first N lines efficiently
            $fileLines = Get-Content -Path $fullFilePath -TotalCount $linesToTake -ErrorAction Stop

            # Join the lines back together with newline characters
            $fileContent = $fileLines -join [System.Environment]::NewLine

            # Append the content to the StringBuilder
            $null = $allContent.AppendLine($fileContent)

            # Add the end marker
            $null = $allContent.AppendLine("--- END FILE: $($relativeFilePath) ---")
            Write-Verbose "Processed: $relativeFilePath" # Add -Verbose switch when running script to see this
        } catch {
            Write-Warning "Could not read file: $fullFilePath. Error: $($_.Exception.Message)"
        }
    } elseif (Test-Path -Path $fullFilePath -PathType Container) {
        # Optionally, uncomment the next line to be notified about skipped directories from your list
        # Write-Host "Skipping directory listed in fileList: $relativeFilePath"
    } else {
        Write-Warning "Path not found or is not a file: $fullFilePath"
    }
}

# --- Output ---
$finalOutput = $allContent.ToString()

# Option 1: Output to console (useful for direct copy-pasting)
# Uncomment the next line to output directly to the console
# Write-Host $finalOutput

# Option 2: Save to a file
try {
    Set-Content -Path $outputFilePath -Value $finalOutput -Encoding UTF8 -ErrorAction Stop
    Write-Host "Content (first $linesToTake lines per file) successfully written to: $outputFilePath"
} catch {
    Write-Error "Failed to write to file '$outputFilePath'. Error: $($_.Exception.Message)"
}

Write-Host "Script finished."