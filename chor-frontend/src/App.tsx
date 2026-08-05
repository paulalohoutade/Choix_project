import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AudioPlayer from '@/components/layout/AudioPlayer'
import Home from '@/pages/Home'
import Albums from '@/pages/Albums'
import AlbumDetail from '@/pages/AlbumDetail'
import Events from '@/pages/Events'
import EventDetail from '@/pages/EventDetail'
import Blog from '@/pages/Blog'
import PostDetail from '@/pages/PostDetail'
import Gallery from '@/pages/Gallery'
import Members from '@/pages/Members'
import Contact from '@/pages/Contact'
import APropos from '@/pages/APropos'
import AdminLogin from '@/pages/admin/Login'
import ResetPassword from '@/pages/admin/ResetPassword'
import Dashboard from '@/pages/admin/Dashboard'
import AdminAlbums from '@/pages/admin/AlbumsManager'
import AdminEvents from '@/pages/admin/EventsManager'
import AdminPosts from '@/pages/admin/PostsManager'
import AdminGallery from '@/pages/admin/GalleryManager'
import AdminMembers from '@/pages/admin/MembersManager'
import AdminContacts from '@/pages/admin/ContactsManager'
import AdminSettings from '@/pages/admin/Settings'
import ProtectedRoute from '@/components/layout/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Pages publiques ── */}
        <Route
          path="/*"
          element={
            <>
              <Header />
              <main className="pb-24">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/albums" element={<Albums />} />
                  <Route path="/albums/:slug" element={<AlbumDetail />} />
                  <Route path="/evenements" element={<Events />} />
                  <Route path="/evenements/:slug" element={<EventDetail />} />
                  <Route path="/actualites" element={<Blog />} />
                  <Route path="/actualites/:slug" element={<PostDetail />} />
                  <Route path="/galerie" element={<Gallery />} />
                  <Route path="/membres" element={<Members />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/apropos" element={<APropos />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
              <AudioPlayer />
            </>
          }
        />

        {/* ── Pages admin ── */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/reset-password" element={<ResetPassword />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route path="albums" element={<AdminAlbums />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="posts" element={<AdminPosts />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="members" element={<AdminMembers />} />
          <Route path="contacts" element={<AdminContacts />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
