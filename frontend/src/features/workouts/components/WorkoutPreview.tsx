import type { ExerciseDto } from '../types'
import { ExerciseModality } from '../types'
import { formatDuration } from '../../../shared/utils'

interface WorkoutPreviewProps {
  exercises: ExerciseDto[]
}

export function WorkoutPreview({ exercises }: WorkoutPreviewProps) {
  return (
    <div className="space-y-3 pt-2">
      {exercises.map((exercise, i) => (
        <div key={i} className="card bg-base-100 border">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <span className="font-medium text-primary">{exercise.name}</span>
              <span className="badge badge-outline">
                {exercise.modality === ExerciseModality.WeightReps && 'Weight × Reps'}
                {exercise.modality === ExerciseModality.Time && 'Time-based'}
                {exercise.modality === ExerciseModality.Distance && 'Distance-based'}
                {exercise.modality === ExerciseModality.Bodyweight && 'Bodyweight'}
                {exercise.modality === ExerciseModality.Assisted && 'Assisted'}
              </span>
            </div>
            <ul className="text-sm text-base-content/80 mt-2">
              {exercise.sets.map((set, j) => (
                <li key={j} className="py-1">
                  Set {j + 1}: 
                  {exercise.modality === ExerciseModality.WeightReps && ` ${set.reps} reps${set.weight ? ` @ ${set.weight} kg` : ''}`}
                  {exercise.modality === ExerciseModality.Time && ` ${set.durationMs ? formatDuration(set.durationMs) : '—'}${set.distanceM ? ` (${set.distanceM}km)` : ''}`}
                  {exercise.modality === ExerciseModality.Distance && ` ${set.distanceM ? `${set.distanceM}km` : '—'}${set.durationMs ? ` in ${formatDuration(set.durationMs)}` : ''}`}
                  {(exercise.modality === ExerciseModality.Bodyweight || exercise.modality === ExerciseModality.Assisted) && ` ${set.reps} reps${set.weight ? ` @ ${set.weight} kg` : ''}`}
                  {set.isWarmup ? ' [Warm-up]' : ''}
                  {set.isDropset ? ' [Drop set]' : ''}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  )
}