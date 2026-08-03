import { useState } from 'react'
import { X, Mail, CheckCircle2 } from 'lucide-react'
import { authApi } from '@/lib/api'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui'

interface Props {
  onClose: () => void
}

export default function ForgotPasswordModal({ onClose }: Props) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authApi.forgotPassword(email)
      setSent(true)
    } catch {
      // Pour des raisons de sécurité, on affiche le même message
      // même en cas d'erreur (l'API renvoie toujours un succès générique).
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-display font-bold text-cec-blue">Mot de passe oublié</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle2 size={40} className="text-green-500 mx-auto mb-3" />
              <p className="text-sm text-gray-600 leading-relaxed">
                Si un compte existe avec l'adresse <strong>{email}</strong>, un email contenant
                un lien de réinitialisation vient de vous être envoyé.
              </p>
              <Button variant="outline" onClick={onClose} className="w-full mt-5">
                Fermer
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-gray-500">
                Saisissez votre email administrateur. Vous recevrez un lien pour
                réinitialiser votre mot de passe.
              </p>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@chorale-cec.org"
                  required
                  className="input-field"
                  autoFocus
                />
              </div>
              <Button type="submit" variant="primary" loading={loading} className="w-full">
                <Mail size={16} />
                Envoyer le lien
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
