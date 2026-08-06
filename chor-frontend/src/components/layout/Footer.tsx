import { Link } from 'react-router-dom'
import { Music } from 'lucide-react'

function FacebookLogo({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function YoutubeLogo({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path fill="currentColor" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

function InstagramLogo({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  )
}

function GmailLogo({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="1.5" y="3.5" width="21" height="17" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 7.5 8 15.5" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
      <path d="M8 15.5 12 8.5" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
      <path d="M12 8.5 16 15.5" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
      <path d="M16 15.5 20 7.5" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
    </svg>
  )
}

function WhatsAppLogo({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  )
}

function GoogleMapsLogo({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path fill="currentColor" fillRule="evenodd" d="M12 0C7.58 0 4 3.58 4 8c0 5.4 7.06 14.41 7.3 14.7.2.25.48.3.7.3s.5-.05.7-.3C12.94 22.41 20 13.4 20 8c0-4.42-3.58-8-8-8zM15.2 8a3.2 3.2 0 1 1-6.4 0 3.2 3.2 0 0 1 6.4 0z" />
    </svg>
  )
}

export default function Footer() {
  const socialLinks = [
    { icon: FacebookLogo, href: '#', label: 'Facebook' },
    { icon: YoutubeLogo, href: '#', label: 'Youtube' },
    { icon: InstagramLogo, href: '#', label: 'Instagram' },
  ]

  const navLinks = [
    { to: '/albums', label: 'Musique' },
    { to: '/evenements', label: 'Événements' },
    { to: '/actualites', label: 'Actualités' },
    { to: '/galerie', label: 'Galerie' },
    { to: '/membres', label: 'Membres' },
    { to: '/apropos', label: 'À propos' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <footer className="bg-cec-anthracite text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* Brand */}
          <div className="md:order-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
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
                <div className="w-full h-full bg-cec-gold items-center justify-center hidden">
                  <Music size={20} className="text-cec-blue" />
                </div>
              </div>
              <div>
                <p className="font-display font-bold text-white text-lg leading-tight">
                  Chorale Hefzibah
                </p>
                <p className="text-yellow-400/70 text-xs">Kouti Kpinlè Centre</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-white">
              Louange et adoration au service de l'Église du Christianisme Céleste.
            </p>
            <p className="text-white font-bold text-xs uppercase tracking-widest mt-8 mb-3 text-center">Suivez-nous sur</p>
            <div className="flex justify-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:border-cec-gold hover:text-cec-gold transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="md:order-1">
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-white hover:text-blue-600 hover:underline transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:order-3 md:justify-self-end">
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-white">
              <li className="flex items-center gap-2">
                <GmailLogo size={16} className="text-white shrink-0" />
                <a href="mailto:paulalohoutade7@gmail.com" className="hover:text-blue-600 hover:underline transition-colors">
                  paulalohoutade7@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <WhatsAppLogo size={16} className="text-white shrink-0" />
                <a href="tel:+2290195807402" className="hover:text-blue-600 hover:underline transition-colors">
                  +229 01 95 80 74 02
                </a>
              </li>
              <li className="flex items-start gap-2">
                <GoogleMapsLogo size={16} className="mt-0.5 text-white shrink-0" />
                <span>Avrankou, Bénin</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white">
          <p>© {new Date().getFullYear()} Chorale Hefzibah — Tous droits réservés</p>
          <Link to="/admin/login" className="hover:text-white transition-colors">
            Administration
          </Link>
        </div>
      </div>
    </footer>
  )
}