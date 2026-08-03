import { useParams, Link } from 'react-router-dom'
import { Play, ArrowLeft, Music } from 'lucide-react'
import { useAlbum } from '@/hooks'
import { usePlayerStore } from '@/store/playerStore'
import TrackList from '@/components/albums/TrackList'
import { Loading } from '@/components/ui'

export default function AlbumDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { data: album, isLoading, isError } = useAlbum(slug!)
  const { loadQueue } = usePlayerStore()

  if (isLoading) return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Loading rows={6} />
    </div>
  )

  if (isError || !album) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <p className="text-gray-500">Album introuvable.</p>
      <Link to="/albums" className="text-cec-blue hover:underline mt-4 inline-block">
        ← Retour aux albums
      </Link>
    </div>
  )

  const tracks = album.tracks ?? []

  return (
    <div>
      {/* Hero */}
      <div className="bg-cec-blue py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/albums" className="text-white/60 hover:text-white text-sm flex items-center gap-1 mb-8">
            <ArrowLeft size={14} /> Tous les albums
          </Link>

          <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
            {/* Cover */}
            <div className="w-48 h-48 flex-shrink-0 rounded-xl overflow-hidden shadow-gold">
              {album.cover_url ? (
                <img src={album.cover_url} alt={album.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-cec-blue-light flex items-center justify-center">
                  <Music size={48} className="text-white/20" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="text-center sm:text-left">
              <p className="text-cec-gold/70 text-sm uppercase tracking-widest mb-2">Album</p>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2">
                {album.title}
              </h1>
              <p className="text-white/60 mb-4">{album.release_year}</p>
              {album.description && (
                <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-lg">
                  {album.description}
                </p>
              )}
              {tracks.length > 0 && (
                <button
                  onClick={() => loadQueue(tracks, 0)}
                  className="bg-cec-gold text-cec-blue font-bold px-6 py-2.5 rounded-full
                             hover:bg-cec-gold-light transition-colors flex items-center gap-2 mx-auto sm:mx-0"
                >
                  <Play size={16} fill="currentColor" />
                  Lire tout l'album
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Track list */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {tracks.length > 0 ? (
          <div className="bg-white rounded-xl shadow-cec overflow-hidden">
            <div className="px-4 py-3 bg-stone-50 border-b border-stone-100 flex items-center justify-between">
              <h2 className="font-semibold text-cec-blue">{tracks.length} titre{tracks.length > 1 ? 's' : ''}</h2>
            </div>
            <TrackList tracks={tracks} />
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">Aucun titre disponible pour cet album.</p>
        )}
      </div>
    </div>
  )
}
