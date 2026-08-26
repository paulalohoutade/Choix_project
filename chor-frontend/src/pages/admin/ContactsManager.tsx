import { useState } from 'react'
import { Mail, MailOpen, Trash2, X } from 'lucide-react'
import { useAdminContacts, useAdminContactMutations } from '@/hooks'
import { useQueryClient } from '@tanstack/react-query'
import { AdminPageHeader } from './Dashboard'
import { Badge } from '@/components/ui'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import toast from 'react-hot-toast'
import type { Contact } from '@/types'

export default function ContactsManager() {
  const qc = useQueryClient()
  const { data, isLoading } = useAdminContacts()
  const contacts: Contact[] = data?.data ?? (Array.isArray(data) ? data : [])
  const { markAsRead, remove } = useAdminContactMutations()
  const [selected, setSelected] = useState<Contact | null>(null)

  const handleMarkRead = async (id: number) => {
    try {
      await markAsRead.mutateAsync(id)
      qc.invalidateQueries({ queryKey: ['admin-contacts'] })
    }
    catch { toast.error('Erreur.') }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce message ?')) return
    try {
      await remove.mutateAsync(id)
      qc.invalidateQueries({ queryKey: ['admin-contacts'] })
      toast.success('Message supprimé.')
      setSelected(null)
    }
    catch { toast.error('Erreur.') }
  }

  const unread = contacts.filter(c => !c.is_read).length

  return (
    <div>
      <AdminPageHeader
        title="Messages"
        subtitle={`${unread} non lu${unread !== 1 ? 's' : ''} sur ${contacts.length}`}
      />

      <div className="flex gap-6">
        {/* List */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-16 rounded-lg" />)}</div>
          ) : contacts.length === 0 ? (
            <p className="text-center text-gray-400 py-16">Aucun message.</p>
          ) : (
            <div className="space-y-2">
              {contacts.map(c => (
                <div
                  key={c.id}
                  onClick={() => { setSelected(c); if (!c.is_read) handleMarkRead(c.id) }}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    selected?.id === c.id
                      ? 'border-cec-blue bg-cec-blue/5'
                      : c.is_read
                        ? 'border-stone-100 bg-white hover:border-cec-blue/30'
                        : 'border-cec-blue/30 bg-blue-50/50 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      {c.is_read
                        ? <MailOpen size={15} className="text-gray-400 flex-shrink-0" />
                        : <Mail size={15} className="text-cec-blue flex-shrink-0" />
                      }
                      <div className="min-w-0">
                        <p className={`text-sm font-semibold truncate ${c.is_read ? 'text-gray-700' : 'text-cec-blue'}`}>
                          {c.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{c.subject ?? c.message.substring(0, 40)}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 flex-shrink-0">
                      {format(new Date(c.created_at), 'd MMM', { locale: fr })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-80 flex-shrink-0 bg-white rounded-xl border border-stone-200 p-5 self-start sticky top-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-bold text-cec-blue">{selected.name}</p>
                <p className="text-xs text-gray-500">{selected.email}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>
            {selected.subject && (
              <p className="text-sm font-semibold text-gray-700 mb-2">{selected.subject}</p>
            )}
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
            <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                {format(new Date(selected.created_at), 'PPp', { locale: fr })}
              </p>
              <button onClick={() => handleDelete(selected.id)}
                className="text-gray-400 hover:text-red-500 transition-colors">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
