import { useState } from 'react'
import { X, Youtube, Play } from 'lucide-react'
import { useGallery } from '@/hooks'
import { PageHero, EmptyState } from '@/components/ui'
import type { GalleryItem } from '@/types'
import clsx from 'clsx'

const filters = [
  { value: '', label: 'Tout' },
  { value: 'photo', label: 'Photos' },
  { value: 'video', label: 'Vidéos' },
]

export default function Gallery() {
  const [filter, setFilter] = useState('')
  const [selected, setSelected] = useState<GalleryItem | null>(null)
  const params = filter ? { type: filter } : {}
  const { data, isLoading } = useGallery(params)
  const items: GalleryItem[] = data?.data ?? (Array.isArray(data) ? data : [])

  return (
    <div>
      <PageHero title="Galerie" subtitle="Photos et vidéos de la chorale" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Filters */}
        <div className="flex gap-2 mb-8">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={clsx(
                'px-4 py-2 rounded-full text-sm font-semibold transition-colors',
                filter === f.value
                  ? 'bg-cec-blue text-white'
                  : 'bg-white text-cec-blue border border-cec-blue/30 hover:border-cec-blue'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton aspect-square rounded-lg" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState title="Galerie vide" message="Aucun contenu pour le moment." />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelected(item)}
                className="relative aspect-square cursor-pointer overflow-hidden rounded-lg
                           bg-stone-100 group"
              >
                {item.type === 'video' && item.file_url ? (
                  <div className="w-full h-full relative bg-black">
                    <video
                      src={item.file_url}
                      muted
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-black/50 rounded-full p-3">
                        <Play size={28} className="text-white" fill="currentColor" />
                      </span>
                    </div>
                  </div>
                ) : item.file_url ? (
                  <img
                    src={item.file_url}
                    alt={item.title ?? ''}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : item.youtube_url ? (
                  <div className="w-full h-full flex items-center justify-center bg-red-50">
                    <Youtube size={32} className="text-red-500" />
                  </div>
                ) : null}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-cec-dark/30 opacity-0 group-hover:opacity-100
                               transition-opacity flex items-end p-3">
                  {item.title && (
                    <p className="text-white text-xs font-semibold truncate">{item.title}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white"
            onClick={() => setSelected(null)}
          >
            <X size={32} />
          </button>

          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            {selected.type === 'video' && selected.file_url ? (
              <video
                src={selected.file_url}
                controls
                autoPlay
                className="max-w-full max-h-[80vh] mx-auto rounded-xl"
              />
            ) : selected.file_url ? (
              <img
                src={selected.file_url}
                alt={selected.title ?? ''}
                className="max-w-full max-h-[80vh] mx-auto rounded-xl"
              />
            ) : selected.youtube_url ? (
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${extractYouTubeId(selected.youtube_url)}`}
                  className="w-full h-full rounded-xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : null}
            {selected.title && (
              <p className="text-white text-center mt-3 font-display text-lg">{selected.title}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function extractYouTubeId(url: string): string {
  const match = url.match(/[?&]v=([^&]+)/) ?? url.match(/youtu\.be\/([^?]+)/)
  return match?.[1] ?? ''
}
