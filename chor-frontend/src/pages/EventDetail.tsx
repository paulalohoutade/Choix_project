import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, MapPin } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useEvent } from '@/hooks'
import { Loading, Badge } from '@/components/ui'

export default function EventDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { data: event, isLoading, isError } = useEvent(slug!)

  if (isLoading) return <div className="max-w-3xl mx-auto px-4 py-12"><Loading /></div>
  if (isError || !event) return (
    <div className="text-center py-20">
      <p className="text-gray-500">Événement introuvable.</p>
      <Link to="/evenements" className="text-cec-blue hover:underline mt-3 inline-block">← Retour</Link>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Link to="/evenements" className="text-cec-blue text-sm flex items-center gap-1 hover:underline mb-6">
        <ArrowLeft size={14} /> Tous les événements
      </Link>

      {event.cover_url && (
        <img src={event.cover_url} alt={event.title}
          className="w-full aspect-video object-cover rounded-xl mb-8 shadow-cec" />
      )}

      <Badge color="blue">{event.type}</Badge>
      <h1 className="font-display text-3xl sm:text-4xl font-bold text-cec-blue mt-3 mb-4">
        {event.title}
      </h1>

      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-8">
        <span className="flex items-center gap-1.5">
          <Calendar size={15} className="text-cec-gold" />
          {format(new Date(event.event_date), "EEEE d MMMM yyyy 'à' HH'h'mm", { locale: fr })}
        </span>
        {event.location && (
          <span className="flex items-center gap-1.5">
            <MapPin size={15} className="text-cec-gold" />
            {event.location}
          </span>
        )}
      </div>

      {event.description && (
        <div className="prose prose-stone max-w-none text-gray-700 leading-relaxed">
          <p>{event.description}</p>
        </div>
      )}
    </div>
  )
}
