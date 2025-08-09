import type { WorkoutDto } from '../types'
import { apiBase } from '../../../shared/api/config'

// API functions for workout operations
export const workoutApi = {
  // Fetch all workouts
  async getWorkouts(): Promise<WorkoutDto[]> {
    const response = await fetch(`${apiBase}/workouts`)
    return response.json()
  },

  // Create a new workout
  async createWorkout(workout: WorkoutDto): Promise<WorkoutDto> {
    const response = await fetch(`${apiBase}/workouts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workout),
    })
    return response.json()
  }
}