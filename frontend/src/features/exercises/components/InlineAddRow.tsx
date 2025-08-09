import { useState, useRef, useEffect } from 'react'
import type { ExerciseModalityType } from '../types'
import { ExerciseModality } from '../types'

interface InlineAddRowProps {
  exerciseModality: ExerciseModalityType
  onAddSet: (setData: {
    reps?: number
    weight?: number
    durationInput?: string
    distanceInput?: number
    notes?: string
    isWarmup?: boolean
    isDropset?: boolean
  }) => void
  onCancel?: () => void
  prefillData?: {
    reps?: number
    weight?: number
    durationInput?: string
    distanceInput?: number
    notes?: string
  }
  showAdvancedOptions?: boolean
  onToggleAdvancedOptions?: () => void
  className?: string
}

export function InlineAddRow({
  exerciseModality,
  onAddSet,
  onCancel,
  prefillData,
  showAdvancedOptions = false,
  onToggleAdvancedOptions,
  className = ''
}: InlineAddRowProps) {
  const [reps, setReps] = useState<number | ''>(prefillData?.reps ?? '')
  const [weight, setWeight] = useState<number | ''>(prefillData?.weight ?? '')
  const [duration, setDuration] = useState<string>(prefillData?.durationInput ?? '')
  const [distance, setDistance] = useState<number | ''>(prefillData?.distanceInput ?? '')
  const [notes, setNotes] = useState<string>(prefillData?.notes ?? '')
  const [isWarmup, setIsWarmup] = useState(false)
  const [isDropset, setIsDropset] = useState(false)

  const firstInputRef = useRef<HTMLInputElement>(null)

  // Auto-focus first input when component mounts
  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus()
    }
  }, [])

  // Update local state when prefill data changes
  useEffect(() => {
    if (prefillData) {
      setReps(prefillData.reps ?? '')
      setWeight(prefillData.weight ?? '')
      setDuration(prefillData.durationInput ?? '')
      setDistance(prefillData.distanceInput ?? '')
      setNotes(prefillData.notes ?? '')
    }
  }, [prefillData])

  const handleSubmit = () => {
    onAddSet({
      reps: typeof reps === 'number' ? reps : parseInt(String(reps)) || undefined,
      weight: typeof weight === 'number' ? weight : parseFloat(String(weight)) || undefined,
      durationInput: duration,
      distanceInput: typeof distance === 'number' ? distance : parseFloat(String(distance)) || undefined,
      notes: notes.trim() || undefined,
      isWarmup,
      isDropset
    })

    // Reset form but keep prefilled values for next entry
    setNotes('')
    setIsWarmup(false)
    setIsDropset(false)
    // Keep reps and weight for easy progressive overload
  }

  const handleCancel = () => {
    setReps('')
    setWeight('')
    setDuration('')
    setDistance('')
    setNotes('')
    setIsWarmup(false)
    setIsDropset(false)
    onCancel?.()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Shift+Enter: Save and keep focus for rapid entry
        e.preventDefault()
        handleSubmit()
        // Focus will stay in the form for next entry
      } else {
        // Enter: Save and potentially lose focus
        e.preventDefault()
        handleSubmit()
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleCancel()
    }
  }

  const getColumnsCount = () => {
    if (exerciseModality === ExerciseModality.WeightReps || 
        exerciseModality === ExerciseModality.Bodyweight || 
        exerciseModality === ExerciseModality.Assisted) {
      return 6 // Set, Previous, kg, Reps, Notes, Done
    }
    if (exerciseModality === ExerciseModality.Time || exerciseModality === ExerciseModality.Distance) {
      return 6 // Set, Previous, Duration/Distance, Time/Distance, Notes, Done
    }
    return 6
  }

  const renderInputFields = () => {
    if (exerciseModality === ExerciseModality.WeightReps || 
        exerciseModality === ExerciseModality.Bodyweight || 
        exerciseModality === ExerciseModality.Assisted) {
      return (
        <>
          <td className="p-1">
            <input
              ref={firstInputRef}
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="kg"
              className="input input-bordered input-sm w-full"
              step="0.5"
              min="0"
              onKeyDown={handleKeyDown}
            />
          </td>
          <td className="p-1">
            <input
              type="number"
              value={reps}
              onChange={(e) => setReps(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="reps"
              className="input input-bordered input-sm w-full"
              min="1"
              onKeyDown={handleKeyDown}
            />
          </td>
        </>
      )
    }

    if (exerciseModality === ExerciseModality.Time) {
      return (
        <>
          <td className="p-1">
            <input
              ref={firstInputRef}
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="mm:ss"
              className="input input-bordered input-sm w-full"
              onKeyDown={handleKeyDown}
            />
          </td>
          <td className="p-1">
            <input
              type="number"
              value={distance}
              onChange={(e) => setDistance(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="km"
              className="input input-bordered input-sm w-full"
              step="0.1"
              min="0"
              onKeyDown={handleKeyDown}
            />
          </td>
        </>
      )
    }

    if (exerciseModality === ExerciseModality.Distance) {
      return (
        <>
          <td className="p-1">
            <input
              ref={firstInputRef}
              type="number"
              value={distance}
              onChange={(e) => setDistance(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="km"
              className="input input-bordered input-sm w-full"
              step="0.1"
              min="0"
              onKeyDown={handleKeyDown}
            />
          </td>
          <td className="p-1">
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="mm:ss"
              className="input input-bordered input-sm w-full"
              onKeyDown={handleKeyDown}
            />
          </td>
        </>
      )
    }

    return null
  }

  return (
    <>
      <tr className={`bg-base-200/50 ${className}`}>
        <td className="p-1">
          <div className="flex items-center gap-1">
            <span className="text-sm text-base-content/60">+</span>
            {(isWarmup || isDropset) && (
              <div className="flex gap-1">
                {isWarmup && <span className="badge badge-warning badge-xs">W</span>}
                {isDropset && <span className="badge badge-secondary badge-xs">D</span>}
              </div>
            )}
          </div>
        </td>
        <td className="text-base-content/40 p-1">—</td>
        {renderInputFields()}
        <td className="p-1">
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="notes"
            className="input input-bordered input-sm w-full"
            onKeyDown={handleKeyDown}
          />
        </td>
        <td className="p-1">
          <div className="flex items-center gap-1">
            <button
              onClick={handleSubmit}
              className="btn btn-primary btn-xs"
              disabled={
                (exerciseModality === ExerciseModality.WeightReps && (!reps || reps <= 0)) ||
                (exerciseModality === ExerciseModality.Time && !duration) ||
                (exerciseModality === ExerciseModality.Distance && (!distance || distance <= 0)) ||
                ((exerciseModality === ExerciseModality.Bodyweight || exerciseModality === ExerciseModality.Assisted) && (!reps || reps <= 0))
              }
            >
              ✓
            </button>
            {onCancel && (
              <button
                onClick={handleCancel}
                className="btn btn-ghost btn-xs text-error"
              >
                ✕
              </button>
            )}
          </div>
        </td>
      </tr>
      
      {/* Advanced options row */}
      {showAdvancedOptions && (
        <tr className="bg-base-200/30">
          <td colSpan={getColumnsCount()} className="p-2">
            <div className="flex flex-wrap gap-2 items-center">
              <label className="label cursor-pointer gap-2 p-0">
                <input
                  type="checkbox"
                  checked={isWarmup}
                  onChange={(e) => setIsWarmup(e.target.checked)}
                  className="checkbox checkbox-xs"
                />
                <span className="label-text text-xs">Warm-up</span>
              </label>
              <label className="label cursor-pointer gap-2 p-0">
                <input
                  type="checkbox"
                  checked={isDropset}
                  onChange={(e) => setIsDropset(e.target.checked)}
                  className="checkbox checkbox-xs"
                />
                <span className="label-text text-xs">Drop set</span>
              </label>
              {onToggleAdvancedOptions && (
                <button
                  onClick={onToggleAdvancedOptions}
                  className="btn btn-ghost btn-xs ml-auto"
                >
                  Hide
                </button>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}