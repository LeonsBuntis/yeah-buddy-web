interface WorkoutStartPanelProps {
  name: string
  onNameChange: (name: string) => void
  onStartWorkout: () => void
}

export function WorkoutStartPanel({ name, onNameChange, onStartWorkout }: WorkoutStartPanelProps) {
  return (
    <section className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Start a workout</h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input 
            value={name} 
            onChange={(e) => onNameChange(e.target.value)} 
            placeholder="Workout name (optional)" 
            className="input input-bordered w-full" 
          />
          <button onClick={onStartWorkout} className="btn btn-primary w-full sm:w-auto">
            Start Workout
          </button>
        </div>
        <p className="text-xs text-base-content/60 mt-2">You can add exercises after starting.</p>
      </div>
    </section>
  )
}