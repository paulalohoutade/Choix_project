import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/lib/api'
import toast from 'react-hot-toast'
import { Music, Lock } from 'lucide-react'
import ForgotPasswordModal from './ForgotPasswordModal'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showForgot, setShowForgot] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authApi.login(email, password)
      localStorage.setItem('cec_token', res.data.token)
      toast.success('Connexion réussie !')
      navigate('/admin/albums')
    } catch {
      toast.error('Email ou mot de passe incorrect.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cec-dark flex items-center justify-center px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px]
                        rounded-full bg-cec-gold/5 -translate-y-1/2" />
      </div>

      <div className="w-full max-w-sm relative">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-cec-blue px-8 py-8 text-center">
            <div className="w-14 h-14 rounded-full bg-cec-gold flex items-center justify-center mx-auto mb-4">
              <Music size={26} className="text-cec-blue" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white">Administration</h1>
            <p className="text-white/60 text-sm mt-1">Chorale Hefzibah</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@chorale-ecc.org"
                  required
                  className="input-field"
                  autoComplete="email"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Mot de passe
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgot(true)}
                    className="text-xs text-cec-blue hover:underline font-medium"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input-field"
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cec-blue text-white font-bold py-3 rounded-lg
                           hover:bg-cec-blue-mid transition-colors disabled:opacity-50
                           flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                  </svg>
                ) : (
                  <Lock size={16} />
                )}
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-5">
              Pas encore de compte ?{' '}
              <a
                href="mailto:admin@chorale-ecc.org?subject=Demande%20d%27accès%20administration"
                className="text-cec-blue hover:underline font-medium"
              >
                Demander un accès
              </a>
            </p>
          </div>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          © {new Date().getFullYear()} Chorale Hefzibah
        </p>
      </div>

      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}
    </div>
  )
}
