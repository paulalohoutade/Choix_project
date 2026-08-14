import { create } from 'zustand'
import { Howl } from 'howler'
import type { Track } from '../types'
import { tracksApi } from '../lib/api'
import { queryClient } from '../lib/queryClient'

interface PlayerState {
  queue: Track[]
  currentIndex: number
  isPlaying: boolean
  progress: number   // 0–1
  duration: number   // seconds
  volume: number     // 0–1
  _howl: Howl | null

  // Actions
  loadQueue: (tracks: Track[], startIndex?: number) => void
  toggle: () => void
  play: (index?: number) => void
  pause: () => void
  next: () => void
  prev: () => void
  seekTo: (ratio: number) => void
  setVolume: (v: number) => void
  clear: () => void
}

let _raf: number | null = null

function stopRaf() {
  if (_raf !== null) { cancelAnimationFrame(_raf); _raf = null }
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.round(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

// Met à jour la durée dans les caches React Query (albums / listes de pistes).
function patchDurationInCache(trackId: number, seconds: number, formatted: string) {
  const patch = (v: unknown): unknown => {
    if (Array.isArray(v)) {
      let changed = false
      const next = v.map((item) => {
        const p = patch(item)
        if (p !== item) changed = true
        return p
      })
      return changed ? next : v
    }
    if (v && typeof v === 'object') {
      const rec = v as Record<string, unknown>
      let changed = false
      const next: Record<string, unknown> = {}
      for (const k of Object.keys(rec)) {
        const p = patch(rec[k])
        if (p !== rec[k]) changed = true
        next[k] = p
      }
      if (rec.id === trackId) {
        next.duration_seconds = seconds
        next.formatted_duration = formatted
        changed = true
      }
      return changed ? next : v
    }
    return v
  }

  queryClient.getQueryCache().findAll().forEach(({ queryKey }) => {
    const first = queryKey[0]
    if (typeof first === 'string' && (first === 'album' || first === 'album-tracks' || first === 'admin-album')) {
      queryClient.setQueryData(queryKey, patch(queryClient.getQueryData(queryKey)))
    }
  })
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  queue: [],
  currentIndex: 0,
  isPlaying: false,
  progress: 0,
  duration: 0,
  volume: 0.8,
  _howl: null,

  loadQueue(tracks, startIndex = 0) {
    const { queue, currentIndex, _howl } = get()

    // Même liste de pistes déjà chargée → on ne repart pas de zéro.
    const sameQueue =
      queue.length === tracks.length &&
      queue.every((t, i) => t.id === tracks[i]?.id)

    if (sameQueue && _howl) {
      if (startIndex === currentIndex) {
        get().toggle()
      } else {
        get().play(startIndex)
      }
      return
    }

    if (_howl) { _howl.stop(); _howl.unload() }
    stopRaf()
    set({ queue: tracks, currentIndex: startIndex, isPlaying: false, progress: 0, duration: 0, _howl: null })
    get().play(startIndex)
  },

  play(index) {
    const { queue, volume, _howl: old } = get()
    const idx = index ?? get().currentIndex
    const track = queue[idx]
    if (!track) return

    const src = track.audio_url ?? track.primary_source
    if (!src || track.source_type !== 'local') {
      // YouTube / SoundCloud → ouvrir dans un nouvel onglet
      if (track.youtube_url) window.open(track.youtube_url, '_blank')
      return
    }

    if (old) { old.stop(); old.unload() }
    stopRaf()

    let durationSaved = false

    const howl = new Howl({
      src: [src],
      html5: true,
      volume,
      onplay() {
        tracksApi.incrementPlay(track.id).catch(() => {})
        set({ isPlaying: true })
        const tick = () => {
          const dur = howl.duration() || 0
          const seek = howl.seek() as number || 0
          set({ progress: dur ? seek / dur : 0, duration: dur })

          // Extraction de la durée réelle du fichier audio
          if (!durationSaved && dur > 0) {
            durationSaved = true
            const seconds = Math.round(dur)
            const formatted = formatDuration(seconds)
            if (track.duration_seconds !== seconds) {
              tracksApi.setDuration(track.id, seconds).catch(() => {})
              set((state) => ({
                queue: state.queue.map((t) =>
                  t.id === track.id
                    ? { ...t, duration_seconds: seconds, formatted_duration: formatted }
                    : t
                ),
              }))
              patchDurationInCache(track.id, seconds, formatted)
            }
          }
          _raf = requestAnimationFrame(tick)
        }
        tick()
      },
      onpause() { stopRaf(); set({ isPlaying: false }) },
      onstop() { stopRaf(); set({ progress: 0, isPlaying: false }) },
      onend() { stopRaf(); get().next() },
      onloaderror() { set({ isPlaying: false }) },
    })

    set({ _howl: howl, currentIndex: idx, isPlaying: false })
    howl.play()
  },

  toggle() {
    const { isPlaying, _howl } = get()
    if (!_howl) { get().play(); return }
    if (isPlaying) { _howl.pause(); set({ isPlaying: false }) }
    else { _howl.play(); set({ isPlaying: true }) }
  },

  pause() {
    const { _howl } = get()
    if (_howl) { _howl.pause(); stopRaf(); set({ isPlaying: false }) }
  },

  next() {
    const { queue, currentIndex } = get()
    const next = (currentIndex + 1) % queue.length
    get().play(next)
  },

  prev() {
    const { currentIndex, _howl } = get()
    const seek = _howl ? (_howl.seek() as number) : 0
    if (seek > 3) { _howl?.seek(0); return }
    const prev = currentIndex === 0 ? 0 : currentIndex - 1
    get().play(prev)
  },

  seekTo(ratio) {
    const { _howl, duration } = get()
    if (_howl && duration) { _howl.seek(ratio * duration); set({ progress: ratio }) }
  },

  setVolume(v) {
    const { _howl } = get()
    if (_howl) _howl.volume(v)
    set({ volume: v })
  },

  clear() {
    const { _howl } = get()
    if (_howl) { _howl.stop(); _howl.unload() }
    stopRaf()
    set({ queue: [], currentIndex: 0, isPlaying: false, progress: 0, duration: 0, _howl: null })
  },
}))

// Sélecteurs pratiques
export const useCurrentTrack = () =>
  usePlayerStore((s) => s.queue[s.currentIndex] ?? null)

export const useIsPlaying = () => usePlayerStore((s) => s.isPlaying)
