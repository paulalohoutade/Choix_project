import { Link } from 'react-router-dom'
import { Music, Heart, Users, Calendar } from 'lucide-react'
import { PageHero } from '@/components/ui'

const VALEURS = [
  {
    icon: Music,
    titre: 'Louange',
    texte: 'La musique est notre offrande à Dieu. Chaque note, chaque accord est une prière montant vers le Ciel.',
  },
  {
    icon: Heart,
    titre: 'Dévotion',
    texte: "Nous servons avec foi et humilité, mettant nos talents au service de l'Église du Christianisme Céleste.",
  },
  {
    icon: Users,
    titre: 'Communauté',
    texte: 'La chorale est une famille. Nous grandissons ensemble, dans la fraternité et le partage.',
  },
  {
    icon: Calendar,
    titre: 'Engagement',
    texte: 'Répétitions régulières, concerts, messes et événements : notre chorale anime la vie spirituelle de notre Église.',
  },
]

export default function APropos() {
  return (
    <div>
      <PageHero
        title="À propos"
        subtitle="Qui sommes-nous ?"
      />

      {/* Histoire */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          {/* Logo / image */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-cec-gold/30 shadow-gold bg-cec-blue/5">
              <img
                src="/logo.png"
                alt="Logo Chorale Hefzibah"
                className="w-full h-full object-contain p-4"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement
                  if (fallback) fallback.style.display = 'flex'
                }}
              />
              <div className="w-full h-full items-center justify-center hidden">
                <Music size={64} className="text-cec-blue/30" />
              </div>
            </div>
          </div>

          {/* Texte */}
          <div>
            <p className="text-cec-gold text-xs font-bold uppercase tracking-widest mb-3">
              Notre histoire
            </p>
            <h2 className="font-display text-3xl font-bold text-cec-blue mb-5">
              La Chorale de l'Église du<br />Christianisme Céleste
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                La Chorale Hefzibah est le chœur officiel de l'Église du Christianisme Céleste.
                Fondée pour glorifier Dieu à travers le chant et la musique, elle rassemble des fidèles
                passionnés unis par leur amour de la louange et de l'adoration.
              </p>
              <p>
                Au fil des années, la chorale a grandi, enrichissant le patrimoine musical
                de l'Église avec des albums, des concerts et des cantiques qui touchent les cœurs
                et élèvent les âmes vers le Seigneur.
              </p>
              <p>
                Aujourd'hui, la Chorale Hefzibah continue sa mission avec ferveur :
                chanter la gloire de Dieu dans la joie, la prière et la fraternité.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-cec-gold text-xs font-bold uppercase tracking-widest mb-2">Ce qui nous anime</p>
            <h2 className="font-display text-3xl font-bold text-cec-blue">Nos valeurs</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {VALEURS.map(({ icon: Icon, titre, texte }) => (
              <div key={titre} className="flex gap-5">
                <div className="w-12 h-12 rounded-xl bg-cec-blue/10 flex items-center
                                justify-center flex-shrink-0">
                  <Icon size={22} className="text-cec-blue" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-cec-blue text-lg mb-2">{titre}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{texte}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-cec-blue py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-cec-gold/70 text-xs font-bold uppercase tracking-widest mb-3">Notre mission</p>
          <h2 className="font-display text-3xl font-bold text-white mb-6">
            Chanter la gloire de Dieu
          </h2>
          <p className="text-white/70 text-lg leading-relaxed mb-10">
            À travers nos albums, nos concerts et notre présence dans les cérémonies de l'Église,
            nous portons un message d'espoir, d'amour et de foi. Rejoignez-nous dans cette belle aventure spirituelle.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/albums"
              className="bg-cec-gold text-cec-blue font-bold px-8 py-3 rounded-full
                         hover:bg-cec-gold-light transition-colors"
            >
              Découvrir nos albums
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white/40 text-white font-semibold px-8 py-3 rounded-full
                         hover:border-cec-gold hover:text-cec-gold transition-all"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
