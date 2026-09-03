param(
  [Parameter(Mandatory=$true)][string]$Video,
  [string]$OutDir = "frames",
  [int]$Fps = 5
)
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
ffmpeg -i $Video -vf "fps=$Fps" "$OutDir/frame_%06d.jpg"
