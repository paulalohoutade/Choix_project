import { Link } from 'react-router-dom'
import { Play, ChevronRight, Music, CalendarDays, Newspaper } from 'lucide-react'
import { useFeaturedAlbum, useUpcomingEvents, usePosts } from '@/hooks'
import { usePlayerStore } from '@/store/playerStore'
import AlbumCard from '@/components/albums/AlbumCard'
import EventCard from '@/components/events/EventCard'
import type { Event, Post } from '@/types'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

// ── HeroSection ────────────────────────────────────────────────────────────
// Textes qui défilent en boucle
const SCROLLING_PHRASES = [
  'La Musique au Service de Dieu',
  'Louange & Adoration',
  'Christianisme Céleste',
  'Unis dans la Prière et le Chant',
  'Chorale Hefzibah — Depuis toujours pour Dieu',
 ]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-screen flex flex-col items-center justify-center">

      {/* ── Vidéo de fond ────────────────────────────────────────────────── */}
      {/*
        INSTRUCTIONS :
        1. Mets ta vidéo dans le dossier public/ sous le nom "hero.mp4"
        2. Taille recommandée : 1280×720 ou 1920×1080, durée 10-30 secondes
        3. Formats acceptés : .mp4 (H.264) — compatible tous navigateurs
        4. Si tu n'as pas de vidéo, le fallback bleu foncé s'affiche automatiquement
      */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        poster="/hero-poster.jpg"   /* image affichée avant le chargement vidéo */
      />

      {/* Calque sombre sur la vidéo pour lisibilité du texte */}
      <div className="absolute inset-0 bg-cec-dark/60" />

      {/* Dégradé doré subtil en haut */}
      <div className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(250,204,21,0.08) 0%, transparent 40%, rgba(15,34,54,0.5) 100%)'
        }}
      />

      {/* ── Contenu centré ───────────────────────────────────────────────── */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center px-4 py-24 text-center">

        {/* Logo — mb-3 appliqué ici pour rapprocher le texte */}
        <div className="mb-3">
          <img
            src="/logo.png"
            alt="Logo Chorale CEC"
            className="w-44 h-44 object-contain mx-auto drop-shadow-2xl"
            onError={(e) => {
              // Si logo.png n'existe pas encore, affiche un placeholder
              const t = e.currentTarget
              t.style.display = 'none'
              const placeholder = t.nextElementSibling as HTMLElement
              if (placeholder) placeholder.style.display = 'flex'
            }}
          />
          {/* Placeholder également ajusté */}
          <div
            className="w-44 h-44 rounded-full bg-white/10 border-2 border-cec-gold/60
                       items-center justify-center mx-auto hidden"
          >
            <Music size={72} className="text-cec-gold" />
          </div>
        </div>

        {/* Nom de la chorale */}
        <p className="text-cec-gold text-[11px] font-bold uppercase tracking-[0.3em] mb-3">
          Église du Christianisme Céleste <br /><br /> Paroisse BEULAH Kouti Kpinlè Centre
        </p>

        <h1 className="font-display text-5xl sm:text-6xl lg:text-6xl font-bold text-white
               leading-tight mb-4 drop-shadow-lg italic">
          Chorale <span className="text-yellow-400">Hefzibah "Plaisir de Dieu"</span>
        </h1>

        {/* ── Texte défilant ───────────────────────────────────────────── */}
        <div className="overflow-hidden h-8 sm:h-10 mb-10 w-full max-w-2xl">
          <div className="animate-scroll-phrases">
            {[...SCROLLING_PHRASES, ...SCROLLING_PHRASES].map((phrase, i) => (
              <p
                key={i}
                className="h-8 sm:h-10 flex items-center justify-center
                           text-white/80 text-base sm:text-lg font-body italic"
              >
                {phrase}
              </p>
            ))}
          </div>
        </div>

        {/* Boutons CTA */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/albums"
            className="bg-cec-gold text-cec-blue font-bold px-8 py-4 rounded-full
                       hover:bg-cec-gold-light transition-colors flex items-center gap-2
                       text-base shadow-gold"
          >
            <Play size={18} fill="currentColor" />
            Écouter nos albums
          </Link>
          <Link
            to="/evenements"
            className="border-2 border-white/50 text-white font-semibold px-8 py-4 rounded-full
                       hover:border-cec-gold hover:text-cec-gold transition-all text-base"
          >
            Voir les événements
          </Link>
        </div>
      </div>

      {/* Flèche scroll vers le bas */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center pt-2">
          <div className="w-1 h-2.5 bg-white/60 rounded-full" />
        </div>
      </div>
    </section>
  )
}

// ── FeaturedAlbum ──────────────────────────────────────────────────────────
export function FeaturedAlbum() {
  const { data: album, isLoading } = useFeaturedAlbum()
  const { loadQueue } = usePlayerStore()

  if (isLoading) return (
    <section className="bg-cec-blue py-16 px-4">
      <div className="max-w-4xl mx-auto flex gap-8 animate-pulse">
        <div className="w-48 h-48 bg-white/10 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-4 pt-4">
          <div className="h-4 bg-white/10 rounded w-24" />
          <div className="h-8 bg-white/20 rounded w-2/3" />
          <div className="h-4 bg-white/10 rounded w-32" />
        </div>
      </div>
    </section>
  )

  if (!album) return null

  return (
    <section className="bg-cec-blue py-16 px-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-cec-gold/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="max-w-4xl mx-auto relative">
        <p className="text-cec-gold/70 text-sm uppercase tracking-widest font-semibold mb-6">
          Album vedette
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-8">
          {/* Cover */}
          <div className="w-48 h-48 rounded-xl overflow-hidden shadow-gold flex-shrink-0">
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
            <h2 className="font-display text-3xl font-bold text-white mb-1">{album.title}</h2>
            <p className="text-cec-gold/70 mb-4">{album.release_year}</p>
            {album.description && (
              <p className="text-white/60 text-sm mb-6 line-clamp-2">{album.description}</p>
            )}
            <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
              {album.tracks && album.tracks.length > 0 && (
                <button
                  onClick={() => loadQueue(album.tracks!, 0)}
                  className="bg-cec-gold text-cec-blue font-bold px-6 py-2.5 rounded-full
                             hover:bg-cec-gold-light transition-colors flex items-center gap-2"
                >
                  <Play size={16} fill="currentColor" />
                  Écouter l'album
                </button>
              )}
              <Link
                to={`/albums/${album.slug}`}
                className="border border-white/30 text-white px-6 py-2.5 rounded-full
                           hover:bg-white/10 transition-colors text-sm"
              >
                Voir les titres
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── UpcomingEvents ─────────────────────────────────────────────────────────
export function UpcomingEvents() {
  const { data: events, isLoading } = useUpcomingEvents()
  const list = Array.isArray(events) ? events.slice(0, 3) : (events?.data ?? []).slice(0, 3)

  if (isLoading) return null
  if (!list.length) return null

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-cec-gold mb-2">
            <CalendarDays size={18} />
            <span className="text-sm font-semibold uppercase tracking-widest">Agenda</span>
          </div>
          <h2 className="section-title">Prochains Événements</h2>
        </div>
        <Link to="/evenements" className="text-cec-blue text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
          Voir tout <ChevronRight size={16} />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((ev: Event) => <EventCard key={ev.id} event={ev} />)}
      </div>
    </section>
  )
}

// ── LatestPosts ────────────────────────────────────────────────────────────
export function LatestPosts() {
  const { data } = usePosts()
  const posts: Post[] = (data?.data ?? []).slice(0, 3)

  if (!posts.length) return null

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-cec-gold mb-2">
              <Newspaper size={18} />
              <span className="text-sm font-semibold uppercase tracking-widest">Blog</span>
            </div>
            <h2 className="section-title">Dernières Actualités</h2>
          </div>
          <Link to="/actualites" className="text-cec-blue text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            Voir tout <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/actualites/${post.slug}`}
              className="group block bg-stone-50 rounded-xl overflow-hidden hover:shadow-gold transition-all"
            >
              {post.cover_url && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.cover_url}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-5">
                {post.category && (
                  <span className="text-xs font-bold text-cec-gold uppercase tracking-widest">
                    {post.category}
                  </span>
                )}
                <h3 className="font-display font-bold text-cec-blue mt-1.5 mb-2 group-hover:text-cec-blue-light">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>
                )}
                {post.published_at && (
                  <p className="text-xs text-gray-400 mt-3">
                    {format(new Date(post.published_at), 'PP', { locale: fr })}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}