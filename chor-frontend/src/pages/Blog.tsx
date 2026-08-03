import { useState } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { usePosts } from '@/hooks'
import { PageHero, EmptyState } from '@/components/ui'
import { Newspaper } from 'lucide-react'
import type { Post } from '@/types'

export default function Blog() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = usePosts({ page })
  const posts: Post[] = data?.data ?? []
  const lastPage = data?.last_page ?? 1

  return (
    <div>
      <PageHero title="Actualités" subtitle="Nouvelles et annonces de la chorale" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {isLoading ? (
          <div className="space-y-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="skeleton w-24 h-24 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 rounded w-16" />
                  <div className="skeleton h-5 rounded w-3/4" />
                  <div className="skeleton h-4 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <EmptyState
            icon={<Newspaper size={48} />}
            title="Aucune actualité"
            message="Les articles seront bientôt publiés."
          />
        ) : (
          <div className="space-y-5">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/actualites/${post.slug}`}
                className="group flex gap-5 bg-white rounded-xl p-5 shadow-cec hover:shadow-gold transition-all"
              >
                {post.cover_url && (
                  <img
                    src={post.cover_url}
                    alt={post.title}
                    className="w-28 h-28 object-cover rounded-lg flex-shrink-0 group-hover:opacity-90"
                  />
                )}
                <div className="flex-1 min-w-0">
                  {post.category && (
                    <span className="text-xs font-bold text-cec-gold uppercase tracking-widest">
                      {post.category}
                    </span>
                  )}
                  <h2 className="font-display font-bold text-cec-blue text-lg mt-1 group-hover:text-cec-blue-light">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{post.excerpt}</p>
                  )}
                  {post.published_at && (
                    <p className="text-xs text-gray-400 mt-2">
                      {format(new Date(post.published_at), 'PP', { locale: fr })}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {lastPage > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: lastPage }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
                  p === page
                    ? 'bg-cec-blue text-white'
                    : 'bg-white text-cec-blue border border-cec-blue/30 hover:border-cec-blue'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
