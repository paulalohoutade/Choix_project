import { useQuery, useMutation } from '@tanstack/react-query'
import {
  albumsApi, eventsApi, postsApi, galleryApi, membersApi, settingsApi,
  adminAlbumsApi, adminTracksApi, adminEventsApi, adminPostsApi,
  adminGalleryApi, adminMembersApi, adminContactsApi,
  adminSettingsApi, adminDashboardApi, authApi,
} from '../lib/api'

// ── PUBLIC ─────────────────────────────────────────────────────────────────

export function useAlbums() {
  return useQuery({ queryKey: ['albums'], queryFn: () => albumsApi.list().then(r => r.data) })
}

export function useFeaturedAlbum() {
  return useQuery({ queryKey: ['album', 'featured'], queryFn: () => albumsApi.featured().then(r => r.data) })
}

export function useAlbum(slug: string) {
  return useQuery({
    queryKey: ['album', slug],
    queryFn: () => albumsApi.show(slug).then(r => r.data),
    enabled: !!slug,
  })
}

export function useAlbumTracks(slug: string) {
  return useQuery({
    queryKey: ['album-tracks', slug],
    queryFn: () => albumsApi.tracks(slug).then(r => r.data),
    enabled: !!slug,
  })
}

export function useEvents(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['events', params],
    queryFn: () => eventsApi.list(params).then(r => r.data),
  })
}

export function useUpcomingEvents() {
  return useQuery({ queryKey: ['events', 'upcoming'], queryFn: () => eventsApi.upcoming().then(r => r.data) })
}

export function useRecentPastEvents() {
  return useQuery({ queryKey: ['events', 'past'], queryFn: () => eventsApi.past().then(r => r.data) })
}

export function useEvent(slug: string) {
  return useQuery({
    queryKey: ['event', slug],
    queryFn: () => eventsApi.show(slug).then(r => r.data),
    enabled: !!slug,
  })
}

export function usePosts(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: () => postsApi.list(params).then(r => r.data),
  })
}

export function usePost(slug: string) {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: () => postsApi.show(slug).then(r => r.data),
    enabled: !!slug,
  })
}

export function useGallery(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['gallery', params],
    queryFn: () => galleryApi.list(params).then(r => r.data),
  })
}

export function useMembers() {
  return useQuery({ queryKey: ['members'], queryFn: () => membersApi.list().then(r => r.data) })
}

export function usePublicSettings() {
  return useQuery({
    queryKey: ['settings-public'],
    queryFn: () => settingsApi.public().then(r => r.data),
    staleTime: 1000 * 60 * 30,
  })
}

// ── AUTH ───────────────────────────────────────────────────────────────────

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => authApi.me().then(r => {
      const d = r.data
      if (!d || typeof d !== 'object' || !d.id || !d.email) {
        throw new Error('Session invalide')
      }
      return d
    }),
    retry: false,
    staleTime: 0,
    gcTime: 0,
    enabled: !!localStorage.getItem('cec_token'),
  })
}

// ── ADMIN ──────────────────────────────────────────────────────────────────

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => adminDashboardApi.stats().then(r => r.data),
    refetchInterval: 30_000,
  })
}

export function useAdminAlbums(params?: Record<string, unknown>) {
  return useQuery({ queryKey: params ? ['admin-albums', params] : ['admin-albums'], queryFn: () => adminAlbumsApi.list(params).then(r => r.data) })
}

export function useAdminAlbum(id: number) {
  return useQuery({ queryKey: ['admin-album', id], queryFn: () => adminAlbumsApi.show(id).then(r => r.data), enabled: !!id })
}

export function useAdminAlbumMutations() {
  const create = useMutation({ mutationFn: (d: unknown) => adminAlbumsApi.create(d) })
  const update = useMutation({ mutationFn: ({ id, data }: { id: number; data: unknown }) => adminAlbumsApi.update(id, data) })
  const remove = useMutation({ mutationFn: (id: number) => adminAlbumsApi.delete(id) })
  const toggleFeatured = useMutation({ mutationFn: (id: number) => adminAlbumsApi.toggleFeatured(id) })
  const uploadCover = useMutation({ mutationFn: ({ id, file }: { id: number; file: File }) => adminAlbumsApi.uploadCover(id, file) })

  return { create, update, remove, toggleFeatured, uploadCover }
}

