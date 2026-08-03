import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { authApi } from '@/lib/api'
import toast from 'react-hot-toast'
import { Music, KeyRound, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const token = params.get('token') ?? ''
  const email = params.get('email') ?? ''

  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const linkInvalid = !token || !email

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== passwordConfirmation) {
      toast.error('Les mots de passe ne correspondent pas.')
      return
    }
    if (password.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }
    setLoading(true)
    try {
      await authApi.resetPassword({
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      })
      setDone(true)
      toast.success('Mot de passe réinitialisé !')
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? 'Ce lien est invalide ou a expiré.'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cec-dark flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px]
                        rounded-full bg-cec-gold/5 -translate-y-1/2" />
      </div>

      <div className="w-full max-w-sm relative">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-cec-blue px-8 py-8 text-center">
            <div className="w-14 h-14 rounded-full bg-cec-gold flex items-center justify-center mx-auto mb-4">
              <Music size={26} className="text-cec-blue" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white">Nouveau mot de passe</h1>
            <p className="text-white/60 text-sm mt-1">Chorale CEC</p>
          </div>

          <div className="px-8 py-8">
            {linkInvalid ? (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-5">
                  Ce lien de réinitialisation est incomplet ou invalide.
                </p>
                <Link to="/admin/login" className="text-cec-blue text-sm font-semibold hover:underline">
                  ← Retour à la connexion
                </Link>
              </div>
            ) : done ? (
              <div className="text-center">
                <CheckCircle2 size={40} className="text-green-500 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-5">
                  Votre mot de passe a été réinitialisé avec succès.
                </p>
                <Button variant="primary" className="w-full" onClick={() => navigate('/admin/login')}>
                  Se connecter
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                    Compte
                  </label>
                  <input value={email} disabled className="input-field bg-stone-50 text-gray-500" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={8}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                    Confirmer le mot de passe
                  </label>
                  <input
                    type="password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={8}
                    className="input-field"
                  />
                </div>

                <Button type="submit" variant="primary" loading={loading} className="w-full mt-2">
                  <KeyRound size={16} />
                  {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
                </Button>
              </form>
            )}
          </div>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          © {new Date().getFullYear()} Chorale CEC
        </p>
      </div>
    </div>
  )
}
