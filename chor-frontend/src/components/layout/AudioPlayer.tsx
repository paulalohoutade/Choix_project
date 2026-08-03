import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, X } from 'lucide-react'
import { usePlayerStore, useCurrentTrack, useIsPlaying } from '@/store/playerStore'

export default function AudioPlayer() {
  const track = useCurrentTrack()
  if (!track) return null

  return <PlayerBar track={track} />
}

function PlayerBar({ track }: { track: NonNullable<ReturnType<typeof useCurrentTrack>> }) {
  const { toggle, next, prev, seekTo, progress, duration, volume, setVolume, clear } =
    usePlayerStore()
  const isPlaying = useIsPlaying()

  const fmt = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-cec-dark border-t-2 border-cec-gold
                    shadow-2xl px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        {/* Track info */}
        <div className="flex-1 min-w-0 hidden sm:block">
          <p className="text-white font-semibold text-sm truncate font-display">{track.title}</p>
          <p className="text-cec-gold text-xs truncate">{track.album?.title ?? ''}</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={prev}
            className="text-white/70 hover:text-cec-gold transition-colors"
            title="Précédent"
          >
            <SkipBack size={18} />
          </button>
          <button
            onClick={toggle}
            className="w-10 h-10 rounded-full bg-cec-gold text-cec-blue flex items-center
                       justify-center hover:bg-cec-gold-light transition-colors shadow-gold"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button
            onClick={next}
            className="text-white/70 hover:text-cec-gold transition-colors"
            title="Suivant"
          >
            <SkipForward size={18} />
          </button>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 flex-1 max-w-xs sm:max-w-sm lg:max-w-lg">
          <span className="text-white/50 text-xs font-mono w-10 text-right">
            {fmt(progress * duration)}
          </span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.001}
            value={progress}
            onChange={(e) => seekTo(Number(e.target.value))}
            className="flex-1 accent-cec-gold cursor-pointer"
          />
          <span className="text-white/50 text-xs font-mono w-10">{fmt(duration)}</span>
        </div>

        {/* Volume + close */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => setVolume(volume > 0 ? 0 : 0.8)}
            className="text-white/60 hover:text-white transition-colors"
          >
            {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-20 accent-cec-gold cursor-pointer"
          />
        </div>

        <button
          onClick={clear}
          className="text-white/40 hover:text-white transition-colors ml-1"
          title="Fermer"
        >
          <X size={16} />
        </button>
      </div>

      {/* Mobile track info */}
      <div className="sm:hidden mt-1.5 text-center">
        <p className="text-white text-xs truncate">{track.title}</p>
      </div>
    </div>
  )
}
