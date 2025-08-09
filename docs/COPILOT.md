# GitHub Copilot Development Guide

This document outlines the coding standards, architecture patterns, and best practices that GitHub Copilot and contributors should follow when working on this React + TypeScript project.

## Project Architecture

This project follows a **feature-based architecture** that promotes maintainability, scalability, and code discoverability.

### Directory Structure

```
src/
├── app/                    # Application shell and entry points
│   ├── index.tsx          # Main entry point (renders App)
│   ├── App.tsx            # Root application component
│   ├── routes/            # Route configuration and guards
│   └── providers/         # Global providers (theme, state, etc.)
├── features/              # Feature-based modules
│   ├── workouts/          # Workout tracking feature
│   │   ├── components/    # UI components for workouts
│   │   ├── hooks/         # Custom hooks for workout logic
│   │   ├── types/         # TypeScript types for workouts
│   │   ├── api/           # API calls related to workouts
│   │   └── index.ts       # Public exports from feature
│   ├── exercises/         # Exercise management feature
│   │   ├── components/    # UI components for exercises
│   │   ├── hooks/         # Custom hooks for exercise logic
│   │   ├── types/         # TypeScript types for exercises
│   │   └── index.ts       # Public exports from feature
│   └── common/            # Shared feature utilities
├── shared/                # Shared/reusable code
│   ├── components/        # Generic UI components
│   ├── hooks/             # Generic custom hooks
│   ├── types/             # Shared TypeScript types
│   ├── utils/             # Utility functions
│   └── api/               # Base API configuration
└── styles/                # Global CSS files
```

## Coding Standards

### 1. TypeScript Usage

- **Always use TypeScript**: All files should be `.ts` or `.tsx`
- **Explicit types**: Prefer explicit type annotations over `any`
- **Interface over type**: Use `interface` for object shapes, `type` for unions/primitives
- **Import types**: Use `import type` for type-only imports when possible

```typescript
// ✅ Good
interface UserProps {
  id: string
  name: string
  onUpdate: (user: User) => void
}

// ❌ Avoid
const UserComponent = (props: any) => { ... }
```

### 2. Component Organization

#### Feature Components
- Place components in their respective feature directories
- Components should be focused on a single responsibility
- Export components through feature index files

```typescript
// features/workouts/components/WorkoutCard.tsx
export function WorkoutCard({ workout }: WorkoutCardProps) {
  // Component implementation
}

// features/workouts/index.ts
export { WorkoutCard } from './components/WorkoutCard'
```

#### Shared Components
- Place reusable components in `shared/components/`
- Should be generic and not tied to specific features
- Include proper TypeScript interfaces

### 3. Custom Hooks

#### Feature Hooks
- Encapsulate feature-specific logic in custom hooks
- Prefix with `use` (React convention)
- Return object with named properties, not arrays

```typescript
// ✅ Good
export function useWorkouts() {
  return {
    workouts,
    loading,
    error,
    createWorkout,
    deleteWorkout
  }
}

// ❌ Avoid
export function useWorkouts() {
  return [workouts, createWorkout, deleteWorkout] // Hard to remember order
}
```

#### State Management
- Use built-in React hooks for local state
- Create custom hooks for complex state logic
- Consider context for widely-shared state

### 4. API Integration

- Centralize API configuration in `shared/api/config.ts`
- Create feature-specific API modules in `features/*/api/`
- Use async/await syntax
- Handle errors appropriately

```typescript
// features/workouts/api/index.ts
export const workoutApi = {
  async getWorkouts(): Promise<WorkoutDto[]> {
    const response = await fetch(`${apiBase}/workouts`)
    if (!response.ok) throw new Error('Failed to fetch workouts')
    return response.json()
  }
}
```

### 5. Error Handling

- Use try/catch blocks for async operations
- Provide meaningful error messages to users
- Log errors for debugging when appropriate

```typescript
try {
  await createWorkout(payload)
  addToast('Workout saved successfully!', 'success')
} catch {
  addToast('Failed to save workout', 'error')
}
```

## File Naming Conventions

- **Components**: PascalCase (`WorkoutCard.tsx`)
- **Hooks**: camelCase starting with `use` (`useWorkouts.ts`)
- **Types**: PascalCase (`WorkoutDto`, `ExerciseModality`)
- **Utils**: camelCase (`formatDuration.ts`)
- **Index files**: Always named `index.ts`

