import { useEffect, useState } from 'react'

// Exercise modality constants to match backend
const ExerciseModality = {
  WeightReps: 1,
  Time: 2,
  Distance: 3,
  Bodyweight: 4,
  Assisted: 5
} as const

type ExerciseModalityType = typeof ExerciseModality[keyof typeof ExerciseModality]

// Enhanced types to match new backend models
type SetDto = { 
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

type ExerciseDto = { 
  id?: string
  name: string
  modality?: ExerciseModalityType
  sets: SetDto[] 
}

type WorkoutDto = { 
  id?: string
  date?: string
  name?: string
  exercises: ExerciseDto[] 
}

const apiBase = 'http://localhost:5216/api'

function App() {
  // Recent workouts fetched from API
  const [workouts, setWorkouts] = useState<WorkoutDto[]>([])

  // Current session state
  const [isStarted, setIsStarted] = useState(false)
  const [name, setName] = useState('')
  const [exercises, setExercises] = useState<ExerciseDto[]>([])

  // Working buffers for building an exercise
  const [exerciseName, setExerciseName] = useState('')
  const [exerciseModality, setExerciseModality] = useState<ExerciseModalityType>(ExerciseModality.WeightReps)
  const [currentSets, setCurrentSets] = useState<SetDto[]>([])
  const [repsInput, setRepsInput] = useState<number | ''>('' as number | '')
  const [weightInput, setWeightInput] = useState<number | ''>('' as number | '')
  const [durationInput, setDurationInput] = useState<string>('') // mm:ss format
  const [distanceInput, setDistanceInput] = useState<number | ''>('' as number | '')
  const [rpeInput, setRpeInput] = useState<number | ''>('' as number | '')
  const [notesInput, setNotesInput] = useState('')
  const [isWarmupInput, setIsWarmupInput] = useState(false)
  const [isDropsetInput, setIsDropsetInput] = useState(false)

  // Rest timer state
  const [restTimerSeconds, setRestTimerSeconds] = useState<number | null>(null)
  const [restStartTime, setRestStartTime] = useState<number | null>(null)
  const [defaultRestTime, setDefaultRestTime] = useState(90) // default 90 seconds

  useEffect(() => {
    fetch(`${apiBase}/workouts`)
      .then((r) => r.json())
      .then((data: WorkoutDto[]) => setWorkouts(data))
      .catch(() => {})
  }, [])

  // Rest timer effect
  useEffect(() => {
    let interval: number
    if (restTimerSeconds !== null && restTimerSeconds > 0) {
      interval = setInterval(() => {
        setRestTimerSeconds(prev => {
          if (prev === null || prev <= 1) {
            // Timer finished
            if (restStartTime) {
              // Show notification (simple alert for now)
              setTimeout(() => alert('Rest time complete!'), 100)
            }
            return null
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [restTimerSeconds, restStartTime])

  const startWorkout = () => {
    setIsStarted(true)
    setExercises([])
    setExerciseName('')
    setExerciseModality(ExerciseModality.WeightReps)
    setCurrentSets([])
    setRepsInput('')
    setWeightInput('')
    setDurationInput('')
    setDistanceInput('')
    setRpeInput('')
    setNotesInput('')
    setIsWarmupInput(false)
    setIsDropsetInput(false)
    setRestTimerSeconds(null)
    setRestStartTime(null)
  }

  const cancelWorkout = () => {
    setIsStarted(false)
    setExercises([])
    setExerciseName('')
    setExerciseModality(ExerciseModality.WeightReps)
    setCurrentSets([])
    setRepsInput('')
    setWeightInput('')
    setDurationInput('')
    setDistanceInput('')
    setRpeInput('')
    setNotesInput('')
    setIsWarmupInput(false)
    setIsDropsetInput(false)
    setName('')
    setRestTimerSeconds(null)
    setRestStartTime(null)
  }

  // Helper function to parse duration from mm:ss to milliseconds
  const parseDuration = (duration: string): number | undefined => {
    if (!duration.trim()) return undefined
    const parts = duration.split(':')
    if (parts.length === 2) {
      const minutes = parseInt(parts[0] || '0', 10)
      const seconds = parseInt(parts[1] || '0', 10)
      if (!isNaN(minutes) && !isNaN(seconds)) {
        return (minutes * 60 + seconds) * 1000
      }
    }
    return undefined
  }

  // Helper function to format duration from milliseconds to mm:ss
  const formatDuration = (durationMs: number): string => {
    const totalSeconds = Math.floor(durationMs / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const addSet = () => {
    const reps = typeof repsInput === 'string' ? parseInt(repsInput || '0', 10) : repsInput
    const weight = typeof weightInput === 'string' ? parseFloat(weightInput || '0') : weightInput
    const distance = typeof distanceInput === 'string' ? parseFloat(distanceInput || '0') : distanceInput
    const rpe = typeof rpeInput === 'string' ? parseInt(rpeInput || '0', 10) : rpeInput
    const durationMs = parseDuration(durationInput)
    
    // Validation based on modality
    if (exerciseModality === ExerciseModality.WeightReps && (!reps || reps <= 0)) return
    if (exerciseModality === ExerciseModality.Time && !durationMs) return
    if (exerciseModality === ExerciseModality.Distance && (!distance || distance <= 0)) return
    if ((exerciseModality === ExerciseModality.Bodyweight || exerciseModality === ExerciseModality.Assisted) && (!reps || reps <= 0)) return
    
    const set: SetDto = {
      reps: reps || 0,
      weight: weight || undefined,
      rpe: rpe || undefined,
      durationMs,
      distanceM: distance || undefined,
      isWarmup: isWarmupInput,
      isDropset: isDropsetInput,
      notes: notesInput.trim() || undefined,
      restSeconds: defaultRestTime
    }
    
    setCurrentSets((prev) => [...prev, set])
    
    // Auto-start rest timer if not a warm-up set
    if (!isWarmupInput && defaultRestTime > 0) {
      setRestTimerSeconds(defaultRestTime)
      setRestStartTime(Date.now())
    }
    
    // Clear inputs but keep modality and exercise name
    setRepsInput('')
    setWeightInput('')
    setDurationInput('')
    setDistanceInput('')
    setRpeInput('')
    setNotesInput('')
    setIsWarmupInput(false)
    setIsDropsetInput(false)
  }

  const removeSet = (idx: number) => {
    setCurrentSets((prev) => prev.filter((_, i) => i !== idx))
  }

  const copyPreviousSet = () => {
    if (currentSets.length === 0) return
    const lastSet = currentSets[currentSets.length - 1]
    setRepsInput(lastSet.reps || '')
    setWeightInput(lastSet.weight || '')
    setDurationInput(lastSet.durationMs ? formatDuration(lastSet.durationMs) : '')
    setDistanceInput(lastSet.distanceM || '')
    setRpeInput(lastSet.rpe || '')
    setNotesInput(lastSet.notes || '')
    setIsWarmupInput(lastSet.isWarmup || false)
    setIsDropsetInput(lastSet.isDropset || false)
  }

  const incrementWeight = (amount: number) => {
    const currentWeight = typeof weightInput === 'string' ? parseFloat(weightInput || '0') : weightInput
    setWeightInput((currentWeight || 0) + amount)
  }

  const startRestTimer = (seconds: number = defaultRestTime) => {
    setRestTimerSeconds(seconds)
    setRestStartTime(Date.now())
  }

  const pauseRestTimer = () => {
    setRestTimerSeconds(null)
    setRestStartTime(null)
  }

  const formatRestTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const addExercise = () => {
    if (!exerciseName.trim() || currentSets.length === 0) return
    const ex: ExerciseDto = { 
      name: exerciseName.trim(), 
      modality: exerciseModality,
      sets: currentSets 
    }
    setExercises((prev) => [...prev, ex])
    setExerciseName('')
    setExerciseModality(ExerciseModality.WeightReps)
    setCurrentSets([])
  }

  const toggleSetDone = (idx: number) => {
    setCurrentSets((prev) => prev.map((s, i) => (i === idx ? { ...s, done: !s.done } : s)))
  }

  const finishWorkout = async () => {
    if (exercises.length === 0) return
    const payload: WorkoutDto = { name: name.trim() || undefined, exercises }
    const res = await fetch(`${apiBase}/workouts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      const created: WorkoutDto = await res.json()
      setWorkouts((prev) => [created, ...prev])
      cancelWorkout()
    }
  }

  return (
    <div className="min-h-screen bg-base-200">
      <header className="navbar bg-base-100 shadow-lg sticky top-0 z-10">
        <div className="navbar-start">
          <div>
            <h1 className="text-xl font-bold">Yeabuddy</h1>
            <p className="text-xs text-base-content/60">Gym workout tracker</p>
          </div>
        </div>
        <div className="navbar-end">
          <div className="flex items-center gap-2">
            {isStarted ? (
              <>
                <button onClick={finishWorkout} className="btn btn-success btn-sm">Finish</button>
                <button onClick={cancelWorkout} className="btn btn-error btn-sm">Cancel</button>
              </>
            ) : null}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6 space-y-6">
        {/* Start panel */}
        {!isStarted && (
          <section className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Start a workout</h2>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Workout name (optional)" 
                  className="input input-bordered w-full" 
                />
                <button onClick={startWorkout} className="btn btn-primary w-full sm:w-auto">Start Workout</button>
              </div>
              <p className="text-xs text-base-content/60 mt-2">You can add exercises after starting.</p>
            </div>
          </section>
        )}

        {/* Build workout panel */}
        {isStarted && (
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

            {/* Exercise header like screenshot (blue title) */}
            <div className="flex items-center justify-between">
              <div className="text-primary font-medium">{exerciseName || 'Exercise name'}</div>
              {/* placeholder for actions/icons */}
            </div>

            {/* Exercise name and modality selector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                placeholder="Exercise (e.g., Deadlift)"
                className="input input-bordered"
              />
              <select
                value={exerciseModality}
                onChange={(e) => setExerciseModality(Number(e.target.value) as ExerciseModalityType)}
                className="select select-bordered"
              >
                <option value={ExerciseModality.WeightReps}>Weight × Reps</option>
                <option value={ExerciseModality.Time}>Time-based</option>
                <option value={ExerciseModality.Distance}>Distance-based</option>
                <option value={ExerciseModality.Bodyweight}>Bodyweight</option>
                <option value={ExerciseModality.Assisted}>Assisted</option>
              </select>
            </div>

            {/* Set inputs based on modality */}
            <div className="space-y-3">
              {/* Weight and Reps - shown for most modalities */}
              {(exerciseModality === ExerciseModality.WeightReps || 
                exerciseModality === ExerciseModality.Bodyweight || 
                exerciseModality === ExerciseModality.Assisted) && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <input
                    type="number"
                    value={repsInput}
                    onChange={(e) => setRepsInput(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Reps"
                    className="input input-bordered"
                  />
                  <input
                    type="number"
                    step="0.5"
                    value={weightInput}
                    onChange={(e) => setWeightInput(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Weight (kg)"
                    className="input input-bordered"
                  />
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={rpeInput}
                    onChange={(e) => setRpeInput(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="RPE (1-10)"
                    className="input input-bordered"
                  />
                  <div className="flex items-center gap-2 flex-wrap">
                    <label className="label cursor-pointer gap-1 p-0">
                      <input
                        type="checkbox"
                        checked={isWarmupInput}
                        onChange={(e) => setIsWarmupInput(e.target.checked)}
                        className="checkbox checkbox-sm"
                      />
                      <span className="label-text text-sm">Warm-up</span>
                    </label>
                    <label className="label cursor-pointer gap-1 p-0">
                      <input
                        type="checkbox"
                        checked={isDropsetInput}
                        onChange={(e) => setIsDropsetInput(e.target.checked)}
                        className="checkbox checkbox-sm"
                      />
                      <span className="label-text text-sm">Drop set</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Time-based inputs */}
              {exerciseModality === ExerciseModality.Time && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={durationInput}
                    onChange={(e) => setDurationInput(e.target.value)}
                    placeholder="Duration (mm:ss)"
                    className="input input-bordered"
                  />
                  <input
                    type="number"
                    step="0.1"
                    value={distanceInput}
                    onChange={(e) => setDistanceInput(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Distance (km, optional)"
                    className="input input-bordered"
                  />
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={rpeInput}
                    onChange={(e) => setRpeInput(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="RPE (1-10)"
                    className="input input-bordered"
                  />
                </div>
              )}

              {/* Distance-based inputs */}
              {exerciseModality === ExerciseModality.Distance && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <input
                    type="number"
                    step="0.1"
                    value={distanceInput}
                    onChange={(e) => setDistanceInput(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Distance (km)"
                    className="input input-bordered"
                  />
                  <input
                    type="text"
                    value={durationInput}
                    onChange={(e) => setDurationInput(e.target.value)}
                    placeholder="Time (mm:ss, optional)"
                    className="input input-bordered"
                  />
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={rpeInput}
                    onChange={(e) => setRpeInput(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="RPE (1-10)"
                    className="input input-bordered"
                  />
                </div>
              )}

              {/* Notes input for all modalities */}
              <input
                type="text"
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                placeholder="Notes (optional)"
                className="input input-bordered w-full"
              />
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={addSet} className="btn btn-outline">+ Add Set</button>
              {currentSets.length > 0 && (
                <>
                  <button onClick={copyPreviousSet} className="btn btn-outline btn-primary">Copy Previous</button>
                  {exerciseModality === ExerciseModality.WeightReps && (
                    <>
                      <button onClick={() => incrementWeight(2.5)} className="btn btn-outline btn-sm">+2.5kg</button>
                      <button onClick={() => incrementWeight(5)} className="btn btn-outline btn-sm">+5kg</button>
                    </>
                  )}
                </>
              )}
              
              {/* Rest timer controls */}
              <div className="flex items-center gap-1 ml-auto">
                <label className="text-xs text-base-content/60">Rest:</label>
                <select 
                  value={defaultRestTime} 
                  onChange={(e) => setDefaultRestTime(Number(e.target.value))}
                  className="select select-bordered select-xs"
                >
                  <option value={60}>1:00</option>
                  <option value={90}>1:30</option>
                  <option value={120}>2:00</option>
                  <option value={180}>3:00</option>
                  <option value={300}>5:00</option>
                </select>
                {restTimerSeconds === null && (
                  <button 
                    onClick={() => startRestTimer()} 
                    className="btn btn-outline btn-xs"
                  >
                    Start Timer
                  </button>
                )}
              </div>
            </div>

            {/* Sets table with workout caption */}
            <div className="card bg-base-100 border">
              <div className="card-body p-0">
                <div className="overflow-x-auto">
                  <table className="table table-zebra">
                    <caption className="text-left px-4 py-3 font-semibold">{name || 'Workout'}</caption>
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
                        <th>RPE</th>
                        <th>Notes</th>
                        <th className="w-16 text-right">Done</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentSets.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="text-center text-base-content/60 py-8">No sets yet — add your first set above.</td>
                        </tr>
                      ) : (
                        currentSets.map((s, i) => (
                          <tr key={i} className={`${s.isWarmup ? 'bg-warning/10' : ''} ${s.isDropset ? 'bg-secondary/10' : ''}`}>
                            <td className="text-base-content/60">
                              {i + 1}
                              {s.isWarmup && <span className="ml-1 badge badge-warning badge-xs">W</span>}
                              {s.isDropset && <span className="ml-1 badge badge-secondary badge-xs">D</span>}
                            </td>
                            <td className="text-base-content/40">—</td>
                            {(exerciseModality === ExerciseModality.WeightReps || 
                              exerciseModality === ExerciseModality.Bodyweight || 
                              exerciseModality === ExerciseModality.Assisted) && (
                              <>
                                <td>{s.weight ?? '—'}</td>
                                <td>{s.reps}</td>
                              </>
                            )}
                            {exerciseModality === ExerciseModality.Time && (
                              <>
                                <td>{s.durationMs ? formatDuration(s.durationMs) : '—'}</td>
                                <td>{s.distanceM ? `${s.distanceM}km` : '—'}</td>
                              </>
                            )}
                            {exerciseModality === ExerciseModality.Distance && (
                              <>
                                <td>{s.distanceM ? `${s.distanceM}km` : '—'}</td>
                                <td>{s.durationMs ? formatDuration(s.durationMs) : '—'}</td>
                              </>
                            )}
                            <td>{s.rpe ?? '—'}</td>
                            <td className="text-xs">{s.notes ? s.notes.substring(0, 20) + (s.notes.length > 20 ? '...' : '') : '—'}</td>
                            <td className="text-right">
                              <button
                                onClick={() => toggleSetDone(i)}
                                className={
                                  'btn btn-circle btn-xs ' +
                                  (s.done ? 'btn-success' : 'btn-outline')
                                }
                                aria-label={s.done ? 'Mark as not done' : 'Mark as done'}
                              >
                                ✓
                              </button>
                              <button onClick={() => removeSet(i)} className="btn btn-ghost btn-xs text-error ml-2">remove</button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div>
              <button
                onClick={addExercise}
                disabled={!exerciseName.trim() || currentSets.length === 0}
                className="btn btn-primary"
              >
                Add Exercise
              </button>
            </div>

            {/* Preview of exercises in the current workout */}
            {exercises.length > 0 && (
              <div className="space-y-3 pt-2">
                {exercises.map((ex, i) => (
                  <div key={i} className="card bg-base-100 border">
                    <div className="card-body">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-primary">{ex.name}</span>
                        <span className="badge badge-outline">
                          {ex.modality === ExerciseModality.WeightReps && 'Weight × Reps'}
                          {ex.modality === ExerciseModality.Time && 'Time-based'}
                          {ex.modality === ExerciseModality.Distance && 'Distance-based'}
                          {ex.modality === ExerciseModality.Bodyweight && 'Bodyweight'}
                          {ex.modality === ExerciseModality.Assisted && 'Assisted'}
                        </span>
                      </div>
                      <ul className="text-sm text-base-content/80 mt-2">
                        {ex.sets.map((s, j) => (
                          <li key={j} className="py-1">
                            Set {j + 1}: 
                            {ex.modality === ExerciseModality.WeightReps && ` ${s.reps} reps${s.weight ? ` @ ${s.weight} kg` : ''}`}
                            {ex.modality === ExerciseModality.Time && ` ${s.durationMs ? formatDuration(s.durationMs) : '—'}${s.distanceM ? ` (${s.distanceM}km)` : ''}`}
                            {ex.modality === ExerciseModality.Distance && ` ${s.distanceM ? `${s.distanceM}km` : '—'}${s.durationMs ? ` in ${formatDuration(s.durationMs)}` : ''}`}
                            {(ex.modality === ExerciseModality.Bodyweight || ex.modality === ExerciseModality.Assisted) && ` ${s.reps} reps${s.weight ? ` @ ${s.weight} kg` : ''}`}
                            {s.rpe ? ` (RPE ${s.rpe})` : ''}
                            {s.isWarmup ? ' [Warm-up]' : ''}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>
          </section>
        )}

        {/* Recent workouts */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Recent workouts</h2>
          {workouts.map((w: WorkoutDto) => (
            <div key={w.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <h3 className="card-title">{w.name || 'Workout'}</h3>
                  <span className="text-xs text-base-content/60">{w.date ? new Date(w.date).toLocaleString() : ''}</span>
                </div>
                <ul className="mt-2 list-disc pl-6 text-sm text-base-content/80">
                  {w.exercises?.map((ex: ExerciseDto, i: number) => (
                    <li key={i}>
                      <span className="font-medium">{ex.name}</span> — {ex.sets?.map((s: SetDto) => {
                        const modality = ex.modality || ExerciseModality.WeightReps
                        if (modality === ExerciseModality.Time) {
                          return `${s.durationMs ? formatDuration(s.durationMs) : '—'}${s.distanceM ? ` (${s.distanceM}km)` : ''}`
                        } else if (modality === ExerciseModality.Distance) {
                          return `${s.distanceM ? `${s.distanceM}km` : '—'}${s.durationMs ? ` in ${formatDuration(s.durationMs)}` : ''}`
                        } else {
                          return `${s.reps} reps${s.weight ? ` @ ${s.weight}kg` : ''}`
                        }
                      }).join(', ')}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}

export default App
