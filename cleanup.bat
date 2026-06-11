@echo off
cd "c:\Users\ebenn\Downloads\un-petit-monde-pour-toi"

del "(1).gitignore" 2>nul
del ".env(1).example" 2>nul
del "index(1).html" 2>nul
del "metadata(1).json" 2>nul
del "package(1).json" 2>nul
del "README(1).md" 2>nul
del "tsconfig(1).json" 2>nul
del "vite.config(1).ts" 2>nul
del "cleanup.ps1" 2>nul

del "src\components\Background(1).tsx" 2>nul
del "src\components\AdminPanel(1).tsx" 2>nul
del "src\components\steps\Step0_Lock(1).tsx" 2>nul
del "src\components\steps\Step1_Intro(1).tsx" 2>nul
del "src\components\steps\Step2_Capsule(1).tsx" 2>nul
del "src\components\steps\Step3_Gallery(1).tsx" 2>nul
del "src\components\steps\Step4_Playlist(1).tsx" 2>nul
del "src\components\steps\Step5_Letter(1).tsx" 2>nul
del "src\components\steps\Step6_Messages(1).tsx" 2>nul
del "src\components\steps\Step7_Surprise(1).tsx" 2>nul

echo Nettoyage termine!
pause
