import { useState } from 'react'
import {
  Plus, Pencil, Trash2, Star, Upload, ChevronDown, ChevronRight, Music2,
} from 'lucide-react'
import {
  useAdminAlbums, useAdminAlbumMutations, useAdminAlbum,
  useAdminTrackMutations,
} from '@/hooks'
import { useQueryClient } from '@tanstack/react-query'
import { AdminPageHeader, AdminTable } from './Dashboard'
import { Button, Badge } from '@/components/ui'
import toast from 'react-hot-toast'
import type { Album, Track } from '@/types'

export default function AlbumsManager() {
  const qc = useQueryClient()
  const { data, isLoading } = useAdminAlbums()
  const albums: Album[] = data?.data ?? (Array.isArray(data) ? data : [])
  const { remove, toggleFeatured, uploadCover } = useAdminAlbumMutations()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Album | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [showTrackForm, setShowTrackForm] = useState(false)

  const { data: expandedAlbum } = useAdminAlbum(expandedId ?? 0)
  const tracks: Track[] = expandedAlbum?.tracks ?? []

  const { create, remove: removeTrack, uploadAudio } = useAdminTrackMutations()

  const invalidate = (albumId: number) => {
    qc.invalidateQueries({ queryKey: ['admin-albums'] })
    qc.invalidateQueries({ queryKey: ['admin-album', albumId] })
  }

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

  const handleDeleteTrack = async (id: number, albumId: number) => {
    if (!confirm('Supprimer cette piste ?')) return
    try {
      await removeTrack.mutateAsync(id)
      invalidate(albumId)
      toast.success('Piste supprimée.')
    } catch { toast.error('Erreur.') }
  }

  const handleAudioUpload = async (id: number, albumId: number, file: File) => {
    try {
      await uploadAudio.mutateAsync({ id, file })
      invalidate(albumId)
      toast.success('Audio uploadé.')
    } catch { toast.error('Erreur upload audio.') }
  }

  const toggleExpand = (id: number) => {
    setExpandedId(prev => (prev === id ? null : id))
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

      {showTrackForm && expandedAlbum && (
        <TrackForm
          album={expandedAlbum}
          nextNumber={(expandedAlbum.tracks?.length ?? 0) + 1}
          onClose={() => setShowTrackForm(false)}
          onSaved={async (form, audioFile) => {
            try {
              const track = await create.mutateAsync({
                ...form,
                album_id: expandedAlbum.id,
              })
              if (audioFile) {
                await uploadAudio.mutateAsync({ id: track.data.id, file: audioFile })
              }
              invalidate(expandedAlbum.id)
              toast.success('Piste ajoutée.')
              setShowTrackForm(false)
            } catch { toast.error('Erreur.') }
          }}
        />
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="skeleton h-14 rounded-lg" />)}
        </div>
      ) : (
        <AdminTable
          headers={['', 'Pochette', 'Titre', 'Année', 'Titres', 'Statut', 'Vedette', 'Actions']}
          empty="Aucun album."
        >
          {albums.map((album) => (
            <AlbumRows
              key={album.id}
              album={album}
              expanded={expandedId === album.id}
              tracks={expandedId === album.id ? tracks : []}
              onToggle={() => toggleExpand(album.id)}
              onCoverUpload={handleCoverUpload}
              onToggleFeatured={handleToggleFeatured}
              onDelete={handleDelete}
              onEdit={() => { setEditing(album); setShowForm(true) }}
              onAddTrack={() => setShowTrackForm(true)}
              onDeleteTrack={handleDeleteTrack}
              onAudioUpload={handleAudioUpload}
            />
          ))}
        </AdminTable>
      )}
    </div>
  )
}

