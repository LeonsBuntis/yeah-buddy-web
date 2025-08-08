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

  useEffect(() => {
    fetch(`${apiBase}/workouts`)
      .then((r) => r.json())
      .then((data: WorkoutDto[]) => setWorkouts(data))
      .catch(() => {})
  }, [])

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
    setName('')
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
      notes: notesInput.trim() || undefined
    }
    
    setCurrentSets((prev) => [...prev, set])
    
    // Clear inputs but keep modality and exercise name
    setRepsInput('')
    setWeightInput('')
    setDurationInput('')
    setDistanceInput('')
    setRpeInput('')
    setNotesInput('')
    setIsWarmupInput(false)
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
  }

  const incrementWeight = (amount: number) => {
    const currentWeight = typeof weightInput === 'string' ? parseFloat(weightInput || '0') : weightInput
    setWeightInput((currentWeight || 0) + amount)
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white/80 backdrop-blur sticky top-0 z-10 border-b">
        <div className="mx-auto max-w-3xl px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Yeabuddy</h1>
            <p className="text-xs text-gray-500">Gym workout tracker</p>
          </div>
          <div className="flex items-center gap-2">
            {isStarted ? (
              <>
                <button onClick={finishWorkout} className="rounded bg-emerald-600 text-white px-3 py-1.5 text-sm font-medium hover:bg-emerald-500">Finish</button>
                <button onClick={cancelWorkout} className="rounded bg-red-50 text-red-600 px-3 py-1.5 text-sm font-medium hover:bg-red-100">Cancel</button>
              </>
            ) : null}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6 space-y-6">
        {/* Start panel */}
        {!isStarted && (
          <section className="bg-white rounded-lg shadow p-4">
            <h2 className="font-semibold mb-2">Start a workout</h2>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Workout name (optional)" className="border rounded px-3 py-2 w-full" />
              <button onClick={startWorkout} className="rounded bg-indigo-600 text-white px-4 py-2 font-medium hover:bg-indigo-500 w-full sm:w-auto">Start Workout</button>
            </div>
            <p className="text-xs text-gray-500 mt-2">You can add exercises after starting.</p>
          </section>
        )}

        {/* Build workout panel */}
        {isStarted && (
          <section className="bg-white rounded-lg shadow p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">{name || 'Workout in progress'}</h2>
                <p className="text-xs text-gray-500">Add sets, then add the exercise to this workout.</p>
              </div>
              {/* could place timer / icons here later */}
            </div>

            {/* Exercise header like screenshot (blue title) */}
            <div className="flex items-center justify-between">
              <div className="text-blue-700 font-medium">{exerciseName || 'Exercise name'}</div>
              {/* placeholder for actions/icons */}
            </div>

            {/* Optional tip strip (placeholder, hidden when no tip) */}
            {/* <div className="bg-yellow-50 text-yellow-900 text-sm rounded px-3 py-2 flex items-center gap-2">
              <span>Watch back rounding</span>
            </div> */}

            {/* Exercise name and modality selector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                placeholder="Exercise (e.g., Deadlift)"
                className="border rounded px-3 py-2"
              />
              <select
                value={exerciseModality}
                onChange={(e) => setExerciseModality(Number(e.target.value) as ExerciseModalityType)}
                className="border rounded px-3 py-2"
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
                    className="border rounded px-3 py-2"
                  />
                  <input
                    type="number"
                    step="0.5"
                    value={weightInput}
                    onChange={(e) => setWeightInput(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Weight (kg)"
                    className="border rounded px-3 py-2"
                  />
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={rpeInput}
                    onChange={(e) => setRpeInput(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="RPE (1-10)"
                    className="border rounded px-3 py-2"
                  />
                  <div className="flex items-center">
                    <label className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={isWarmupInput}
                        onChange={(e) => setIsWarmupInput(e.target.checked)}
                        className="rounded"
                      />
                      <span>Warm-up</span>
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
                    className="border rounded px-3 py-2"
                  />
                  <input
                    type="number"
                    step="0.1"
                    value={distanceInput}
                    onChange={(e) => setDistanceInput(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Distance (km, optional)"
                    className="border rounded px-3 py-2"
                  />
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={rpeInput}
                    onChange={(e) => setRpeInput(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="RPE (1-10)"
                    className="border rounded px-3 py-2"
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
                    className="border rounded px-3 py-2"
                  />
                  <input
                    type="text"
                    value={durationInput}
                    onChange={(e) => setDurationInput(e.target.value)}
                    placeholder="Time (mm:ss, optional)"
                    className="border rounded px-3 py-2"
                  />
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={rpeInput}
                    onChange={(e) => setRpeInput(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="RPE (1-10)"
                    className="border rounded px-3 py-2"
                  />
                </div>
              )}

              {/* Notes input for all modalities */}
              <input
                type="text"
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                placeholder="Notes (optional)"
                className="border rounded px-3 py-2 w-full"
              />
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={addSet} className="rounded border px-3 py-1.5 text-sm hover:bg-gray-50">+ Add Set</button>
              {currentSets.length > 0 && (
                <>
                  <button onClick={copyPreviousSet} className="rounded border px-3 py-1.5 text-sm hover:bg-gray-50 text-blue-600">Copy Previous</button>
                  {exerciseModality === ExerciseModality.WeightReps && (
                    <>
                      <button onClick={() => incrementWeight(2.5)} className="rounded border px-3 py-1.5 text-sm hover:bg-gray-50">+2.5kg</button>
                      <button onClick={() => incrementWeight(5)} className="rounded border px-3 py-1.5 text-sm hover:bg-gray-50">+5kg</button>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Sets table with workout caption */}
            <div className="overflow-hidden rounded border">
              <table className="w-full text-sm">
                <caption className="text-left px-3 py-2 font-semibold text-gray-700">{name || 'Workout'}</caption>
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-3 py-2 w-16">Set</th>
                    <th className="text-left px-3 py-2">Previous</th>
                    {(exerciseModality === ExerciseModality.WeightReps || 
                      exerciseModality === ExerciseModality.Bodyweight || 
                      exerciseModality === ExerciseModality.Assisted) && (
                      <>
                        <th className="text-left px-3 py-2">kg</th>
                        <th className="text-left px-3 py-2">Reps</th>
                      </>
                    )}
                    {exerciseModality === ExerciseModality.Time && (
                      <>
                        <th className="text-left px-3 py-2">Duration</th>
                        <th className="text-left px-3 py-2">Distance</th>
                      </>
                    )}
                    {exerciseModality === ExerciseModality.Distance && (
                      <>
                        <th className="text-left px-3 py-2">Distance</th>
                        <th className="text-left px-3 py-2">Time</th>
                      </>
                    )}
                    <th className="text-left px-3 py-2">RPE</th>
                    <th className="text-left px-3 py-2">Notes</th>
                    <th className="px-3 py-2 w-16 text-right">Done</th>
                  </tr>
                </thead>
                <tbody>
                  {currentSets.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-3 py-4 text-center text-gray-500">No sets yet — add your first set above.</td>
                    </tr>
                  ) : (
                    currentSets.map((s, i) => (
                      <tr key={i} className={`border-t ${s.isWarmup ? 'bg-orange-50' : ''}`}>
                        <td className="px-3 py-2 text-gray-500">
                          {i + 1}
                          {s.isWarmup && <span className="ml-1 text-orange-600 text-xs">W</span>}
                        </td>
                        <td className="px-3 py-2 text-gray-400">—</td>
                        {(exerciseModality === ExerciseModality.WeightReps || 
                          exerciseModality === ExerciseModality.Bodyweight || 
                          exerciseModality === ExerciseModality.Assisted) && (
                          <>
                            <td className="px-3 py-2">{s.weight ?? '—'}</td>
                            <td className="px-3 py-2">{s.reps}</td>
                          </>
                        )}
                        {exerciseModality === ExerciseModality.Time && (
                          <>
                            <td className="px-3 py-2">{s.durationMs ? formatDuration(s.durationMs) : '—'}</td>
                            <td className="px-3 py-2">{s.distanceM ? `${s.distanceM}km` : '—'}</td>
                          </>
                        )}
                        {exerciseModality === ExerciseModality.Distance && (
                          <>
                            <td className="px-3 py-2">{s.distanceM ? `${s.distanceM}km` : '—'}</td>
                            <td className="px-3 py-2">{s.durationMs ? formatDuration(s.durationMs) : '—'}</td>
                          </>
                        )}
                        <td className="px-3 py-2">{s.rpe ?? '—'}</td>
                        <td className="px-3 py-2 text-xs text-gray-600">{s.notes ? s.notes.substring(0, 20) + (s.notes.length > 20 ? '...' : '') : '—'}</td>
                        <td className="px-3 py-2 text-right">
                          <button
                            onClick={() => toggleSetDone(i)}
                            className={
                              'inline-flex h-6 w-6 items-center justify-center rounded-full border ' +
                              (s.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white text-gray-400 hover:bg-gray-50')
                            }
                            aria-label={s.done ? 'Mark as not done' : 'Mark as done'}
                          >
                            ✓
                          </button>
                          <button onClick={() => removeSet(i)} className="ml-2 text-red-600 hover:underline text-xs">remove</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div>
              <button
                onClick={addExercise}
                disabled={!exerciseName.trim() || currentSets.length === 0}
                className="rounded bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 font-medium hover:bg-blue-500"
              >
                Add Exercise
              </button>
            </div>

            {/* Preview of exercises in the current workout */}
            {exercises.length > 0 && (
              <div className="space-y-3 pt-2">
                {exercises.map((ex, i) => (
                  <div key={i} className="bg-white rounded border">
                    <div className="px-4 py-3 border-b">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-blue-700">{ex.name}</span>
                        <span className="text-xs text-gray-500">
                          {ex.modality === ExerciseModality.WeightReps && 'Weight × Reps'}
                          {ex.modality === ExerciseModality.Time && 'Time-based'}
                          {ex.modality === ExerciseModality.Distance && 'Distance-based'}
                          {ex.modality === ExerciseModality.Bodyweight && 'Bodyweight'}
                          {ex.modality === ExerciseModality.Assisted && 'Assisted'}
                        </span>
                      </div>
                    </div>
                    <ul className="px-4 py-2 text-sm text-gray-700">
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
                ))}
              </div>
            )}
          </section>
        )}

        {/* Recent workouts */}
        <section className="space-y-3">
          <h2 className="font-semibold">Recent workouts</h2>
          {workouts.map((w: WorkoutDto) => (
            <div key={w.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{w.name || 'Workout'}</h3>
                <span className="text-xs text-gray-500">{w.date ? new Date(w.date).toLocaleString() : ''}</span>
              </div>
              <ul className="mt-2 list-disc pl-6 text-sm text-gray-700">
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
          ))}
        </section>
      </main>
    </div>
  )
}

export default App
