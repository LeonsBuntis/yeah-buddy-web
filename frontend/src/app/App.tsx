import '../styles/App.css'
import { useWorkouts, useWorkoutSession } from '../features/workouts/hooks'
import { useToasts } from '../shared/hooks'
import { ToastContainer } from '../shared/components'
import { WorkoutList, WorkoutStartPanel, WorkoutSession } from '../features/workouts/components'

function App() {
  const { workouts, loading, createWorkout } = useWorkouts()
  const { toasts, addToast, removeToast } = useToasts()
  const { 
    isStarted, 
    name, 
    setName, 
    exercises, 
    startWorkout, 
    cancelWorkout, 
    addExercise 
  } = useWorkoutSession()

  const handleFinishWorkout = async () => {
    if (exercises.length === 0) return
    
    try {
      const payload = { 
        name: name.trim() || undefined, 
        exercises 
      }
      await createWorkout(payload)
      addToast('Workout saved successfully!', 'success')
      cancelWorkout()
    } catch {
      addToast('Failed to save workout', 'error')
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
                <button onClick={handleFinishWorkout} className="btn btn-success btn-sm">
                  Finish
                </button>
                <button onClick={cancelWorkout} className="btn btn-error btn-sm">
                  Cancel
                </button>
              </>
            ) : null}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6 space-y-6">
        {/* Start panel or workout session */}
        {!isStarted ? (
          <WorkoutStartPanel 
            name={name}
            onNameChange={setName}
            onStartWorkout={startWorkout}
          />
        ) : (
          <WorkoutSession
            name={name}
            exercises={exercises}
            onAddExercise={addExercise}
            onFinishWorkout={handleFinishWorkout}
            onCancelWorkout={cancelWorkout}
          />
        )}

        {/* Recent workouts list */}
        <WorkoutList workouts={workouts} loading={loading} />
      </main>

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </div>
  )
}

export default App