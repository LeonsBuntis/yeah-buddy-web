// Utility functions for duration and time formatting

// Helper function to parse duration from mm:ss to milliseconds
export const parseDuration = (duration: string): number | undefined => {
  if (!duration.trim()) return undefined
  const parts = duration.split(':')
  if (parts.length === 2) {
    const minutes = parseInt(parts[0] || '0', 10)
    const seconds = parseInt(parts[1] || '0', 10)
    if (!isNaN(minutes) && !isNaN(seconds)) {
      return (minutes * 60 + seconds) * 1000
    }
  }
  return undefined
}

// Helper function to format duration from milliseconds to mm:ss
export const formatDuration = (durationMs: number): string => {
  const totalSeconds = Math.floor(durationMs / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// Format rest time in mm:ss format
export const formatRestTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}