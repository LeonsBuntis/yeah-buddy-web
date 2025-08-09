import { useState, useEffect, useRef, type KeyboardEvent } from 'react'

interface InlineEditProps {
  value: number
  onCommit: (value: number) => void
  onCancel?: () => void
  min?: number
  max?: number
  placeholder?: string
  className?: string
  validate?: (value: number) => string | null
}

export function InlineEdit({
  value,
  onCommit,
  onCancel,
  min = 1,
  max = 100,
  placeholder,
  className = '',
  validate
}: InlineEditProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(value.toString())
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleClick = () => {
    setIsEditing(true)
    setInputValue(value.toString())
    setError(null)
  }

  const handleCommit = () => {
    const numValue = parseInt(inputValue, 10)
    
    if (isNaN(numValue) || numValue < min || numValue > max) {
      setError(`Value must be between ${min} and ${max}`)
      return
    }

    if (validate) {
      const validationError = validate(numValue)
      if (validationError) {
        setError(validationError)
        return
      }
    }

    setError(null)
    setIsEditing(false)
    onCommit(numValue)
  }

  const handleCancel = () => {
    setError(null)
    setIsEditing(false)
    setInputValue(value.toString())
    onCancel?.()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault()
        handleCommit()
        break
      case 'Escape':
        e.preventDefault()
        handleCancel()
        break
      case 'Tab':
        // Allow default tab behavior to move to next cell
        handleCommit()
        break
    }
  }

  const handleBlur = () => {
    if (isEditing) {
      handleCommit()
    }
  }

  if (isEditing) {
    return (
      <div className="relative">
        <input
          ref={inputRef}
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={placeholder}
          min={min}
          max={max}
          className={`input input-xs input-bordered w-full min-w-0 ${
            error ? 'input-error' : ''
          } ${className}`}
          style={{ width: 'auto', minWidth: '60px' }}
        />
        {error && (
          <div className="absolute top-full left-0 z-10 mt-1 p-1 text-xs text-error bg-base-100 border border-error rounded shadow-lg whitespace-nowrap">
            {error}
          </div>
        )}
      </div>
    )
  }

  return (
    <button
      onClick={handleClick}
      className={`text-left w-full hover:bg-base-200 focus:bg-base-200 focus:outline-2 focus:outline-primary rounded px-1 py-0.5 transition-colors ${className}`}
      tabIndex={0}
    >
      {value}
    </button>
  )
}