import { create } from 'zustand'
import { Howl } from 'howler'
import type { Track } from '../types'
import { tracksApi } from '../lib/api'

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

export const usePlayerStore = create<PlayerState>((set, get) => ({
  queue: [],
  currentIndex: 0,
  isPlaying: false,
  progress: 0,
  duration: 0,
  volume: 0.8,
  _howl: null,

  loadQueue(tracks, startIndex = 0) {
    const { _howl } = get()
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

    const howl = new Howl({
      src: [src],
      html5: true,
      volume,
      onplay() {
        tracksApi.incrementPlay(track.id).catch(() => {})
        const tick = () => {
          const dur = howl.duration() || 0
          const seek = howl.seek() as number || 0
          set({ progress: dur ? seek / dur : 0, duration: dur })
          _raf = requestAnimationFrame(tick)
        }
        tick()
      },
      onend() { stopRaf(); get().next() },
      onstop() { stopRaf(); set({ progress: 0, isPlaying: false }) },
      onloaderror() { set({ isPlaying: false }) },
    })

    howl.play()
    set({ _howl: howl, currentIndex: idx, isPlaying: true })
  },

  toggle() {
    const { isPlaying, _howl } = get()
    if (!_howl) { get().play(); return }
    if (isPlaying) { _howl.pause(); stopRaf(); set({ isPlaying: false }) }
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
