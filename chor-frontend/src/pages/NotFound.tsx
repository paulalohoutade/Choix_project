import { Link, useLocation } from 'react-router-dom'

export default function NotFound() {
  const location = useLocation()
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-20">
      <p className="font-display text-7xl font-bold text-cec-gold">404</p>
      <h1 className="font-display text-2xl font-bold text-cec-blue mt-4">Page introuvable</h1>
      <p className="text-gray-500 mt-3 max-w-md">
        La page{' '}
        <span className="font-mono text-sm text-gray-600 break-all">{location.pathname}</span>{' '}
        n'existe pas ou a été déplacée.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 bg-cec-blue text-white font-semibold px-6 py-3 rounded-lg hover:bg-cec-blue-mid transition-colors"
      >
        Retour à l'accueil
      </Link>
    </div>
  )
}
