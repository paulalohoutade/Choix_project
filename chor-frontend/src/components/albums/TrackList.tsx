import { Play, Pause, Download, ExternalLink } from 'lucide-react'
import type { Track } from '@/types'
import { usePlayerStore, useCurrentTrack, useIsPlaying } from '@/store/playerStore'
import clsx from 'clsx'

interface Props {
  tracks: Track[]
}

export default function TrackList({ tracks }: Props) {
  const { loadQueue, toggle } = usePlayerStore()
  const currentTrack = useCurrentTrack()
  const isPlaying = useIsPlaying()

  const handleTrack = (index: number) => {
    const t = tracks[index]
    if (currentTrack?.id === t.id) {
      toggle()
    } else {
      loadQueue(tracks, index)
    }
  }

  return (
    <div className="divide-y divide-stone-100">
      {tracks.map((track, i) => {
        const isCurrent = currentTrack?.id === track.id
        const hasAudio = track.source_type !== 'none'

        return (
          <div
            key={track.id}
            className={clsx(
              'flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 transition-colors group cursor-pointer',
              isCurrent ? 'bg-cec-blue/5' : 'hover:bg-stone-50'
            )}
            onClick={() => hasAudio && handleTrack(i)}
          >
            {/* Number / play */}
            <div className="w-7 text-center flex-shrink-0">
              {isCurrent ? (
                <button
                  className="text-cec-gold"
                  onClick={(e) => { e.stopPropagation(); toggle() }}
                >
                  {isPlaying ? (
                    <Pause size={16} fill="currentColor" />
                  ) : (
                    <Play size={16} fill="currentColor" />
                  )}
                </button>
              ) : hasAudio ? (
                <>
                  <span className="text-gray-400 text-sm hidden sm:inline group-hover:hidden">
                    {track.track_number}
                  </span>
                  <Play size={14} className="text-cec-blue mx-auto sm:hidden group-hover:block" />
                </>
              ) : (
                <span className="text-gray-400 text-sm">
                  {track.track_number}
                </span>
              )}
            </div>

            {/* Title */}
            <div className="flex-1 min-w-0">
              <p className={clsx('text-sm font-medium truncate', isCurrent ? 'text-cec-blue' : 'text-gray-800')}>
                {track.title}
              </p>
              {track.play_count > 0 && (
                <p className="text-xs text-gray-400">{track.play_count} écoute{track.play_count > 1 ? 's' : ''}</p>
              )}
            </div>

            {/* Duration + actions */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {track.youtube_url && (
                <a
                  href={track.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Voir sur YouTube"
                >
                  <ExternalLink size={14} />
                </a>
              )}
              {track.audio_url && (
                <a
                  href={track.audio_url}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="text-gray-400 hover:text-cec-blue transition-colors"
                  title="Télécharger"
                >
                  <Download size={14} />
                </a>
              )}
              <span className="text-xs text-gray-400 font-mono w-10 text-right">
                {track.formatted_duration}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