function AlbumRows({
  album, expanded, tracks, onToggle, onCoverUpload,
  onToggleFeatured, onDelete, onEdit, onAddTrack, onDeleteTrack, onAudioUpload,
}: {
  album: Album
  expanded: boolean
  tracks: Track[]
  onToggle: () => void
  onCoverUpload: (id: number, file: File) => void
  onToggleFeatured: (id: number) => void
  onDelete: (id: number) => void
  onEdit: () => void
  onAddTrack: () => void
  onDeleteTrack: (id: number, albumId: number) => void
  onAudioUpload: (id: number, albumId: number, file: File) => void
}) {
  return (
    <>
      <tr className="hover:bg-stone-50">
        <td className="px-4 py-3">
          <button onClick={onToggle} className="text-gray-400 hover:text-cec-blue transition-colors">
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        </td>
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
                onChange={e => e.target.files?.[0] && onCoverUpload(album.id, e.target.files[0])} />
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
          <button onClick={() => onToggleFeatured(album.id)}
            className={album.is_featured ? 'text-cec-gold' : 'text-gray-300 hover:text-cec-gold'}>
            <Star size={18} fill={album.is_featured ? 'currentColor' : 'none'} />
          </button>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <button onClick={onEdit}
              className="text-gray-400 hover:text-cec-blue transition-colors">
              <Pencil size={15} />
            </button>
            <button onClick={() => onDelete(album.id)}
              className="text-gray-400 hover:text-red-500 transition-colors">
              <Trash2 size={15} />
            </button>
          </div>
        </td>
      </tr>

      {expanded && (
        <tr>
          <td colSpan={8} className="px-4 pb-4 pt-2">
            <div className="bg-stone-50 rounded-xl border border-stone-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-semibold text-cec-blue flex items-center gap-2">
                  <Music2 size={16} className="text-cec-gold" />
                  Pistes de « {album.title} »
                </h3>
                <Button size="sm" variant="gold" onClick={onAddTrack}>
                  <Plus size={14} /> Ajouter une piste
                </Button>
              </div>

              {tracks.length === 0 ? (
                <p className="text-gray-400 text-sm py-4 text-center">Aucune piste pour le moment.</p>
              ) : (
                <div className="bg-white rounded-lg divide-y divide-stone-100">
                  {tracks.map((track, i) => (
                    <div key={track.id} className="flex items-center gap-3 px-4 py-2.5">
                      <span className="text-gray-400 text-xs w-6 text-right font-mono">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{track.title}</p>
                        <p className="text-xs text-gray-400">
                          {track.formatted_duration ?? '--:--'} · {track.audio_url ? 'Audio local' : (track.youtube_url ? 'YouTube' : (track.soundcloud_url ? 'SoundCloud' : 'Aucune source'))}
                        </p>
                      </div>
                      {track.audio_url && (
                        <audio src={track.audio_url} controls preload="none" className="h-9 max-w-[180px]" />
                      )}
                      <Badge color={track.source_type === 'local' ? 'green' : track.source_type === 'none' ? 'gray' : 'blue'}>
                        {track.source_type === 'local' ? 'Local' : track.source_type === 'none' ? '—' : 'Liens'}
                      </Badge>
                      <label className="cursor-pointer text-gray-400 hover:text-cec-blue transition-colors p-1" title="Uploader l'audio">
                        <Upload size={15} />
                        <input type="file" accept=".mp3,.wav,.ogg,.m4a,.flac,.aac,.opus,.aiff,.wma,.oga,.m4b,.mp2,.mp4" className="hidden"
                          onChange={e => e.target.files?.[0] && onAudioUpload(track.id, album.id, e.target.files[0])} />
                      </label>
                      <button onClick={() => onDeleteTrack(track.id, album.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
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

function parseDuration(input: string): number | null {
  const m = input.trim().match(/^(?:(\d+):)?(\d{1,2})(?::(\d{2}))?$/)
  if (!m) return null
  const hours = m[1] ? Number(m[1]) : 0
  const minutes = Number(m[2])
  const seconds = m[3] ? Number(m[3]) : 0
  if (seconds > 59 || minutes > 59) return null
  return hours * 3600 + minutes * 60 + seconds
}

function TrackForm({
  album, nextNumber, onClose, onSaved,
}: {
  album: Album
  nextNumber: number
  onClose: () => void
  onSaved: (form: { title: string; track_number: number; duration_seconds?: number; is_downloadable: boolean }, audio?: File) => Promise<void> | void
}) {
  const [title, setTitle] = useState('')
  const [duration, setDuration] = useState('')
  const [isDownloadable, setIsDownloadable] = useState(false)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    try {
      const durationSeconds = duration.trim() ? parseDuration(duration) : undefined
      if (durationSeconds === null) {
        toast.error('Durée invalide (format mm:ss).')
        return
      }
      await onSaved({
        title: title.trim(),
        track_number: nextNumber,
        duration_seconds: durationSeconds,
        is_downloadable: isDownloadable,
      }, audioFile ?? undefined)
    } finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-display font-bold text-cec-blue">Ajouter une piste</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Album</label>
            <input value={album.title} disabled className="input-field bg-stone-50" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Titre *</label>
            <input value={title} onChange={e => setTitle(e.target.value)} required
              className="input-field" placeholder="Titre de la piste" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">N° piste</label>
              <input type="number" value={nextNumber} min={1} className="input-field bg-stone-50" disabled />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Durée (mm:ss)</label>
              <input value={duration} onChange={e => setDuration(e.target.value)}
                placeholder="3:45" className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Fichier audio</label>
            <input type="file" accept=".mp3,.wav,.ogg,.m4a,.flac,.aac,.opus,.aiff,.wma,.oga,.m4b,.mp2,.mp4" className="input-field"
              onChange={e => setAudioFile(e.target.files?.[0] ?? null)} />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" checked={isDownloadable} onChange={e => setIsDownloadable(e.target.checked)}
              className="accent-cec-gold h-4 w-4" />
            Téléchargeable
          </label>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Annuler</Button>
            <Button type="submit" variant="primary" loading={loading} className="flex-1">Ajouter</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
