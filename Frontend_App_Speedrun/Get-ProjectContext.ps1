# Script to concatenate content of specified project files for context sharing.
# Run this script from the root directory of the Frontend_App_Speedrun project.

# --- Configuration ---
$basePath = $PWD # Use the current directory as the base path
$outputFilePath = ".\project_context_dump.txt" # Optional: Set a file path to save the output directly

# --- List of files/directories to process (relative to $basePath) ---
# Based on the list provided by the user.
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

foreach ($relativeFilePath in $fileList) {
    $fullFilePath = Join-Path -Path $basePath -ChildPath $relativeFilePath
    # Check if it exists and is a file (not a directory)
    if (Test-Path -Path $fullFilePath -PathType Leaf) {
        try {
            # Add a header indicating the file path
            $null = $allContent.AppendLine("`n--- START FILE: $($relativeFilePath) ---")
            # Get the raw content of the file
            $fileContent = Get-Content -Path $fullFilePath -Raw -ErrorAction Stop
            $null = $allContent.AppendLine($fileContent)
            $null = $allContent.AppendLine("--- END FILE: $($relativeFilePath) ---")
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

# Option 2: Save to a file (Uncomment the following lines to enable)
try {
    Set-Content -Path $outputFilePath -Value $finalOutput -Encoding UTF8 -ErrorAction Stop
    Write-Host "Content successfully written to: $outputFilePath"
} catch {
    Write-Error "Failed to write to file '$outputFilePath'. Error: $($_.Exception.Message)"
}