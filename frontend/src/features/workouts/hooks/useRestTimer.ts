import { useState, useEffect } from 'react'

export function useRestTimer(onComplete?: () => void) {
  const [restTimerSeconds, setRestTimerSeconds] = useState<number | null>(null)
  const [restStartTime, setRestStartTime] = useState<number | null>(null)

  useEffect(() => {
    let interval: number
    if (restTimerSeconds !== null && restTimerSeconds > 0) {
      interval = setInterval(() => {
        setRestTimerSeconds(prev => {
          if (prev === null || prev <= 1) {
            // Timer finished
            if (restStartTime && onComplete) {
              onComplete()
            }
            return null
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [restTimerSeconds, restStartTime, onComplete])

  const startRestTimer = (seconds: number) => {
    setRestTimerSeconds(seconds)
    setRestStartTime(Date.now())
  }

  const pauseRestTimer = () => {
    setRestTimerSeconds(null)
    setRestStartTime(null)
  }

  return {
    restTimerSeconds,
    startRestTimer,
    pauseRestTimer,
    isActive: restTimerSeconds !== null
  }
}