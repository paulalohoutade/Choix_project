import { useAlbums } from '@/hooks'
import AlbumCard from '@/components/albums/AlbumCard'
import { PageHero, CardSkeleton, EmptyState } from '@/components/ui'
import { Disc3 } from 'lucide-react'
import type { Album } from '@/types'

export default function Albums() {
  const { data, isLoading } = useAlbums()
  const albums: Album[] = Array.isArray(data) ? data : []

  return (
    <div>
      <PageHero
        title="Discographie"
        subtitle="Toute la musique de la Chorale Hefzibah"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {isLoading ? (
          <CardSkeleton count={6} />
        ) : albums.length === 0 ? (
          <EmptyState
            icon={<Disc3 size={48} />}
            title="Aucun album disponible"
            message="Les albums seront bientôt publiés. Revenez plus tard !"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {albums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
