import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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
    queryFn: () => authApi.me().then(r => r.data),
    retry: false,
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
  return useQuery({ queryKey: ['admin-albums', params], queryFn: () => adminAlbumsApi.list(params).then(r => r.data) })
}

export function useAdminAlbum(id: number) {
  return useQuery({ queryKey: ['admin-album', id], queryFn: () => adminAlbumsApi.show(id).then(r => r.data), enabled: !!id })
}

export function useAdminAlbumMutations() {
  const qc = useQueryClient()
  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin-albums'] })

  const create = useMutation({ mutationFn: (d: unknown) => adminAlbumsApi.create(d), onSuccess: invalidate })
  const update = useMutation({ mutationFn: ({ id, data }: { id: number; data: unknown }) => adminAlbumsApi.update(id, data), onSuccess: invalidate })
  const remove = useMutation({ mutationFn: (id: number) => adminAlbumsApi.delete(id), onSuccess: invalidate })
  const toggleFeatured = useMutation({ mutationFn: (id: number) => adminAlbumsApi.toggleFeatured(id), onSuccess: invalidate })
  const uploadCover = useMutation({ mutationFn: ({ id, file }: { id: number; file: File }) => adminAlbumsApi.uploadCover(id, file), onSuccess: invalidate })

  return { create, update, remove, toggleFeatured, uploadCover }
}

export function useAdminTracks(params?: Record<string, unknown>) {
  return useQuery({ queryKey: ['admin-tracks', params], queryFn: () => adminTracksApi.list(params).then(r => r.data) })
}

export function useAdminTrackMutations() {
  const qc = useQueryClient()
  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin-tracks'] })

  const create = useMutation({ mutationFn: (d: unknown) => adminTracksApi.create(d), onSuccess: invalidate })
  const update = useMutation({ mutationFn: ({ id, data }: { id: number; data: unknown }) => adminTracksApi.update(id, data), onSuccess: invalidate })
  const remove = useMutation({ mutationFn: (id: number) => adminTracksApi.delete(id), onSuccess: invalidate })
  const uploadAudio = useMutation({ mutationFn: ({ id, file }: { id: number; file: File }) => adminTracksApi.uploadAudio(id, file), onSuccess: invalidate })

  return { create, update, remove, uploadAudio }
}

export function useAdminEvents(params?: Record<string, unknown>) {
  return useQuery({ queryKey: ['admin-events', params], queryFn: () => adminEventsApi.list(params).then(r => r.data) })
}

export function useAdminEventMutations() {
  const qc = useQueryClient()
  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin-events'] })

  const create = useMutation({ mutationFn: (d: unknown) => adminEventsApi.create(d), onSuccess: invalidate })
  const update = useMutation({ mutationFn: ({ id, data }: { id: number; data: unknown }) => adminEventsApi.update(id, data), onSuccess: invalidate })
  const remove = useMutation({ mutationFn: (id: number) => adminEventsApi.delete(id), onSuccess: invalidate })

  return { create, update, remove }
}

export function useAdminPosts(params?: Record<string, unknown>) {
  return useQuery({ queryKey: ['admin-posts', params], queryFn: () => adminPostsApi.list(params).then(r => r.data) })
}

export function useAdminPostMutations() {
  const qc = useQueryClient()
  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin-posts'] })

  const create = useMutation({ mutationFn: (d: unknown) => adminPostsApi.create(d), onSuccess: invalidate })
  const update = useMutation({ mutationFn: ({ id, data }: { id: number; data: unknown }) => adminPostsApi.update(id, data), onSuccess: invalidate })
  const remove = useMutation({ mutationFn: (id: number) => adminPostsApi.delete(id), onSuccess: invalidate })
  const publish = useMutation({ mutationFn: (id: number) => adminPostsApi.publish(id), onSuccess: invalidate })

  return { create, update, remove, publish }
}

export function useAdminGallery(params?: Record<string, unknown>) {
  return useQuery({ queryKey: ['admin-gallery', params], queryFn: () => adminGalleryApi.list(params).then(r => r.data) })
}

export function useAdminGalleryMutations() {
  const qc = useQueryClient()
  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin-gallery'] })

  const upload = useMutation({ mutationFn: ({ file, data }: { file: File; data: Record<string, string> }) => adminGalleryApi.upload(file, data), onSuccess: invalidate })
  const update = useMutation({ mutationFn: ({ id, data }: { id: number; data: unknown }) => adminGalleryApi.update(id, data), onSuccess: invalidate })
  const remove = useMutation({ mutationFn: (id: number) => adminGalleryApi.delete(id), onSuccess: invalidate })

  return { upload, update, remove }
}

export function useAdminMembers() {
  return useQuery({ queryKey: ['admin-members'], queryFn: () => adminMembersApi.list().then(r => r.data) })
}

export function useAdminMemberMutations() {
  const qc = useQueryClient()
  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin-members'] })

  const create = useMutation({ mutationFn: (d: unknown) => adminMembersApi.create(d), onSuccess: invalidate })
  const update = useMutation({ mutationFn: ({ id, data }: { id: number; data: unknown }) => adminMembersApi.update(id, data), onSuccess: invalidate })
  const remove = useMutation({ mutationFn: (id: number) => adminMembersApi.delete(id), onSuccess: invalidate })
  const uploadPhoto = useMutation({ mutationFn: ({ id, file }: { id: number; file: File }) => adminMembersApi.uploadPhoto(id, file), onSuccess: invalidate })

  return { create, update, remove, uploadPhoto }
}

export function useAdminContacts(params?: Record<string, unknown>) {
  return useQuery({ queryKey: ['admin-contacts', params], queryFn: () => adminContactsApi.list(params).then(r => r.data) })
}

export function useAdminContactMutations() {
  const qc = useQueryClient()
  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin-contacts'] })

  const markAsRead = useMutation({ mutationFn: (id: number) => adminContactsApi.markAsRead(id), onSuccess: invalidate })
  const remove = useMutation({ mutationFn: (id: number) => adminContactsApi.delete(id), onSuccess: invalidate })

  return { markAsRead, remove }
}

export function useAdminSettings() {
  return useQuery({ queryKey: ['admin-settings'], queryFn: () => adminSettingsApi.get().then(r => r.data) })
}

export function useAdminSettingsMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: unknown) => adminSettingsApi.update(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-settings'] }),
  })
}