export function useAdminTracks(params?: Record<string, unknown>) {
  return useQuery({ queryKey: params ? ['admin-tracks', params] : ['admin-tracks'], queryFn: () => adminTracksApi.list(params).then(r => r.data) })
}

export function useAdminTrackMutations() {
  const create = useMutation({ mutationFn: (d: unknown) => adminTracksApi.create(d) })
  const update = useMutation({ mutationFn: ({ id, data }: { id: number; data: unknown }) => adminTracksApi.update(id, data) })
  const remove = useMutation({ mutationFn: (id: number) => adminTracksApi.delete(id) })
  const uploadAudio = useMutation({ mutationFn: ({ id, file }: { id: number; file: File }) => adminTracksApi.uploadAudio(id, file) })

  return { create, update, remove, uploadAudio }
}

export function useAdminEvents(params?: Record<string, unknown>) {
  return useQuery({ queryKey: params ? ['admin-events', params] : ['admin-events'], queryFn: () => adminEventsApi.list(params).then(r => r.data) })
}

export function useAdminEventMutations() {
  const create = useMutation({ mutationFn: (d: unknown) => adminEventsApi.create(d) })
  const update = useMutation({ mutationFn: ({ id, data }: { id: number; data: unknown }) => adminEventsApi.update(id, data) })
  const remove = useMutation({ mutationFn: (id: number) => adminEventsApi.delete(id) })

  return { create, update, remove }
}

export function useAdminPosts(params?: Record<string, unknown>) {
  return useQuery({ queryKey: params ? ['admin-posts', params] : ['admin-posts'], queryFn: () => adminPostsApi.list(params).then(r => r.data) })
}

export function useAdminPostMutations() {
  const create = useMutation({ mutationFn: (d: unknown) => adminPostsApi.create(d) })
  const update = useMutation({ mutationFn: ({ id, data }: { id: number; data: unknown }) => adminPostsApi.update(id, data) })
  const remove = useMutation({ mutationFn: (id: number) => adminPostsApi.delete(id) })
  const publish = useMutation({ mutationFn: (id: number) => adminPostsApi.publish(id) })

  return { create, update, remove, publish }
}

export function useAdminGallery(params?: Record<string, unknown>) {
  return useQuery({ queryKey: params ? ['admin-gallery', params] : ['admin-gallery'], queryFn: () => adminGalleryApi.list(params).then(r => r.data) })
}

export function useAdminGalleryMutations() {
  const upload = useMutation({ mutationFn: ({ file, data }: { file: File; data: Record<string, string> }) => adminGalleryApi.upload(file, data) })
  const update = useMutation({ mutationFn: ({ id, data }: { id: number; data: unknown }) => adminGalleryApi.update(id, data) })
  const remove = useMutation({ mutationFn: (id: number) => adminGalleryApi.delete(id) })

  return { upload, update, remove }
}

export function useAdminMembers() {
  return useQuery({ queryKey: ['admin-members'], queryFn: () => adminMembersApi.list().then(r => r.data) })
}

export function useAdminMemberMutations() {
  const create = useMutation({ mutationFn: (d: unknown) => adminMembersApi.create(d) })
  const update = useMutation({ mutationFn: ({ id, data }: { id: number; data: unknown }) => adminMembersApi.update(id, data) })
  const remove = useMutation({ mutationFn: (id: number) => adminMembersApi.delete(id) })
  const uploadPhoto = useMutation({ mutationFn: ({ id, file }: { id: number; file: File }) => adminMembersApi.uploadPhoto(id, file) })

  return { create, update, remove, uploadPhoto }
}

export function useAdminContacts(params?: Record<string, unknown>) {
  return useQuery({ queryKey: params ? ['admin-contacts', params] : ['admin-contacts'], queryFn: () => adminContactsApi.list(params).then(r => r.data) })
}

export function useAdminContactMutations() {
  const markAsRead = useMutation({ mutationFn: (id: number) => adminContactsApi.markAsRead(id) })
  const remove = useMutation({ mutationFn: (id: number) => adminContactsApi.delete(id) })

  return { markAsRead, remove }
}

export function useAdminSettings() {
  return useQuery({ queryKey: ['admin-settings'], queryFn: () => adminSettingsApi.get().then(r => r.data) })
}

export function useAdminSettingsMutation() {
  return useMutation({
    mutationFn: (data: unknown) => adminSettingsApi.update(data),
  })
}
