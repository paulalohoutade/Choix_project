import { useState } from 'react'
import { Plus, Pencil, Trash2, Upload } from 'lucide-react'
import { useAdminMembers, useAdminMemberMutations } from '@/hooks'
import { useQueryClient } from '@tanstack/react-query'
import { AdminPageHeader, AdminTable } from './Dashboard'
import { Button } from '@/components/ui'
import { useConfirm } from '@/components/ui/confirm'
import toast from 'react-hot-toast'
import type { Member } from '@/types'

export default function MembersManager() {
  const qc = useQueryClient()
  const { data, isLoading } = useAdminMembers()
  const members: Member[] = Array.isArray(data) ? data : []
  const { remove, uploadPhoto } = useAdminMemberMutations()
  const { confirm, dialog } = useConfirm()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Member | null>(null)

  const handleDelete = async (id: number) => {
    const ok = await confirm({
      title: 'Supprimer ce membre ?',
      message: 'Voulez-vous vraiment supprimer ce membre de la chorale ? Son profil disparaîtra définitivement.',
    })
    if (!ok) return
    try {
      await remove.mutateAsync(id)
      await qc.refetchQueries({ queryKey: ['admin-members'] })
      toast.success('Membre supprimé.')
    }
    catch { toast.error('Erreur.') }
  }

  const handlePhotoUpload = async (id: number, file: File) => {
    try {
      await uploadPhoto.mutateAsync({ id, file })
      await qc.refetchQueries({ queryKey: ['admin-members'] })
      toast.success('Photo mise à jour.')
    }
    catch { toast.error('Erreur upload.') }
  }

  return (
    <div>
      <AdminPageHeader
        title="Membres"
        subtitle={`${members.length} membre${members.length !== 1 ? 's' : ''}`}
        action={
          <Button variant="primary" onClick={() => { setEditing(null); setShowForm(true) }}>
            <Plus size={16} /> Nouveau membre
          </Button>
        }
      />

      {showForm && (
        <MemberForm member={editing} onClose={() => setShowForm(false)} onSaved={() => setShowForm(false)} />
      )}

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-14 rounded-lg" />)}</div>
      ) : (
        <AdminTable headers={['Photo', 'Nom', 'Rôle', 'Responsable', 'Actions']} empty="Aucun membre.">
          {members.map(m => (
            <tr key={m.id} className="hover:bg-stone-50">
              <td className="px-4 py-3">
                <div className="relative w-10 h-10 group">
                  {m.photo_url ? (
                    <img src={m.photo_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-cec-blue/10 flex items-center justify-center">
                      <span className="text-cec-blue/40 font-bold">{m.name.charAt(0)}</span>
                    </div>
                  )}
                  <label className="absolute inset-0 flex items-center justify-center bg-black/40
                                    opacity-0 group-hover:opacity-100 cursor-pointer rounded-full transition-opacity">
                    <Upload size={12} className="text-white" />
                    <input type="file" accept="image/*" className="hidden"
                      onChange={e => e.target.files?.[0] && handlePhotoUpload(m.id, e.target.files[0])} />
                  </label>
                </div>
              </td>
              <td className="px-4 py-3 font-semibold text-cec-blue">{m.name}</td>
              <td className="px-4 py-3 text-gray-500 text-sm">{m.role ?? '—'}</td>
              <td className="px-4 py-3">
                {m.is_leader ? (
                  <span className="text-xs bg-cec-gold/20 text-cec-blue px-2 py-0.5 rounded-full font-semibold">Oui</span>
                ) : (
                  <span className="text-xs text-gray-400">Non</span>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button onClick={() => { setEditing(m); setShowForm(true) }}
                    className="text-gray-400 hover:text-cec-blue transition-colors"><Pencil size={15} /></button>
                  <button onClick={() => handleDelete(m.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}
      {dialog}
    </div>
  )
}

function MemberForm({ member, onClose, onSaved }: { member: Member | null; onClose: () => void; onSaved: () => void }) {
  const qc = useQueryClient()
  const { create, update } = useAdminMemberMutations()
  const [form, setForm] = useState({
    name: member?.name ?? '',
    role: member?.role ?? '',
    bio: member?.bio ?? '',
    is_leader: member?.is_leader ?? false,
    sort_order: member?.sort_order ?? 0,
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    try {
      if (member) {
        await update.mutateAsync({ id: member.id, data: form })
        await qc.refetchQueries({ queryKey: ['admin-members'] })
        toast.success('Membre mis à jour.')
      } else {
        await create.mutateAsync(form)
        await qc.refetchQueries({ queryKey: ['admin-members'] })
        toast.success('Membre créé.')
      }
      onSaved()
    } catch { toast.error('Erreur.') }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-display font-bold text-cec-blue">{member ? 'Modifier le membre' : 'Nouveau membre'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Nom *</label>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Rôle</label>
            <input value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} className="input-field" placeholder="Ex: Chef de chœur" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Biographie</label>
            <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} rows={3} className="input-field resize-none" />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.is_leader}
              onChange={e => setForm(p => ({ ...p, is_leader: e.target.checked }))}
              className="w-4 h-4 accent-cec-blue" />
            <span className="text-sm text-gray-700">Responsable / Direction</span>
          </label>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Annuler</Button>
            <Button type="submit" variant="primary" loading={loading} className="flex-1">
              {member ? 'Enregistrer' : 'Créer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
