import type { WorkoutDto } from '../types'
import { ExerciseModality } from '../types'
import { formatDuration } from '../../../shared/utils'

interface WorkoutListProps {
  workouts: WorkoutDto[]
  loading?: boolean
}

export function WorkoutList({ workouts, loading }: WorkoutListProps) {
  if (loading) {
    return (
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Recent workouts</h2>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="animate-pulse">
              <div className="h-6 bg-base-300 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-base-300 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-base-300 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">Recent workouts</h2>
      {workouts.length === 0 ? (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <p className="text-base-content/60">No workouts yet. Start your first workout!</p>
          </div>
        </div>
      ) : (
        workouts.map((workout) => (
          <div key={workout.id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <h3 className="card-title">{workout.name || 'Workout'}</h3>
                <span className="text-xs text-base-content/60">
                  {workout.date ? new Date(workout.date).toLocaleString() : ''}
                </span>
              </div>
              <ul className="mt-2 list-disc pl-6 text-sm text-base-content/80">
                {workout.exercises?.map((exercise, i) => (
                  <li key={i}>
                    <span className="font-medium">{exercise.name}</span> — {exercise.sets?.map((set) => {
                      const modality = exercise.modality || ExerciseModality.WeightReps
                      if (modality === ExerciseModality.Time) {
                        return `${set.durationMs ? formatDuration(set.durationMs) : '—'}${set.distanceM ? ` (${set.distanceM}km)` : ''}`
                      } else if (modality === ExerciseModality.Distance) {
                        return `${set.distanceM ? `${set.distanceM}km` : '—'}${set.durationMs ? ` in ${formatDuration(set.durationMs)}` : ''}`
                      } else {
                        return `${set.reps} reps${set.weight ? ` @ ${set.weight}kg` : ''}`
                      }
                    }).join(', ')}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      )}
    </section>
  )
}