// ── Album ──────────────────────────────────────────────────────────────────
export interface Album {
  id: number
  title: string
  slug: string
  description?: string
  cover_image?: string
  cover_url?: string
  release_year: number
  is_featured: boolean
  status: 'draft' | 'published'
  tracks_count?: number
  tracks?: Track[]
  created_at: string
  updated_at: string
}

// ── Track ──────────────────────────────────────────────────────────────────
export interface Track {
  id: number
  album_id: number
  title: string
  slug: string
  track_number: number
  duration_seconds?: number
  audio_path?: string
  audio_url?: string
  youtube_url?: string
  soundcloud_url?: string
  lyrics?: string
  is_downloadable: boolean
  download_path?: string
  play_count: number
  formatted_duration: string
  source_type: 'local' | 'youtube' | 'soundcloud' | 'none'
  primary_source?: string
  album?: Album
  album_title?: string
  created_at: string
  updated_at: string
}

// ── Event ──────────────────────────────────────────────────────────────────
export interface Event {
  id: number
  title: string
  slug: string
  description?: string
  location?: string
  event_date: string
  end_date?: string
  cover_image?: string
  cover_url?: string
  type: string
  status: 'upcoming' | 'ongoing' | 'past' | 'cancelled'
  created_at: string
  updated_at: string
}

// ── Post ───────────────────────────────────────────────────────────────────
export interface Post {
  id: number
  user_id?: number
  title: string
  slug: string
  excerpt?: string
  body?: string
  cover_image?: string
  cover_url?: string
  category?: string
  status: 'draft' | 'published'
  published_at?: string
  author?: { id: number; name: string }
  created_at: string
  updated_at: string
}

// ── GalleryItem ────────────────────────────────────────────────────────────
export interface GalleryItem {
  id: number
  title?: string
  description?: string
  file_path?: string
  file_url?: string
  type: 'photo' | 'video'
  youtube_url?: string
  event_id?: number
  sort_order: number
  created_at: string
  updated_at: string
}

// ── Member ─────────────────────────────────────────────────────────────────
export interface Member {
  id: number
  name: string
  role?: string
  bio?: string
  photo?: string
  photo_url?: string
  is_leader: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

// ── Contact ────────────────────────────────────────────────────────────────
export interface Contact {
  id: number
  name: string
  email: string
  subject?: string
  message: string
  is_read: boolean
  created_at: string
  updated_at: string
}

// ── Setting ────────────────────────────────────────────────────────────────
export interface Setting {
  key: string
  value: string
}

// ── User ───────────────────────────────────────────────────────────────────
export interface User {
  id: number
  name: string
  email: string
  role: 'super_admin' | 'admin' | 'editor'
  created_at: string
  updated_at: string
}

// ── DashboardStats ─────────────────────────────────────────────────────────
export interface DashboardStats {
  albums: number
  tracks: number
  total_plays: number
  events_upcoming: number
  posts_published: number
  unread_contacts: number
}

// ── Paginated response ─────────────────────────────────────────────────────
export interface Paginated<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}
