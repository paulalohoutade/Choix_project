import { useState, useRef } from 'react'
import { Upload, Trash2, X, Play } from 'lucide-react'
import { useAdminGallery, useAdminGalleryMutations } from '@/hooks'
import { useQueryClient } from '@tanstack/react-query'
import { AdminPageHeader, AdminTable } from './Dashboard'
import { Button } from '@/components/ui'
import toast from 'react-hot-toast'
import type { GalleryItem } from '@/types'

export default function GalleryManager() {
  const qc = useQueryClient()
  const { data, isLoading } = useAdminGallery()
  const items: GalleryItem[] = data?.data ?? (Array.isArray(data) ? data : [])
  const { upload, remove } = useAdminGalleryMutations()
  const [showUpload, setShowUpload] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploadForm, setUploadForm] = useState({ title: '', type: 'photo' as 'photo' | 'video' })

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cet élément ?')) return
    try { await remove.mutateAsync(id); toast.success('Supprimé.') }
    catch { toast.error('Erreur.') }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    const file = fileRef.current?.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const res = await upload.mutateAsync({ file, data: { title: uploadForm.title, type: uploadForm.type } })
      qc.setQueryData(['admin-gallery'], (old: any[]) => [res.data, ...(old ?? [])])
      toast.success('Fichier uploadé !')
      setShowUpload(false)
      setUploadForm({ title: '', type: 'photo' })
      if (fileRef.current) fileRef.current.value = ''
    } catch { toast.error('Erreur upload.') }
    finally { setUploading(false) }
  }

  return (
    <div>
      <AdminPageHeader
        title="Galerie"
        subtitle={`${items.length} élément${items.length !== 1 ? 's' : ''}`}
        action={
          <Button variant="primary" onClick={() => setShowUpload(true)}>
            <Upload size={16} /> Ajouter un fichier
          </Button>
        }
      />

      {showUpload && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="font-display font-bold text-cec-blue">Ajouter un fichier</h2>
              <button onClick={() => setShowUpload(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <form onSubmit={handleUpload} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Fichier *</label>
                <input ref={fileRef} type="file" accept="image/*,video/*" required className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Titre</label>
                <input value={uploadForm.title}
                  onChange={e => setUploadForm(p => ({ ...p, title: e.target.value }))}
                  className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Type</label>
                <select value={uploadForm.type}
                  onChange={e => setUploadForm(p => ({ ...p, type: e.target.value as 'photo' | 'video' }))}
                  className="input-field">
                  <option value="photo">Photo</option>
                  <option value="video">Vidéo</option>
                </select>
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setShowUpload(false)} className="flex-1">Annuler</Button>
                <Button type="submit" variant="primary" loading={uploading} className="flex-1">Uploader</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grid view */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton aspect-square rounded-lg" />)}
        </div>
      ) : items.length === 0 ? (
        <p className="text-center text-gray-400 py-16">Galerie vide.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {items.map(item => (
            <div key={item.id} className="group relative aspect-square rounded-lg overflow-hidden bg-stone-100">
              {item.type === 'video' && item.file_url ? (
                <div className="w-full h-full relative bg-black">
                  <video src={item.file_url} muted playsInline preload="metadata" className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-black/50 rounded-full p-2">
                      <Play size={20} className="text-white" fill="currentColor" />
                    </span>
                  </div>
                </div>
              ) : item.file_url && (
                <img src={item.file_url} alt={item.title ?? ''} className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity
                              flex flex-col items-center justify-center gap-2 p-2">
                {item.title && (
                  <p className="text-white text-xs text-center truncate w-full">{item.title}</p>
                )}
                <button onClick={() => handleDelete(item.id)}
                  className="bg-red-500 text-white rounded-lg p-1.5 hover:bg-red-600 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
