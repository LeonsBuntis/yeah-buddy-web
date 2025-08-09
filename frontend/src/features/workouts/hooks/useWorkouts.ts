import { useState, useEffect } from 'react'
import type { WorkoutDto } from '../types'
import { workoutApi } from '../api'

export function useWorkouts() {
  const [workouts, setWorkouts] = useState<WorkoutDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadWorkouts()
  }, [])

  const loadWorkouts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await workoutApi.getWorkouts()
      setWorkouts(data)
    } catch (err) {
      setError('Failed to load workouts')
      console.error('Error loading workouts:', err)
    } finally {
      setLoading(false)
    }
  }

  const createWorkout = async (workout: WorkoutDto) => {
    try {
      setError(null)
      const created = await workoutApi.createWorkout(workout)
      setWorkouts(prev => [created, ...prev])
      return created
    } catch (err) {
      setError('Failed to create workout')
      console.error('Error creating workout:', err)
      throw err
    }
  }

  return {
    workouts,
    loading,
    error,
    createWorkout,
    refreshWorkouts: loadWorkouts
  }
}