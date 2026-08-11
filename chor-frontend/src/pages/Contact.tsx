import { useState } from 'react'
import { contactApi } from '@/lib/api'
import toast from 'react-hot-toast'
import { PageHero, Button } from '@/components/ui'
import { Mail, Phone, MapPin, Send } from 'lucide-react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await contactApi.send(form)
      toast.success('Message envoyé ! Nous vous répondrons bientôt.')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      toast.error("Erreur lors de l'envoi. Réessayez.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHero title="Nous Contacter" subtitle="Une question ? Écrivez-nous" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row md:items-start md:justify-between gap-12 md:gap-16 lg:gap-24">
        {/* Info */}
        <div className="md:w-[36%] space-y-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-cec-blue mb-4">Informations</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Pour toute demande de renseignement, partenariat ou invitation, n'hésitez pas à nous contacter.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: Mail, label: 'Email', value: 'contact@chorale-ecc.org' },
              { icon: Phone, label: 'Téléphone', value: '+229 00 00 00 00' },
              { icon: MapPin, label: 'Adresse', value: 'ECC Béulah, Kouti Kpinlè — Avrankou, Bénin' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-cec-blue/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-cec-blue" />
                </div>
                <div>
                  <p className="text-xs text-black uppercase tracking-widest font-bold">{label}</p>
                  <p className="text-cec-blue font-medium text-sm">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="md:w-[54%]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-black mb-1.5 uppercase tracking-wide">
                  Nom complet *
                </label>
                <input
                  name="name" value={form.name} onChange={handleChange} required
                  placeholder="Votre nom"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-black mb-1.5 uppercase tracking-wide">
                  Email *
                </label>
                <input
                  name="email" type="email" value={form.email} onChange={handleChange} required
                  placeholder="votre@email.com"
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-black mb-1.5 uppercase tracking-wide">
                Sujet *
              </label>
              <input
                name="subject" value={form.subject} onChange={handleChange} required
                placeholder="Objet de votre message"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-black mb-1.5 uppercase tracking-wide">
                Message *
              </label>
              <textarea
                name="message" value={form.message} onChange={handleChange} required
                placeholder="Votre message..."
                rows={6}
                className="input-field resize-none"
              />
            </div>

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
              <Send size={16} />
              {loading ? 'Envoi en cours...' : 'Envoyer le message'}
            </Button>
          </form>
        </div>
      </div>

      {/* Carte de localisation */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
        <h2 className="font-display text-2xl font-bold text-cec-blue mb-4">Nous trouver</h2>
        <div className="rounded-xl overflow-hidden shadow-lg border border-stone-200">
          <iframe
            title="Localisation de la chorale"
            src="https://www.google.com/maps?q=ECC%20B%C3%A9ulah%20Kouti%20Kpinl%C3%A8%20Avrankou&output=embed"
            className="w-full h-[400px]"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  )
}
