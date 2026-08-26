import { useState, useEffect } from 'react'
import { useAdminSettings, useAdminSettingsMutation } from '@/hooks'
import { useQueryClient } from '@tanstack/react-query'
import { AdminPageHeader } from './Dashboard'
import { Button } from '@/components/ui'
import toast from 'react-hot-toast'

const SETTINGS_FIELDS = [
  { key: 'site_name', label: 'Nom du site', type: 'text' },
  { key: 'site_description', label: 'Description du site', type: 'textarea' },
  { key: 'contact_email', label: 'Email de contact', type: 'email' },
  { key: 'contact_phone', label: 'Téléphone', type: 'text' },
  { key: 'address', label: 'Adresse', type: 'text' },
  { key: 'facebook_url', label: 'URL Facebook', type: 'url' },
  { key: 'youtube_url', label: 'URL YouTube', type: 'url' },
  { key: 'instagram_url', label: 'URL Instagram', type: 'url' },
]

export default function Settings() {
  const qc = useQueryClient()
  const { data: settings, isLoading } = useAdminSettings()
  const mutation = useAdminSettingsMutation()
  const [form, setForm] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (settings) {
      const map: Record<string, string> = {}
      if (Array.isArray(settings)) {
        settings.forEach((s: { key: string; value: string }) => { map[s.key] = s.value })
      } else {
        Object.assign(map, settings)
      }
      setForm(map)
    }
  }, [settings])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await mutation.mutateAsync(form)
      await qc.refetchQueries({ queryKey: ['admin-settings'] })
      toast.success('Paramètres enregistrés.')
    } catch {
      toast.error('Erreur lors de la sauvegarde.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <AdminPageHeader title="Paramètres" subtitle="Configuration générale du site" />

      {isLoading ? (
        <div className="space-y-4">{[1,2,3,4].map(i => <div key={i} className="skeleton h-12 rounded-lg" />)}</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-cec p-6 space-y-5">
            {SETTINGS_FIELDS.map(({ key, label, type }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  {label}
                </label>
                {type === 'textarea' ? (
                  <textarea
                    value={form[key] ?? ''}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    rows={3}
                    className="input-field resize-none"
                  />
                ) : (
                  <input
                    type={type}
                    value={form[key] ?? ''}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    className="input-field"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <Button type="submit" variant="primary" size="lg" loading={loading}>
              Enregistrer les paramètres
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