## Import/Export Patterns

### Exports
- Use named exports for components and utilities
- Use default exports sparingly (mainly for main App component)
- Create index files to provide clean public APIs

```typescript
// ✅ Good - Named exports
export { WorkoutCard } from './WorkoutCard'
export { useWorkouts } from './useWorkouts'

// ✅ Good - Index file re-exports
export { WorkoutCard, WorkoutList } from './components'
export { useWorkouts, useRestTimer } from './hooks'
```

### Imports
- Import from feature index files when possible
- Group imports: React, external libraries, internal modules
- Use relative imports within features, absolute for cross-feature

```typescript
// ✅ Good import grouping
import { useState } from 'react'
import { useWorkouts } from '../hooks'
import { WorkoutCard } from '../../workouts/components'
import { formatDuration } from '../../../shared/utils'
```

## Component Guidelines

### Props Interface
- Always define explicit props interfaces
- Use optional properties when appropriate
- Include JSDoc comments for complex props

```typescript
interface WorkoutCardProps {
  /** The workout data to display */
  workout: WorkoutDto
  /** Callback when user clicks edit */
  onEdit?: (workout: WorkoutDto) => void
  /** Whether the card should show in compact mode */
  compact?: boolean
}
```

### Event Handlers
- Prefix event handler props with `on` (e.g., `onEdit`, `onDelete`)
- Keep event handlers focused and delegate to custom hooks
- Use meaningful names that describe the action

### Conditional Rendering
- Use logical AND (`&&`) for simple conditionals
- Use ternary operator for either/or scenarios
- Extract complex conditionals to variables or functions

```typescript
// ✅ Good
const showEmptyState = workouts.length === 0 && !loading

return (
  <div>
    {loading && <LoadingSpinner />}
    {showEmptyState && <EmptyWorkoutsMessage />}
    {workouts.map(workout => <WorkoutCard key={workout.id} workout={workout} />)}
  </div>
)
```

## Styling Guidelines

- Use Tailwind CSS classes for styling
- Follow DaisyUI component patterns when available
- Create CSS custom properties in `styles/design-tokens.css` for design system values
- Use responsive design principles (`sm:`, `md:`, `lg:` prefixes)

## Testing Considerations

- Components should be testable in isolation
- Custom hooks should have pure, predictable outputs
- Mock API calls in tests
- Test user interactions, not implementation details

## Performance Best Practices

- Use `React.memo()` for expensive components
- Optimize re-renders with `useCallback` and `useMemo` when necessary
- Keep component trees shallow
- Lazy load heavy components when appropriate

## Accessibility (a11y)

- Include `aria-label` attributes for interactive elements
- Use semantic HTML elements
- Ensure keyboard navigation works
- Test with screen readers when possible

## Git Commit Guidelines

- Use conventional commit format: `type(scope): description`
- Keep commits focused and atomic
- Reference issue numbers when applicable

Examples:
- `feat(workouts): add workout creation form`
- `fix(exercises): resolve set validation issue`
- `refactor(shared): extract common utility functions`

## When Adding New Features

1. **Identify the feature domain** - Does it belong in an existing feature or need a new one?
2. **Create the feature structure** - Add necessary directories (components, hooks, types, api)
3. **Define types first** - Create TypeScript interfaces before implementation
4. **Build components bottom-up** - Start with smaller components, compose into larger ones
5. **Create custom hooks** - Extract stateful logic from components
6. **Add to index files** - Ensure proper exports for clean imports
7. **Update this guide** - Document any new patterns or conventions

## Common Patterns to Follow

### Loading States
```typescript
const { data, loading, error } = useAsyncData()

if (loading) return <LoadingSpinner />
if (error) return <ErrorMessage message={error.message} />
return <DataDisplay data={data} />
```

### Form Handling
```typescript
const { values, errors, handleChange, handleSubmit } = useForm({
  initialValues: { name: '', email: '' },
  onSubmit: async (values) => {
    // Handle form submission
  }
})
```

### State Updates
```typescript
// ✅ Good - Functional updates
setItems(prev => [...prev, newItem])
setUser(prev => ({ ...prev, name: newName }))

// ❌ Avoid - Direct mutations
items.push(newItem) // Mutates state directly
user.name = newName // Mutates state directly
```

This guide should be updated as the project evolves and new patterns emerge.