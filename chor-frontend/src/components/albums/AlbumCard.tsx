import { Link } from 'react-router-dom'
import { Play, Music } from 'lucide-react'
import type { Album } from '@/types'
import { usePlayerStore } from '@/store/playerStore'

interface Props {
  album: Album
}

export default function AlbumCard({ album }: Props) {
  const { loadQueue } = usePlayerStore()

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault()
    if (album.tracks?.length) {
      loadQueue(album.tracks, 0)
    }
  }

  return (
    <Link
      to={`/albums/${album.slug}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-cec
                 hover:shadow-gold transition-all duration-300 hover:-translate-y-1"
    >
      {/* Cover */}
      <div className="relative aspect-square bg-stone-100 overflow-hidden">
        {album.cover_url ? (
          <img
            src={album.cover_url}
            alt={album.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-cec-blue/10">
            <Music size={48} className="text-cec-blue/30" />
          </div>
        )}

        {/* Play overlay */}
        {album.tracks && album.tracks.length > 0 && (
          <button
            onClick={handlePlay}
            className="absolute inset-0 bg-cec-dark/40 opacity-0 group-hover:opacity-100
                       transition-opacity flex items-center justify-center"
          >
            <div className="w-14 h-14 rounded-full bg-cec-gold flex items-center justify-center
                            shadow-gold scale-90 group-hover:scale-100 transition-transform">
              <Play size={24} fill="currentColor" className="text-cec-blue ml-1" />
            </div>
          </button>
        )}

        {/* Featured badge */}
        {album.is_featured && (
          <div className="absolute top-2 left-2 bg-cec-gold text-cec-blue text-xs font-bold
                          px-2 py-0.5 rounded-full">
            Vedette
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-display font-bold text-cec-blue text-base truncate group-hover:text-cec-blue-light">
          {album.title}
        </h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-sm text-gray-500">{album.release_year}</span>
          {album.tracks_count !== undefined && (
            <span className="text-xs text-gray-400">{album.tracks_count} titre{album.tracks_count !== 1 ? 's' : ''}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
