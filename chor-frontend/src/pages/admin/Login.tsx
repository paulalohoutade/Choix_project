import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/lib/api'
import toast from 'react-hot-toast'
import { Music, Lock, ChevronRight, Eye, EyeOff } from 'lucide-react'
import ForgotPasswordModal from './ForgotPasswordModal'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showForgot, setShowForgot] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [photoFailed, setPhotoFailed] = useState(false)
  const [loginError, setLoginError] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError(false)
    setLoading(true)
    try {
      const res = await authApi.login(email, password)
      localStorage.setItem('cec_token', res.data.token)
      toast.success('Connexion réussie !')
      navigate('/admin/albums')
    } catch {
      setLoginError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px]
                        rounded-full bg-cec-gold/10 -translate-y-1/2" />
      </div>

      {/* Carte centrée */}
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 lg:flex">
        {/* ── Panneau photo ──────────────────────────────────────────────── */}
        <div className="relative w-full h-48 sm:h-56 lg:h-auto lg:w-1/2 xl:w-[55%] lg:border-r lg:border-gray-200 flex-shrink-0">
          {/* Dégradé de fond (visible si la photo n'est pas chargée) */}
          <div className="absolute inset-0 bg-gradient-to-br from-cec-blue via-cec-blue-mid to-cec-dark" />

          {/* Photo */}
          {!photoFailed && (
            <img
              src="/login-photo.jpg"
              alt="Chorale Hefzibah"
              className="absolute inset-0 w-full h-full object-cover"
              onError={() => setPhotoFailed(true)}
            />
          )}
          {/* Voile sombre pour la lisibilité */}
          <div className="absolute inset-0 bg-gradient-to-t from-cec-dark/70 via-cec-dark/20 to-cec-blue/20" />

          {/* Contenu du panneau */}
          <div className="relative z-10 w-full h-full flex flex-col justify-between p-6 xl:p-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 ring-1 ring-white/20">
                <img
                  src="/logo.png"
                  alt="Logo Chorale Hefzibah"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const t = e.currentTarget
                    t.style.display = 'none'
                    const fallback = t.nextElementSibling as HTMLElement
                    if (fallback) fallback.style.display = 'flex'
                  }}
                />
                <div className="w-full h-full bg-cec-gold items-center justify-center hidden">
                  <Music size={20} className="text-cec-blue" />
                </div>
              </div>
              <div className="leading-tight">
                <p className="font-display text-white font-bold text-base">Chorale Hefzibah</p>
                <p className="text-cec-gold-light text-[9px] tracking-widest uppercase">Espace administration</p>
              </div>
            </div>

            <div className="max-w-md">
              <p className="text-xl xl:text-2xl font-display font-bold text-white leading-tight">
                Louez l'Éternel, car{' '}
                <span className="text-cec-gold">Il est bon.</span>
              </p>
            </div>
          </div>
        </div>

        {/* ── Panneau formulaire ──────────────────────────────────────── */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-8 py-6">
          <div className="w-full max-w-sm">
            <div className="text-center mb-6">
              <h1 className="font-display text-2xl font-bold text-cec-blue">Se connecter</h1>
              <p className="text-gray-400 text-sm mt-1">Connectez-vous pour continuer</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {loginError && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-lg px-4 py-3">
                  Les données fournies sont invalides
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setLoginError(false)
                  }}
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
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setLoginError(false)
                    }}
                    placeholder="••••••••"
                    required
                    className="input-field pr-10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
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

            <p className="text-center text-xs text-gray-400 mt-4">
              Pas encore de compte ?{' '}
              <a
                href="mailto:admin@chorale-ecc.org?subject=Demande%20d%27accès%20administration"
                className="inline-flex items-center gap-0.5 text-cec-blue hover:underline font-medium"
              >
                Demander un accès <ChevronRight size={12} />
              </a>
            </p>

            <p className="text-center text-gray-300 text-xs mt-5">
              © {new Date().getFullYear()} Chorale Hefzibah
            </p>
          </div>
        </div>
      </div>

      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}
    </div>
  )
}
