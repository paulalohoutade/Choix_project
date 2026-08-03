import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useAdminEvents, useAdminEventMutations } from '@/hooks'
import { AdminPageHeader, AdminTable } from './Dashboard'
import { Button, Badge } from '@/components/ui'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import toast from 'react-hot-toast'
import type { Event } from '@/types'

export default function EventsManager() {
  const { data, isLoading } = useAdminEvents()
  const events: Event[] = data?.data ?? (Array.isArray(data) ? data : [])
  const { remove } = useAdminEventMutations()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Event | null>(null)

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cet événement ?')) return
    try { await remove.mutateAsync(id); toast.success('Événement supprimé.') }
    catch { toast.error('Erreur.') }
  }

  const statusColor = (s: string) => s === 'upcoming' ? 'green' : s === 'past' ? 'gray' : 'red'

  return (
    <div>
      <AdminPageHeader
        title="Événements"
        subtitle={`${events.length} événement${events.length !== 1 ? 's' : ''}`}
        action={
          <Button variant="primary" onClick={() => { setEditing(null); setShowForm(true) }}>
            <Plus size={16} /> Nouvel événement
          </Button>
        }
      />

      {showForm && (
        <EventForm event={editing} onClose={() => setShowForm(false)} onSaved={() => setShowForm(false)} />
      )}

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-14 rounded-lg" />)}</div>
      ) : (
        <AdminTable headers={['Titre', 'Type', 'Date', 'Lieu', 'Statut', 'Actions']} empty="Aucun événement.">
          {events.map(ev => (
            <tr key={ev.id} className="hover:bg-stone-50">
              <td className="px-4 py-3 font-semibold text-cec-blue">{ev.title}</td>
              <td className="px-4 py-3"><Badge color="blue">{ev.type}</Badge></td>
              <td className="px-4 py-3 text-gray-500 text-sm">
                {format(new Date(ev.event_date), 'd MMM yyyy', { locale: fr })}
              </td>
              <td className="px-4 py-3 text-gray-500 text-sm">{ev.location ?? '—'}</td>
              <td className="px-4 py-3">
                <Badge color={statusColor(ev.status) as 'green' | 'gray' | 'red'}>{ev.status}</Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button onClick={() => { setEditing(ev); setShowForm(true) }}
                    className="text-gray-400 hover:text-cec-blue transition-colors"><Pencil size={15} /></button>
                  <button onClick={() => handleDelete(ev.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}
    </div>
  )
}

function EventForm({ event, onClose, onSaved }: { event: Event | null; onClose: () => void; onSaved: () => void }) {
  const { create, update } = useAdminEventMutations()
  const [form, setForm] = useState({
    title: event?.title ?? '',
    description: event?.description ?? '',
    location: event?.location ?? '',
    event_date: event?.event_date ? event.event_date.substring(0, 16) : '',
    type: event?.type ?? 'concert',
    status: event?.status ?? 'upcoming',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    try {
      if (event) await update.mutateAsync({ id: event.id, data: form })
      else await create.mutateAsync(form)
      toast.success(event ? 'Événement mis à jour.' : 'Événement créé.')
      onSaved()
    } catch { toast.error('Erreur.') }
    finally { setLoading(false) }
  }

  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }))

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white">
          <h2 className="font-display font-bold text-cec-blue">
            {event ? 'Modifier l\'événement' : 'Nouvel événement'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Titre *</label>
            <input value={form.title} onChange={f('title')} required className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Type</label>
              <select value={form.type} onChange={f('type')} className="input-field">
                {['concert', 'messe', 'culte', 'répétition', 'other'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Statut</label>
              <select value={form.status} onChange={f('status')} className="input-field">
                <option value="upcoming">À venir</option>
                <option value="past">Passé</option>
                <option value="cancelled">Annulé</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Date *</label>
            <input type="datetime-local" value={form.event_date} onChange={f('event_date')} required className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Lieu</label>
            <input value={form.location} onChange={f('location')} className="input-field" placeholder="Ex: Cotonou, Bénin" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Description</label>
            <textarea value={form.description} onChange={f('description')} rows={3} className="input-field resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Annuler</Button>
            <Button type="submit" variant="primary" loading={loading} className="flex-1">
              {event ? 'Enregistrer' : 'Créer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
