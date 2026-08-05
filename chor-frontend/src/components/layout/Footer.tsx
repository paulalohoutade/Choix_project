import { Link } from 'react-router-dom'
import { Music, Facebook, Youtube, Instagram, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Youtube, href: '#', label: 'Youtube' },
    { icon: Instagram, href: '#', label: 'Instagram' },
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
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-cec-gold flex items-center justify-center shrink-0">
                <Music size={20} className="text-cec-blue" />
              </div>
              <div>
                <p className="font-display font-bold text-white text-lg leading-tight">
                  Chorale Hefzibah
                </p>
                <p className="text-cec-gold/60 text-xs">Kouti Kpinlè Centre</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-white/80">
              Louange et adoration au service de l'Église du Christianisme Céleste.
            </p>
            <div className="flex gap-3 mt-5">
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
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-white/80 hover:text-cec-gold transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-cec-gold shrink-0" />
                <a href="mailto:contactchorale@gmail.com" className="hover:text-cec-gold transition-colors">
                  contactchorale@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-cec-gold shrink-0" />
                <a href="tel:+2290195807402" className="hover:text-cec-gold transition-colors">
                  +229 01 95 80 74 02
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 text-cec-gold shrink-0" />
                <span>Avrankou, Bénin</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/70">
          <p>© {new Date().getFullYear()} Chorale Hefzibah — Tous droits réservés</p>
          <Link to="/admin/login" className="hover:text-white transition-colors">
            Administration
          </Link>
        </div>
      </div>
    </footer>
  )
}