import { useState } from 'react'
import { donationsApi } from '@/lib/api'
import toast from 'react-hot-toast'
import { PageHero, Button } from '@/components/ui'
import { Heart } from 'lucide-react'

const AMOUNTS = [1000, 2500, 5000, 10000, 25000]

export default function Donate() {
  const [form, setForm] = useState({
    name: '', email: '', amount: '', message: '', currency: 'XOF',
  })
  const [custom, setCustom] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleAmount = (v: number) => {
    setForm((p) => ({ ...p, amount: String(v) }))
    setCustom(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.amount || Number(form.amount) < 100) {
      toast.error('Montant minimum : 100 XOF')
      return
    }
    setLoading(true)
    try {
      const res = await donationsApi.store({ ...form, amount: Number(form.amount) })
      toast.success('Don enregistré ! Merci pour votre générosité.')
      console.log('Donation ref:', res.data?.reference)
      setForm({ name: '', email: '', amount: '', message: '', currency: 'XOF' })
    } catch {
      toast.error("Erreur lors de l'enregistrement.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHero
        title="Soutenir la Chorale"
        subtitle="Votre don aide la chorale à accomplir sa mission"
      />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        {/* Why donate */}
        <div className="bg-cec-blue/5 border border-cec-blue/20 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Heart size={18} className="text-cec-gold" fill="currentColor" />
            <h2 className="font-display font-bold text-cec-blue">Pourquoi donner ?</h2>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            Vos dons permettent à la chorale d'acquérir des instruments, de produire de nouveaux albums,
            d'organiser des concerts et de former de nouveaux membres. Chaque contribution compte.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Amount selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">
              Montant du don (XOF) *
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
              {AMOUNTS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => handleAmount(a)}
                  className={`py-2.5 rounded-lg text-sm font-bold transition-colors ${
                    form.amount === String(a) && !custom
                      ? 'bg-cec-blue text-white'
                      : 'bg-stone-100 text-gray-700 hover:bg-cec-blue/10'
                  }`}
                >
                  {a.toLocaleString()}
                </button>
              ))}
            </div>
            <input
              type="number"
              placeholder="Autre montant..."
              min={100}
              value={custom ? form.amount : ''}
              onChange={(e) => { setCustom(true); setForm((p) => ({ ...p, amount: e.target.value })) }}
              onFocus={() => setCustom(true)}
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Nom *</label>
              <input name="name" value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                required placeholder="Votre nom" className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Email *</label>
              <input name="email" type="email" value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                required placeholder="votre@email.com" className="input-field" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Message (optionnel)
            </label>
            <textarea
              value={form.message}
              onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
              placeholder="Un mot d'encouragement..."
              rows={3}
              className="input-field resize-none"
            />
          </div>

          <Button type="submit" variant="gold" size="lg" loading={loading} className="w-full">
            <Heart size={16} fill="currentColor" />
            {loading ? 'Traitement...' : `Faire un don de ${Number(form.amount || 0).toLocaleString()} XOF`}
          </Button>

          <p className="text-xs text-gray-400 text-center">
            Votre générosité est appréciée. Que Dieu vous bénisse !
          </p>
        </form>
      </div>
    </div>
  )
}
