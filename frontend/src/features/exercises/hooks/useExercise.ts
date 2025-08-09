import { useState } from 'react'
import type { ExerciseDto, SetDto, ExerciseModalityType } from '../types'
import { ExerciseModality } from '../types'
import { parseDuration } from '../../../shared/utils'

export function useExercise() {
  const [exerciseName, setExerciseName] = useState('')
  const [exerciseModality, setExerciseModality] = useState<ExerciseModalityType>(ExerciseModality.WeightReps)
  const [currentSets, setCurrentSets] = useState<SetDto[]>([])

  // Input states for building a set
  const [repsInput, setRepsInput] = useState<number | ''>('' as number | '')
  const [weightInput, setWeightInput] = useState<number | ''>('' as number | '')
  const [durationInput, setDurationInput] = useState<string>('')
  const [distanceInput, setDistanceInput] = useState<number | ''>('' as number | '')
  const [notesInput, setNotesInput] = useState('')
  const [isWarmupInput, setIsWarmupInput] = useState(false)
  const [isDropsetInput, setIsDropsetInput] = useState(false)

  const addSet = (defaultRestTime: number) => {
    const reps = typeof repsInput === 'string' ? parseInt(repsInput || '0', 10) : repsInput
    const weight = typeof weightInput === 'string' ? parseFloat(weightInput || '0') : weightInput
    const distance = typeof distanceInput === 'string' ? parseFloat(distanceInput || '0') : distanceInput
    const durationMs = parseDuration(durationInput)
    
    // Validation based on modality
    if (exerciseModality === ExerciseModality.WeightReps && (!reps || reps <= 0)) return false
    if (exerciseModality === ExerciseModality.Time && !durationMs) return false
    if (exerciseModality === ExerciseModality.Distance && (!distance || distance <= 0)) return false
    if ((exerciseModality === ExerciseModality.Bodyweight || exerciseModality === ExerciseModality.Assisted) && (!reps || reps <= 0)) return false
    
    const set: SetDto = {
      reps: reps || 0,
      weight: weight || undefined,
      durationMs,
      distanceM: distance || undefined,
      isWarmup: isWarmupInput,
      isDropset: isDropsetInput,
      notes: notesInput.trim() || undefined,
      restSeconds: defaultRestTime
    }
    
    setCurrentSets(prev => [...prev, set])
    
    // Clear inputs but keep modality and exercise name
    setRepsInput('')
    setWeightInput('')
    setDurationInput('')
    setDistanceInput('')
    setNotesInput('')
    setIsWarmupInput(false)
    setIsDropsetInput(false)

    return true
  }

  const removeSet = (idx: number) => {
    setCurrentSets(prev => prev.filter((_, i) => i !== idx))
  }

  const copyPreviousSet = () => {
    if (currentSets.length === 0) return false
    const lastSet = currentSets[currentSets.length - 1]
    setRepsInput(lastSet.reps || '')
    setWeightInput(lastSet.weight || '')
    setDurationInput(lastSet.durationMs ? formatDuration(lastSet.durationMs) : '')
    setDistanceInput(lastSet.distanceM || '')
    setNotesInput(lastSet.notes || '')
    setIsWarmupInput(lastSet.isWarmup || false)
    setIsDropsetInput(lastSet.isDropset || false)
    return true
  }

  const incrementWeight = (amount: number) => {
    const currentWeight = typeof weightInput === 'string' ? parseFloat(weightInput || '0') : weightInput
    setWeightInput((currentWeight || 0) + amount)
  }

  const toggleSetDone = (idx: number) => {
    setCurrentSets(prev => prev.map((s, i) => (i === idx ? { ...s, done: !s.done } : s)))
  }

  const updateSetNumber = (oldIndex: number, newSetNumber: number) => {
    const maxSetNumber = currentSets.length
    if (newSetNumber < 1 || newSetNumber > maxSetNumber) {
      throw new Error(`Set number must be between 1 and ${maxSetNumber}`)
    }

    const newIndex = newSetNumber - 1
    if (newIndex === oldIndex) return

    setCurrentSets(prev => {
      const newSets = [...prev]
      const movingSet = newSets[oldIndex]
      newSets.splice(oldIndex, 1)
      newSets.splice(newIndex, 0, movingSet)
      return newSets
    })
  }

  const updateSetReps = (idx: number, newReps: number) => {
    setCurrentSets(prev => 
      prev.map((s, i) => (i === idx ? { ...s, reps: newReps } : s))
    )
  }

  const createExercise = (): ExerciseDto | null => {
    if (!exerciseName.trim() || currentSets.length === 0) return null
    return { 
      name: exerciseName.trim(), 
      modality: exerciseModality,
      sets: currentSets 
    }
  }

  const resetExercise = () => {
    setExerciseName('')
    setExerciseModality(ExerciseModality.WeightReps)
    setCurrentSets([])
    setRepsInput('')
    setWeightInput('')
    setDurationInput('')
    setDistanceInput('')
    setNotesInput('')
    setIsWarmupInput(false)
    setIsDropsetInput(false)
  }

  return {
    // Exercise state
    exerciseName,
    setExerciseName,
    exerciseModality,
    setExerciseModality,
    currentSets,

    // Input state
    repsInput,
    setRepsInput,
    weightInput,
    setWeightInput,
    durationInput,
    setDurationInput,
    distanceInput,
    setDistanceInput,
    notesInput,
    setNotesInput,
    isWarmupInput,
    setIsWarmupInput,
    isDropsetInput,
    setIsDropsetInput,

    // Actions
    addSet,
    removeSet,
    copyPreviousSet,
    incrementWeight,
    toggleSetDone,
    updateSetNumber,
    updateSetReps,
    createExercise,
    resetExercise
  }
}

// Helper function for formatting duration (importing would create circular dependency)
function formatDuration(durationMs: number): string {
  const totalSeconds = Math.floor(durationMs / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}