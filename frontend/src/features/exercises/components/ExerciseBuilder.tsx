import { useState } from 'react'
import type { ExerciseDto, SetDto, ExerciseModalityType } from '../types'
import { useExercise } from '../hooks'
import { ExerciseModality } from '../types'
import { formatDuration } from '../../../shared/utils'
import { InlineEdit } from '../../../shared/components'

interface ExerciseBuilderProps {
  onExerciseAdded: (exercise: ExerciseDto) => void
  onSetAdded: (isWarmup: boolean) => void
  defaultRestTime: number
  setDefaultRestTime: (time: number) => void
  restTimerSeconds: number | null
  startRestTimer: (seconds: number) => void
  pauseRestTimer: () => void
  workoutName: string
}

export function ExerciseBuilder({
  onExerciseAdded,
  onSetAdded,
  defaultRestTime,
  setDefaultRestTime,
  restTimerSeconds,
  startRestTimer,
  pauseRestTimer,
  workoutName
}: ExerciseBuilderProps) {
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
  
  const {
    exerciseName,
    setExerciseName,
    exerciseModality,
    setExerciseModality,
    currentSets,
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
    addSet,
    removeSet,
    copyPreviousSet,
    incrementWeight,
    toggleSetDone,
    updateSetNumber,
    updateSetReps,
    createExercise,
    resetExercise
  } = useExercise()

  const handleAddSet = () => {
    const success = addSet(defaultRestTime)
    if (success) {
      onSetAdded(isWarmupInput)
    }
  }

  const handleAddExercise = () => {
    const exercise = createExercise()
    if (exercise) {
      onExerciseAdded(exercise)
      resetExercise()
    }
  }

  return (
    <>
      {/* Exercise header like screenshot (blue title) */}
      <div className="flex items-center justify-between">
        <div className="text-primary font-medium">{exerciseName || 'Exercise name'}</div>
        {/* placeholder for actions/icons */}
      </div>

      {/* Exercise name and modality selector */}
      <div className="exercise-form-grid">
        <div>
          <label htmlFor="exercise-name" className="label">
            <span className="label-text">Exercise name</span>
          </label>
          <input
            id="exercise-name"
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            placeholder="Exercise (e.g., Deadlift)"
            className="input input-bordered w-full touch-target"
          />
        </div>
        <div>
          <label htmlFor="exercise-modality" className="label">
            <span className="label-text">Type</span>
          </label>
          <select
            id="exercise-modality"
            value={exerciseModality}
            onChange={(e) => setExerciseModality(Number(e.target.value) as ExerciseModalityType)}
            className="select select-bordered w-full touch-target"
          >
            <option value={ExerciseModality.WeightReps}>Weight × Reps</option>
            <option value={ExerciseModality.Time}>Time-based</option>
            <option value={ExerciseModality.Distance}>Distance-based</option>
            <option value={ExerciseModality.Bodyweight}>Bodyweight</option>
            <option value={ExerciseModality.Assisted}>Assisted</option>
          </select>
        </div>
      </div>

      {/* Set inputs based on modality */}
      <div className="space-y-4">
        {/* Weight and Reps - shown for most modalities */}
        {(exerciseModality === ExerciseModality.WeightReps || 
          exerciseModality === ExerciseModality.Bodyweight || 
          exerciseModality === ExerciseModality.Assisted) && (
          <div className="exercise-form-grid--compact">
            <div>
              <label htmlFor="reps-input" className="label">
                <span className="label-text">Reps</span>
              </label>
              <input
                id="reps-input"
                type="number"
                value={repsInput}
                onChange={(e) => setRepsInput(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Reps"
                className="input input-bordered w-full touch-target"
                min="0"
              />
            </div>
            <div>
              <label htmlFor="weight-input" className="label">
                <span className="label-text">Weight (kg)</span>
              </label>
              <input
                id="weight-input"
                type="number"
                step="0.5"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Weight"
                className="input input-bordered w-full touch-target"
                min="0"
              />
            </div>
          </div>
        )}

        {/* Time-based inputs */}
        {exerciseModality === ExerciseModality.Time && (
          <div className="exercise-form-grid--compact">
            <div>
              <label htmlFor="duration-input" className="label">
                <span className="label-text">Duration</span>
              </label>
              <input
                id="duration-input"
                type="text"
                value={durationInput}
                onChange={(e) => setDurationInput(e.target.value)}
                placeholder="mm:ss"
                className="input input-bordered w-full touch-target"
              />
            </div>
            <div>
              <label htmlFor="distance-time-input" className="label">
                <span className="label-text">Distance (km, optional)</span>
              </label>
              <input
                id="distance-time-input"
                type="number"
                step="0.1"
                value={distanceInput}
                onChange={(e) => setDistanceInput(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Distance"
                className="input input-bordered w-full touch-target"
                min="0"
              />
            </div>
          </div>
        )}

        {/* Distance-based inputs */}
        {exerciseModality === ExerciseModality.Distance && (
          <div className="exercise-form-grid--compact">
            <div>
              <label htmlFor="distance-distance-input" className="label">
                <span className="label-text">Distance (km)</span>
              </label>
              <input
                id="distance-distance-input"
                type="number"
                step="0.1"
                value={distanceInput}
                onChange={(e) => setDistanceInput(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Distance"
                className="input input-bordered w-full touch-target"
                min="0"
              />
            </div>
            <div>
              <label htmlFor="time-distance-input" className="label">
                <span className="label-text">Time (mm:ss, optional)</span>
              </label>
              <input
                id="time-distance-input"
                type="text"
                value={durationInput}
                onChange={(e) => setDurationInput(e.target.value)}
                placeholder="mm:ss"
                className="input input-bordered w-full touch-target"
              />
            </div>
          </div>
        )}

        {/* Notes input for all modalities */}
        <div>
          <label htmlFor="notes-input" className="label">
            <span className="label-text">Notes (optional)</span>
          </label>
          <input
            id="notes-input"
            type="text"
            value={notesInput}
            onChange={(e) => setNotesInput(e.target.value)}
            placeholder="Add notes about this set..."
            className="input input-bordered w-full touch-target"
          />
        </div>

        {/* Advanced Options */}
        <div>
          <button
            type="button"
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            className="advanced-toggle touch-target"
            aria-expanded={showAdvancedOptions}
          >
            <span>{showAdvancedOptions ? '▼' : '▶'}</span>
            Advanced options
            {(isWarmupInput || isDropsetInput) && (
              <div className="flex gap-1 ml-2">
                {isWarmupInput && <span className="badge badge-warning badge-xs">Warm-up</span>}
                {isDropsetInput && <span className="badge badge-secondary badge-xs">Drop set</span>}
              </div>
            )}
          </button>
          
          {showAdvancedOptions && (
            <div className="advanced-options mt-2">
              <div className="flex flex-wrap gap-4">
                <label className="label cursor-pointer gap-2 p-0 touch-target">
                  <input
                    type="checkbox"
                    checked={isWarmupInput}
                    onChange={(e) => setIsWarmupInput(e.target.checked)}
                    className="checkbox checkbox-sm"
                  />
                  <span className="label-text">Warm-up set</span>
                </label>
                <label className="label cursor-pointer gap-2 p-0 touch-target">
                  <input
                    type="checkbox"
                    checked={isDropsetInput}
                    onChange={(e) => setIsDropsetInput(e.target.checked)}
                    className="checkbox checkbox-sm"
                  />
                  <span className="label-text">Drop set</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={handleAddSet} 
            className="btn btn-primary touch-target"
            aria-label="Add set to current exercise"
          >
            + Add Set
          </button>
          {currentSets.length > 0 && (
            <>
              <button 
                onClick={copyPreviousSet} 
                className="btn btn-outline touch-target"
                aria-label="Copy values from previous set"
              >
                Copy Previous
              </button>
              {exerciseModality === ExerciseModality.WeightReps && (
                <>
                  <button 
                    onClick={() => incrementWeight(2.5)} 
                    className="btn btn-outline btn-sm touch-target"
                    aria-label="Increase weight by 2.5kg"
                  >
                    +2.5kg
                  </button>
                  <button 
                    onClick={() => incrementWeight(5)} 
                    className="btn btn-outline btn-sm touch-target"
                    aria-label="Increase weight by 5kg"
                  >
                    +5kg
                  </button>
                </>
              )}
            </>
          )}
        </div>
        
        {/* Rest timer controls - simplified */}
        <div className="flex items-center gap-2">
          <label htmlFor="rest-timer" className="text-sm text-base-content/80">
            Rest:
          </label>
          <select 
            id="rest-timer"
            value={defaultRestTime} 
            onChange={(e) => setDefaultRestTime(Number(e.target.value))}
            className="select select-bordered select-sm touch-target"
            aria-label="Default rest time between sets"
          >
            <option value={60}>1:00</option>
            <option value={90}>1:30</option>
            <option value={120}>2:00</option>
            <option value={180}>3:00</option>
            <option value={300}>5:00</option>
          </select>
          {restTimerSeconds === null ? (
            <button 
              onClick={() => startRestTimer(defaultRestTime)} 
              className="btn btn-outline btn-sm touch-target"
              aria-label="Start rest timer"
            >
              Start Timer
            </button>
          ) : (
            <button 
              onClick={pauseRestTimer}
              className="btn btn-outline btn-sm touch-target"
              aria-label="Pause rest timer"
            >
              Pause Timer
            </button>
          )}
        </div>
      </div>

      {/* Sets table with workout caption */}
      <div className="card bg-base-100 border">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <caption className="text-left px-4 py-3 font-semibold">{workoutName || 'Workout'}</caption>
              <thead>
                <tr>
                  <th className="w-16">Set</th>
                  <th>Previous</th>
                  {(exerciseModality === ExerciseModality.WeightReps || 
                    exerciseModality === ExerciseModality.Bodyweight || 
                    exerciseModality === ExerciseModality.Assisted) && (
                    <>
                      <th>kg</th>
                      <th>Reps</th>
                    </>
                  )}
                  {exerciseModality === ExerciseModality.Time && (
                    <>
                      <th>Duration</th>
                      <th>Distance</th>
                    </>
                  )}
                  {exerciseModality === ExerciseModality.Distance && (
                    <>
                      <th>Distance</th>
                      <th>Time</th>
                    </>
                  )}
                  <th>Notes</th>
                  <th className="w-16 text-right">Done</th>
                </tr>
              </thead>
              <tbody>
                {currentSets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-0">
                      <div className="empty-state">
                        <p>No sets yet</p>
                        <div className="empty-state__cta">
                          <button 
                            onClick={handleAddSet}
                            className="btn btn-primary btn-sm touch-target"
                            aria-label="Add your first set"
                          >
                            Add first set
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentSets.map((s, i) => (
                    <SetRow
                      key={i}
                      set={s}
                      index={i}
                      exerciseModality={exerciseModality}
                      onToggleDone={() => toggleSetDone(i)}
                      onRemove={() => removeSet(i)}
                      onUpdateSetNumber={(newSetNumber) => updateSetNumber(i, newSetNumber)}
                      onUpdateReps={(newReps) => updateSetReps(i, newReps)}
                      totalSets={currentSets.length}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={handleAddExercise}
          disabled={!exerciseName.trim() || currentSets.length === 0}
          className="btn btn-outline touch-target"
          aria-label="Add this exercise to workout"
        >
          Add Exercise to Workout
        </button>
        {exerciseName.trim() && currentSets.length > 0 && (
          <span className="text-sm text-base-content/60">
            Ready to add "{exerciseName}" with {currentSets.length} set{currentSets.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </>
  )
}

// Sub-component for each set row to avoid duplication
interface SetRowProps {
  set: SetDto
  index: number
  exerciseModality: ExerciseModalityType
  onToggleDone: () => void
  onRemove: () => void
  onUpdateSetNumber: (newSetNumber: number) => void
  onUpdateReps: (newReps: number) => void
  totalSets: number
}

function SetRow({ set, index, exerciseModality, onToggleDone, onRemove, onUpdateSetNumber, onUpdateReps, totalSets }: SetRowProps) {
  return (
    <tr className={`${set.isWarmup ? 'bg-warning/10' : ''} ${set.isDropset ? 'bg-secondary/10' : ''}`}>
      <td className="text-base-content/60">
        <div className="flex items-center gap-1">
          <InlineEdit
            value={index + 1}
            onCommit={onUpdateSetNumber}
            min={1}
            max={totalSets}
            validate={(newSetNumber: number) => {
              const newIndex = newSetNumber - 1
              if (newIndex !== index) {
                return `Set ${newSetNumber} position already exists`
              }
              return null
            }}
          />
          {set.isWarmup && <span className="ml-1 badge badge-warning badge-xs">W</span>}
          {set.isDropset && <span className="ml-1 badge badge-secondary badge-xs">D</span>}
        </div>
      </td>
      <td className="text-base-content/40">—</td>
      {(exerciseModality === ExerciseModality.WeightReps || 
        exerciseModality === ExerciseModality.Bodyweight || 
        exerciseModality === ExerciseModality.Assisted) && (
        <>
          <td>{set.weight ?? '—'}</td>
          <td>
            <InlineEdit
              value={set.reps}
              onCommit={onUpdateReps}
              min={1}
              max={100}
              placeholder="Reps"
            />
          </td>
        </>
      )}
      {exerciseModality === ExerciseModality.Time && (
        <>
          <td>{set.durationMs ? formatDuration(set.durationMs) : '—'}</td>
          <td>{set.distanceM ? `${set.distanceM}km` : '—'}</td>
        </>
      )}
      {exerciseModality === ExerciseModality.Distance && (
        <>
          <td>{set.distanceM ? `${set.distanceM}km` : '—'}</td>
          <td>{set.durationMs ? formatDuration(set.durationMs) : '—'}</td>
        </>
      )}
      <td className="text-xs">{set.notes ? set.notes.substring(0, 20) + (set.notes.length > 20 ? '...' : '') : '—'}</td>
      <td className="text-right">
        <button
          onClick={onToggleDone}
          className={
            'btn btn-circle btn-xs touch-target ' +
            (set.done ? 'btn-success' : 'btn-outline')
          }
          aria-label={set.done ? 'Mark as not done' : 'Mark as done'}
        >
          ✓
        </button>
        <button 
          onClick={onRemove} 
          className="btn btn-ghost btn-xs text-error ml-2 touch-target"
          aria-label="Remove this set"
        >
          remove
        </button>
      </td>
    </tr>
  )
}