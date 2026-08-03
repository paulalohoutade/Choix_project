import { Link } from 'react-router-dom'
import { Music, Facebook, Youtube, Instagram, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-cec-dark text-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-cec-gold flex items-center justify-center">
                <Music size={20} className="text-cec-blue" />
              </div>
              <div>
                <p className="font-display font-bold text-white text-lg">Chorale Hefzibah</p>
                <p className="text-cec-gold/60 text-xs">Kouti Kpinlè Centre</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-white/60">
              Louange et adoration au service de l'Église du Christianisme Céleste.
            </p>
            <div className="flex gap-3 mt-5">
              {[
                { icon: Facebook, href: '#' },
                { icon: Youtube, href: '#' },
                { icon: Instagram, href: '#' },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center
                             justify-center hover:border-cec-gold hover:text-cec-gold transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Navigation</h3>
            <ul className="space-y-2 text-sm">
              {[
                { to: '/albums', label: 'Musique' },
                { to: '/evenements', label: 'Événements' },
                { to: '/actualites', label: 'Actualités' },
                { to: '/galerie', label: 'Galerie' },
                { to: '/membres', label: 'Membres' },
                { to: '/apropos', label: 'À propos' },
                { to: '/contact', label: 'Contact' },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-cec-gold transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-2">
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail size={14} className="mt-1 text-cec-gold flex-shrink-0" />
                <span>contactchorale@gmail.com</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={14} className="mt-1 text-cec-gold flex-shrink-0" />
                <span>+229 01 95 80 74 02</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-1 text-cec-gold flex-shrink-0" />
                <span>Avrankou, Bénin</span>
              </li>
            </ul>
          </div>

          {/* CTA — dons discret */}
          <div className="md:col-span-1">
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Nous soutenir</h3>
            <p className="text-sm mb-4 text-white/60">
              Soutenez la mission de la chorale par votre don.
            </p>
            <Link
              to="/dons"
              className="inline-block border border-cec-gold/50 text-cec-gold text-sm px-4 py-2
                         rounded-lg hover:bg-cec-gold hover:text-cec-blue transition-colors font-semibold"
            >
              Faire un don
            </Link>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row
                        items-center justify-between gap-3 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Chorale CEC — Tous droits réservés</p>
          <Link to="/admin/login" className="hover:text-white/70 transition-colors">
            Administration
          </Link>
        </div>
      </div>
    </footer>
  )
}
