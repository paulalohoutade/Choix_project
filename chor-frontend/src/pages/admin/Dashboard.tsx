import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Disc3, CalendarDays, Newspaper, Images,
  Users, Mail, Gift, Settings, LogOut, Menu, X, Music,
  ChevronRight,
} from 'lucide-react'
import { authApi } from '@/lib/api'
import { useDashboardStats } from '@/hooks'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const navItems = [
  { to: '/admin/albums',    icon: Disc3,          label: 'Albums & Pistes' },
  { to: '/admin/events',    icon: CalendarDays,   label: 'Événements' },
  { to: '/admin/posts',     icon: Newspaper,      label: 'Actualités' },
  { to: '/admin/gallery',   icon: Images,         label: 'Galerie' },
  { to: '/admin/members',   icon: Users,          label: 'Membres' },
  { to: '/admin/contacts',  icon: Mail,           label: 'Messages' },
  { to: '/admin/donations', icon: Gift,           label: 'Dons' },
  { to: '/admin/settings',  icon: Settings,       label: 'Paramètres' },
]

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const { data: stats } = useDashboardStats()

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } catch { /* ignore */ }
    localStorage.removeItem('cec_token')
    toast.success('Déconnecté.')
    navigate('/admin/login')
  }

  const sidebar = (
    <aside className="flex flex-col h-full bg-cec-dark text-white w-64">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-full bg-cec-gold flex items-center justify-center">
          <Music size={18} className="text-cec-blue" />
        </div>
        <div>
          <p className="font-display font-bold text-sm">Chorale CEC</p>
          <p className="text-white/40 text-xs">Administration</p>
        </div>
      </div>

      {/* Stats mini */}
      {stats && (
        <div className="px-4 py-3 border-b border-white/10 grid grid-cols-2 gap-2">
          <div className="bg-white/5 rounded-lg px-3 py-2">
            <p className="text-white/50 text-xs">Albums</p>
            <p className="text-cec-gold font-bold">{stats.albums}</p>
          </div>
          <div className="bg-white/5 rounded-lg px-3 py-2">
            <p className="text-white/50 text-xs">Messages</p>
            <p className={clsx('font-bold', stats.unread_contacts > 0 ? 'text-red-400' : 'text-white')}>
              {stats.unread_contacts}
            </p>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-cec-gold/20 text-cec-gold'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              )
            }
          >
            <Icon size={17} />
            <span className="flex-1">{label}</span>
            {to === '/admin/contacts' && stats?.unread_contacts ? (
              <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                {stats.unread_contacts}
              </span>
            ) : null}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-white/10 px-3 py-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/50
                     hover:bg-red-500/10 hover:text-red-400 transition-colors w-full"
        >
          <LogOut size={17} />
          Se déconnecter
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col w-64 flex-shrink-0">
        {sidebar}
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex flex-col w-64">
            {sidebar}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar (mobile) */}
        <div className="md:hidden bg-white border-b border-stone-200 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600">
            <Menu size={22} />
          </button>
          <p className="font-semibold text-cec-blue">Admin — Chorale CEC</p>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

// ── Shared admin components ────────────────────────────────────────────────
export function AdminPageHeader({
  title, subtitle, action
}: {
  title: string
  subtitle?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-cec-blue">{title}</h1>
        {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function AdminTable({
  headers, children, empty
}: {
  headers: string[]
  children: React.ReactNode
  empty?: string
}) {
  return (
    <div className="bg-white rounded-xl shadow-cec overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 border-b border-stone-100">
            <tr>
              {headers.map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">{children}</tbody>
        </table>
      </div>
      {!children && empty && (
        <p className="text-center text-gray-400 py-10 text-sm">{empty}</p>
      )}
    </div>
  )
}
