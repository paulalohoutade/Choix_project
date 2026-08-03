import { useState } from 'react'
import { Plus, Pencil, Trash2, Star, Upload } from 'lucide-react'
import { useAdminAlbums, useAdminAlbumMutations } from '@/hooks'
import { AdminPageHeader, AdminTable } from './Dashboard'
import { Button, Badge } from '@/components/ui'
import toast from 'react-hot-toast'
import type { Album } from '@/types'

export default function AlbumsManager() {
  const { data, isLoading } = useAdminAlbums()
  const albums: Album[] = data?.data ?? (Array.isArray(data) ? data : [])
  const { remove, toggleFeatured, uploadCover } = useAdminAlbumMutations()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Album | null>(null)

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cet album ?')) return
    try { await remove.mutateAsync(id); toast.success('Album supprimé.') }
    catch { toast.error('Erreur.') }
  }

  const handleToggleFeatured = async (id: number) => {
    try { await toggleFeatured.mutateAsync(id); toast.success('Mis à jour.') }
    catch { toast.error('Erreur.') }
  }

  const handleCoverUpload = async (id: number, file: File) => {
    try {
      await uploadCover.mutateAsync({ id, file })
      toast.success('Pochette mise à jour.')
    } catch { toast.error('Erreur upload.') }
  }

  return (
    <div>
      <AdminPageHeader
        title="Albums & Pistes"
        subtitle={`${albums.length} album${albums.length !== 1 ? 's' : ''}`}
        action={
          <Button variant="primary" onClick={() => { setEditing(null); setShowForm(true) }}>
            <Plus size={16} /> Nouvel album
          </Button>
        }
      />

      {showForm && (
        <AlbumForm
          album={editing}
          onClose={() => setShowForm(false)}
          onSaved={() => setShowForm(false)}
        />
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="skeleton h-14 rounded-lg" />)}
        </div>
      ) : (
        <AdminTable
          headers={['Pochette', 'Titre', 'Année', 'Titres', 'Statut', 'Vedette', 'Actions']}
          empty="Aucun album."
        >
          {albums.map((album) => (
            <tr key={album.id} className="hover:bg-stone-50">
              <td className="px-4 py-3">
                <div className="relative w-10 h-10 group">
                  {album.cover_url ? (
                    <img src={album.cover_url} alt="" className="w-10 h-10 rounded object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded bg-stone-200" />
                  )}
                  <label className="absolute inset-0 flex items-center justify-center bg-black/40
                                    opacity-0 group-hover:opacity-100 cursor-pointer rounded transition-opacity">
                    <Upload size={14} className="text-white" />
                    <input type="file" accept="image/*" className="hidden"
                      onChange={e => e.target.files?.[0] && handleCoverUpload(album.id, e.target.files[0])} />
                  </label>
                </div>
              </td>
              <td className="px-4 py-3 font-semibold text-cec-blue">{album.title}</td>
              <td className="px-4 py-3 text-gray-500">{album.release_year}</td>
              <td className="px-4 py-3 text-gray-500">{album.tracks_count ?? 0}</td>
              <td className="px-4 py-3">
                <Badge color={album.status === 'published' ? 'green' : 'gray'}>
                  {album.status === 'published' ? 'Publié' : 'Brouillon'}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <button onClick={() => handleToggleFeatured(album.id)}
                  className={album.is_featured ? 'text-cec-gold' : 'text-gray-300 hover:text-cec-gold'}>
                  <Star size={18} fill={album.is_featured ? 'currentColor' : 'none'} />
                </button>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button onClick={() => { setEditing(album); setShowForm(true) }}
                    className="text-gray-400 hover:text-cec-blue transition-colors">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => handleDelete(album.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}
    </div>
  )
}

function AlbumForm({ album, onClose, onSaved }: { album: Album | null; onClose: () => void; onSaved: () => void }) {
  const { create, update } = useAdminAlbumMutations()
  const [form, setForm] = useState({
    title: album?.title ?? '',
    description: album?.description ?? '',
    release_year: album?.release_year ?? new Date().getFullYear(),
    status: album?.status ?? 'draft',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (album) await update.mutateAsync({ id: album.id, data: form })
      else await create.mutateAsync(form)
      toast.success(album ? 'Album mis à jour.' : 'Album créé.')
      onSaved()
    } catch { toast.error('Erreur.') }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-display font-bold text-cec-blue">
            {album ? 'Modifier l\'album' : 'Nouvel album'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Titre *</label>
            <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              required className="input-field" placeholder="Nom de l'album" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Description</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              rows={3} className="input-field resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Année *</label>
              <input type="number" value={form.release_year}
                onChange={e => setForm(p => ({ ...p, release_year: Number(e.target.value) }))}
                required min={1900} max={2100} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Statut</label>
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as 'draft' | 'published' }))}
                className="input-field">
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Annuler</Button>
            <Button type="submit" variant="primary" loading={loading} className="flex-1">
              {album ? 'Enregistrer' : 'Créer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
