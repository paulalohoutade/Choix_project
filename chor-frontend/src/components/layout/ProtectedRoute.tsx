import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useMe } from '@/hooks'

interface Props {
  children: ReactNode
}

export default function ProtectedRoute({ children }: Props) {
  const token = localStorage.getItem('cec_token')
  const { isLoading, isError } = useMe()

  if (!token) return <Navigate to="/admin/login" replace />
  if (isError) {
    localStorage.removeItem('cec_token')
    return <Navigate to="/admin/login" replace />
  }
  if (isLoading) return null
  return <>{children}</>
}