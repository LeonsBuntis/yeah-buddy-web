// Exercise and workout related types

// Exercise modality constants to match backend
export const ExerciseModality = {
  WeightReps: 1,
  Time: 2,
  Distance: 3,
  Bodyweight: 4,
  Assisted: 5
} as const

export type ExerciseModalityType = typeof ExerciseModality[keyof typeof ExerciseModality]

// Enhanced types to match new backend models
export type SetDto = { 
  id?: string
  reps: number
  weight?: number
  rpe?: number
  durationMs?: number
  distanceM?: number
  isWarmup?: boolean
  isDropset?: boolean
  isFailure?: boolean
  isBodyweight?: boolean
  additionalWeight?: number
  notes?: string
  restSeconds?: number
  done?: boolean // UI-only field for tracking completion
}

export type ExerciseDto = { 
  id?: string
  name: string
  modality?: ExerciseModalityType
  sets: SetDto[] 
}

export type WorkoutDto = { 
  id?: string
  date?: string
  name?: string
  exercises: ExerciseDto[] 
}