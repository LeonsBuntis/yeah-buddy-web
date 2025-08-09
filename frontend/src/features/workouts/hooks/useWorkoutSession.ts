import { useState } from 'react'
import type { ExerciseDto } from '../types'

export function useWorkoutSession() {
  const [isStarted, setIsStarted] = useState(false)
  const [name, setName] = useState('')
  const [exercises, setExercises] = useState<ExerciseDto[]>([])

  const startWorkout = () => {
    setIsStarted(true)
    setExercises([])
  }

  const cancelWorkout = () => {
    setIsStarted(false)
    setExercises([])
    setName('')
  }

  const addExercise = (exercise: ExerciseDto) => {
    setExercises(prev => [...prev, exercise])
  }

  const removeExercise = (index: number) => {
    setExercises(prev => prev.filter((_, i) => i !== index))
  }

  return {
    isStarted,
    name,
    setName,
    exercises,
    startWorkout,
    cancelWorkout,
    addExercise,
    removeExercise
  }
}