import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { usePost } from '@/hooks'
import { Loading, Badge } from '@/components/ui'

export default function PostDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { data: post, isLoading, isError } = usePost(slug!)

  if (isLoading) return <div className="max-w-3xl mx-auto px-4 py-12"><Loading /></div>
  if (isError || !post) return (
    <div className="text-center py-20">
      <p className="text-gray-500">Article introuvable.</p>
      <Link to="/actualites" className="text-cec-blue hover:underline mt-3 inline-block">← Retour</Link>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Link to="/actualites" className="text-cec-blue text-sm flex items-center gap-1 hover:underline mb-6">
        <ArrowLeft size={14} /> Toutes les actualités
      </Link>

      {post.cover_url && (
        <img src={post.cover_url} alt={post.title}
          className="w-full aspect-video object-cover rounded-xl mb-8 shadow-cec" />
      )}

      {post.category && <Badge color="gold">{post.category}</Badge>}

      <h1 className="font-display text-3xl sm:text-4xl font-bold text-cec-blue mt-3 mb-3">
        {post.title}
      </h1>

      <div className="flex items-center gap-3 text-sm text-gray-500 mb-8 pb-6 border-b border-stone-100">
        {post.published_at && (
          <span>{format(new Date(post.published_at), "d MMMM yyyy", { locale: fr })}</span>
        )}
        {post.author && (
          <>
            <span className="text-stone-300">·</span>
            <span>{post.author.name}</span>
          </>
        )}
      </div>

      {post.excerpt && (
        <p className="text-lg text-gray-600 font-medium mb-6 leading-relaxed italic">
          {post.excerpt}
        </p>
      )}

      {post.body && (
        <div
          className="prose prose-stone max-w-none text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.body.replace(/\n/g, '<br/>') }}
        />
      )}
    </div>
  )
}
