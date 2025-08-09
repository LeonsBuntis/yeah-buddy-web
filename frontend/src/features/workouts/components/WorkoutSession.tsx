import { useState } from 'react'
import type { ExerciseDto } from '../types'
import { ExerciseBuilder } from '../../exercises/components/ExerciseBuilder'
import { WorkoutPreview } from './WorkoutPreview'
import { useRestTimer } from '../hooks'
import { useToasts } from '../../../shared/hooks'
import { formatRestTime } from '../../../shared/utils'

interface WorkoutSessionProps {
  name: string
  exercises: ExerciseDto[]
  onAddExercise: (exercise: ExerciseDto) => void
  onFinishWorkout: () => void
  onCancelWorkout: () => void
}

export function WorkoutSession({ 
  name, 
  exercises, 
  onAddExercise,
  onFinishWorkout,
  onCancelWorkout 
}: WorkoutSessionProps) {
  const [defaultRestTime, setDefaultRestTime] = useState(90)
  const { addToast } = useToasts()
  const { restTimerSeconds, startRestTimer, pauseRestTimer } = useRestTimer(() => {
    addToast('Rest time complete!', 'success')
  })

  const handleExerciseAdded = (exercise: ExerciseDto) => {
    onAddExercise(exercise)
  }

  const handleSetAdded = (isWarmup: boolean) => {
    // Auto-start rest timer if not a warm-up set
    if (!isWarmup && defaultRestTime > 0) {
      startRestTimer(defaultRestTime)
    }
  }

  return (
    <section className="card bg-base-100 shadow-xl">
      <div className="card-body space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="card-title">{name || 'Workout in progress'}</h2>
            <p className="text-xs text-base-content/60">Add sets, then add the exercise to this workout.</p>
          </div>
          {/* Rest Timer Display */}
          {restTimerSeconds !== null && (
            <div className="flex items-center gap-2">
              <div className={`badge badge-lg ${
                restTimerSeconds <= 10 ? 'badge-error' : 
                restTimerSeconds <= 30 ? 'badge-warning' : 
                'badge-info'
              }`}>
                Rest: {formatRestTime(restTimerSeconds)}
              </div>
              <button 
                onClick={pauseRestTimer}
                className="btn btn-circle btn-xs btn-ghost"
              >
                ⏸️
              </button>
            </div>
          )}
        </div>

        <ExerciseBuilder 
          onExerciseAdded={handleExerciseAdded}
          onSetAdded={handleSetAdded}
          defaultRestTime={defaultRestTime}
          setDefaultRestTime={setDefaultRestTime}
          restTimerSeconds={restTimerSeconds}
          startRestTimer={startRestTimer}
          pauseRestTimer={pauseRestTimer}
          workoutName={name}
        />

        {/* Preview of exercises in the current workout */}
        {exercises.length > 0 && (
          <WorkoutPreview exercises={exercises} />
        )}
      </div>
    </section>
  )
}