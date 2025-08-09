// Core types extracted from App.tsx

// Toast type for notifications
export type Toast = {
  id: string
  message: string
  type: 'success' | 'info' | 'warning' | 'error'
}