import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, Music } from 'lucide-react'
import clsx from 'clsx'

const links = [
  { to: '/', label: 'Accueil' },
  { to: '/albums', label: 'Musique' },
  { to: '/evenements', label: 'Événements' },
  { to: '/actualites', label: 'Actualités' },
  { to: '/galerie', label: 'Galerie' },
  { to: '/membres', label: 'Membres' },
  { to: '/apropos', label: 'À propos' },
  { to: '/contact', label: 'Contact' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <header
      className={clsx(
        'sticky top-0 z-40 transition-all duration-300',
        isHome
          ? 'bg-cec-blue/95 backdrop-blur-md border-b border-cec-gold/30'
          : 'bg-cec-blue shadow-md'
      )}
    >
      {/* Remplacement de max-w-7xl mx-auto par w-full pour occuper tout l'écran */}
      <div className="w-full px-4 sm:px-6">
        <div className="flex items-center justify-between h-16"> {/* Remonté à h-16 pour laisser respirer le grand logo */}

          {/* Logo — aligné complètement à gauche */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            {/* Taille ajustée à w-10 h-10 pour être discret mais propre */}
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0
                            group-hover:scale-105 transition-transform">
              <img
                src="/logo.png"
                alt="Logo Chorale Hefzibah"
                className="w-full h-full object-contain"
                onError={(e) => {
                  const t = e.currentTarget
                  t.style.display = 'none'
                  const fallback = t.nextElementSibling as HTMLElement
                  if (fallback) fallback.style.display = 'flex'
                }}
              />
              {/* Fallback si logo.png absent */}
              <div className="w-full h-full bg-cec-gold items-center justify-center hidden">
                <Music size={16} className="text-cec-blue" />
              </div>
            </div>
            <div className="leading-tight">
              <span className="font-display font-bold text-white text-base tracking-tight block">
                Chorale Hefzibah
              </span>
              {/* text-yellow-400 pour un jaune pur et taille text-[10px] */}
              <span className="text-yellow-400 text-[10px] tracking-widest uppercase">
                Kouti Kpinlè Centre
              </span>
            </div>
          </Link>

          {/* Desktop nav — Alignée à droite */}
          <nav className="hidden lg:flex items-center gap-1 h-full">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  clsx(
                    'relative px-3 py-5 text-sm font-semibold tracking-wide font-body transition-colors duration-150',
                    'after:absolute after:top-0 after:left-0 after:right-0 after:h-[4px] after:rounded-b after:transition-all after:duration-150',
                    isActive
                      ? 'text-white after:bg-yellow-400 bg-white/5'
                      : 'text-white hover:text-yellow-400 after:bg-transparent'
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile burger */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden text-white p-2"
            aria-label="Menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer mobile — glisse depuis la gauche */}
      <div
        className={clsx(
          'fixed inset-y-0 left-0 z-50 w-72 bg-stone-100 border-r border-stone-200 lg:hidden',
          'flex flex-col',
          'transition-transform duration-300',
          open ? 'translate-x-0' : '-translate-x-full pointer-events-none'
        )}
      >
        <div className="flex items-center justify-end px-5 h-16 border-b border-stone-200">
          <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-800 p-1" aria-label="Fermer">
            <X size={22} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                clsx(
                  'block px-4 py-3 text-sm font-semibold font-body transition-colors border-l-[4px]',
                  isActive
                    ? 'text-gray-900 border-stone-400 bg-stone-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-stone-200 border-transparent'
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}