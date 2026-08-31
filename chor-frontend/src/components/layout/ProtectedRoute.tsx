import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useMe } from '@/hooks'

interface Props {
  children: ReactNode
}

export default function ProtectedRoute({ children }: Props) {
  const token = localStorage.getItem('cec_token')
  const { isLoading, isError } = useMe()

  // Détecter l'expiration du token dès le retour (navigateur fermé puis rouvert)
  const expiry = localStorage.getItem('cec_token_expiry')
  const expired = !!token && !!expiry && Date.now() > Number(expiry)

  if (!token || expired) {
    localStorage.removeItem('cec_token')
    localStorage.removeItem('cec_token_expiry')
    return <Navigate to="/admin/login" replace />
  }
  if (isError) {
    localStorage.removeItem('cec_token')
    localStorage.removeItem('cec_token_expiry')
    return <Navigate to="/admin/login" replace />
  }
  if (isLoading) return null
  return <>{children}</>
}