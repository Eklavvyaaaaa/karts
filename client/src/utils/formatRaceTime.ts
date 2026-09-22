export function formatRaceTime(seconds: number | null) {
  if (seconds === null || !Number.isFinite(seconds)) return '--:--.---'
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0')
  const remainder = (seconds % 60).toFixed(3).padStart(6, '0')
  return `${minutes}:${remainder}`
}
