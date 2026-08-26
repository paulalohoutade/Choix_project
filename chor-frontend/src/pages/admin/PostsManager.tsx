import { useState } from 'react'
import { Plus, Pencil, Trash2, Send } from 'lucide-react'
import { useAdminPosts, useAdminPostMutations } from '@/hooks'
import { useQueryClient } from '@tanstack/react-query'
import { AdminPageHeader, AdminTable } from './Dashboard'
import { Button, Badge } from '@/components/ui'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import toast from 'react-hot-toast'
import type { Post } from '@/types'

export default function PostsManager() {
  const { data, isLoading } = useAdminPosts()
  const posts: Post[] = data?.data ?? (Array.isArray(data) ? data : [])
  const { remove, publish } = useAdminPostMutations()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Post | null>(null)

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cet article ?')) return
    try { await remove.mutateAsync(id); toast.success('Article supprimé.') }
    catch { toast.error('Erreur.') }
  }

  const handlePublish = async (id: number) => {
    try { await publish.mutateAsync(id); toast.success('Article publié !') }
    catch { toast.error('Erreur.') }
  }

  return (
    <div>
      <AdminPageHeader
        title="Actualités"
        subtitle={`${posts.length} article${posts.length !== 1 ? 's' : ''}`}
        action={
          <Button variant="primary" onClick={() => { setEditing(null); setShowForm(true) }}>
            <Plus size={16} /> Nouvel article
          </Button>
        }
      />

      {showForm && (
        <PostForm post={editing} onClose={() => setShowForm(false)} onSaved={() => setShowForm(false)} />
      )}

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-14 rounded-lg" />)}</div>
      ) : (
        <AdminTable headers={['Titre', 'Catégorie', 'Statut', 'Publié le', 'Actions']} empty="Aucun article.">
          {posts.map(post => (
            <tr key={post.id} className="hover:bg-stone-50">
              <td className="px-4 py-3 font-semibold text-cec-blue max-w-xs truncate">{post.title}</td>
              <td className="px-4 py-3 text-gray-500 text-sm">{post.category ?? '—'}</td>
              <td className="px-4 py-3">
                <Badge color={post.status === 'published' ? 'green' : 'gray'}>
                  {post.status === 'published' ? 'Publié' : 'Brouillon'}
                </Badge>
              </td>
              <td className="px-4 py-3 text-gray-500 text-sm">
                {post.published_at ? format(new Date(post.published_at), 'PP', { locale: fr }) : '—'}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {post.status === 'draft' && (
                    <button onClick={() => handlePublish(post.id)}
                      className="text-gray-400 hover:text-green-600 transition-colors" title="Publier">
                      <Send size={15} />
                    </button>
                  )}
                  <button onClick={() => { setEditing(post); setShowForm(true) }}
                    className="text-gray-400 hover:text-cec-blue transition-colors"><Pencil size={15} /></button>
                  <button onClick={() => handleDelete(post.id)}
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

function PostForm({ post, onClose, onSaved }: { post: Post | null; onClose: () => void; onSaved: () => void }) {
  const qc = useQueryClient()
  const { create, update } = useAdminPostMutations()
  const [form, setForm] = useState({
    title: post?.title ?? '',
    excerpt: post?.excerpt ?? '',
    body: post?.body ?? '',
    category: post?.category ?? '',
    status: post?.status ?? 'draft',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    try {
      if (post) {
        const res = await update.mutateAsync({ id: post.id, data: form })
        qc.setQueryData(['admin-posts'], (old: any[]) =>
          old.map(a => a.id === post.id ? res.data : a)
        )
        toast.success('Article mis à jour.')
      } else {
        const res = await create.mutateAsync(form)
        qc.setQueryData(['admin-posts'], (old: any[]) => [res.data, ...(old ?? [])])
        toast.success('Article créé.')
      }
      onSaved()
    } catch { toast.error('Erreur.') }
    finally { setLoading(false) }
  }

  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }))

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white">
          <h2 className="font-display font-bold text-cec-blue">{post ? 'Modifier l\'article' : 'Nouvel article'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Titre *</label>
            <input value={form.title} onChange={f('title')} required className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Catégorie</label>
              <input value={form.category} onChange={f('category')} className="input-field" placeholder="Ex: Annonce" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Statut</label>
              <select value={form.status} onChange={f('status')} className="input-field">
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Résumé</label>
            <textarea value={form.excerpt} onChange={f('excerpt')} rows={2} className="input-field resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Contenu</label>
            <textarea value={form.body} onChange={f('body')} rows={8} className="input-field resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Annuler</Button>
            <Button type="submit" variant="primary" loading={loading} className="flex-1">
              {post ? 'Enregistrer' : 'Créer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
