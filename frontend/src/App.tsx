import { useEffect, useState } from 'react'

type SetDto = { reps: number; weight?: number; rpe?: number; done?: boolean }
type ExerciseDto = { name: string; sets: SetDto[] }
type WorkoutDto = { id?: string; date?: string; name?: string; exercises: ExerciseDto[] }

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
  const [currentSets, setCurrentSets] = useState<SetDto[]>([])
  const [repsInput, setRepsInput] = useState<number | ''>('' as number | '')
  const [weightInput, setWeightInput] = useState<number | ''>('' as number | '')

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
    setCurrentSets([])
    setRepsInput('')
    setWeightInput('')
  }

  const cancelWorkout = () => {
    setIsStarted(false)
    setExercises([])
    setExerciseName('')
    setCurrentSets([])
    setRepsInput('')
    setWeightInput('')
    setName('')
  }

  const addSet = () => {
    const reps = typeof repsInput === 'string' ? parseInt(repsInput || '0', 10) : repsInput
    const weight = typeof weightInput === 'string' ? parseFloat(weightInput || '0') : weightInput
    if (!reps || reps <= 0) return
    const set: SetDto = { reps, weight: weight || undefined }
    setCurrentSets((prev) => [...prev, set])
    setRepsInput('')
    setWeightInput('')
  }

  const removeSet = (idx: number) => {
    setCurrentSets((prev) => prev.filter((_, i) => i !== idx))
  }

  const addExercise = () => {
    if (!exerciseName.trim() || currentSets.length === 0) return
    const ex: ExerciseDto = { name: exerciseName.trim(), sets: currentSets }
    setExercises((prev) => [...prev, ex])
    setExerciseName('')
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

            {/* Composer inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                placeholder="Exercise (e.g., Deadlift)"
                className="border rounded px-3 py-2"
              />
              <input
                type="number"
                value={repsInput}
                onChange={(e) => setRepsInput(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Reps"
                className="border rounded px-3 py-2"
              />
              <input
                type="number"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Weight (kg)"
                className="border rounded px-3 py-2"
              />
            </div>
            <div>
              <button onClick={addSet} className="rounded border px-3 py-1.5 text-sm hover:bg-gray-50">+ Add Set</button>
            </div>

            {/* Sets table with workout caption */}
            <div className="overflow-hidden rounded border">
              <table className="w-full text-sm">
                <caption className="text-left px-3 py-2 font-semibold text-gray-700">{name || 'Workout'}</caption>
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-3 py-2 w-16">Set</th>
                    <th className="text-left px-3 py-2">Previous</th>
                    <th className="text-left px-3 py-2">kg</th>
                    <th className="text-left px-3 py-2">Reps</th>
                    <th className="px-3 py-2 w-16 text-right">Done</th>
                  </tr>
                </thead>
                <tbody>
                  {currentSets.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-3 py-4 text-center text-gray-500">No sets yet — add your first set above.</td>
                    </tr>
                  ) : (
                    currentSets.map((s, i) => (
                      <tr key={i} className="border-t">
                        <td className="px-3 py-2 text-gray-500">{i + 1}</td>
                        <td className="px-3 py-2 text-gray-400">—</td>
                        <td className="px-3 py-2">{s.weight ?? '—'}</td>
                        <td className="px-3 py-2">{s.reps}</td>
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
                    <div className="px-4 py-3 border-b font-medium text-blue-700">{ex.name}</div>
                    <ul className="px-4 py-2 text-sm text-gray-700">
                      {ex.sets.map((s, j) => (
                        <li key={j} className="py-1">Set {j + 1}: {s.reps} reps{s.weight ? ` @ ${s.weight} kg` : ''}</li>
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
                    <span className="font-medium">{ex.name}</span> — {ex.sets?.map((s: SetDto) => `${s.reps} reps${s.weight ? ` @ ${s.weight}kg` : ''}`).join(', ')}
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
