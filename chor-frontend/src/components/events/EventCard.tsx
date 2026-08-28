import { Link } from 'react-router-dom'
import { Calendar, MapPin } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Event } from '@/types'
import { Badge } from '@/components/ui'
import EventCountdown from './EventCountdown'
import clsx from 'clsx'

interface Props {
  event: Event
  compact?: boolean
}

const typeColors: Record<string, 'blue' | 'gold' | 'green'> = {
  concert:    'gold',
  messe:      'blue',
  culte:      'blue',
  répétition: 'green',
  other:      'gray' as 'green',
}

export default function EventCard({ event, compact = false }: Props) {
  const date = new Date(event.event_date)

  return (
    <Link
      to={`/evenements/${event.slug}`}
      className={clsx(
        'group block bg-white rounded-xl border border-stone-100 overflow-hidden',
        'hover:shadow-gold transition-all duration-300',
        !compact && 'shadow-cec'
      )}
    >
      {/* Cover */}
      {!compact && event.cover_url && (
        <div className="aspect-video overflow-hidden bg-stone-100">
          <img
            src={event.cover_url}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      <div className="p-5">
        {/* Date block */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-14 text-center bg-cec-blue rounded-lg py-2 px-1">
            <p className="text-cec-gold text-xs font-bold uppercase">
              {format(date, 'MMM', { locale: fr })}
            </p>
            <p className="text-white text-2xl font-display font-bold leading-none">
              {format(date, 'd')}
            </p>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Badge color={typeColors[event.type] ?? 'blue'}>
                {event.type}
              </Badge>
              {event.status === 'upcoming' && (
                <Badge color="green">À venir</Badge>
              )}
              {event.status === 'past' && (
                <Badge color="red">Passé</Badge>
              )}
            </div>
            <h3 className="font-display font-bold text-cec-blue text-base mt-1.5 line-clamp-2 group-hover:text-cec-blue-light">
              {event.title}
            </h3>
          </div>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {format(date, 'EEEE d MMMM yyyy', { locale: fr })}
          </span>
          {event.location && (
            <span className="flex items-center gap-1">
              <MapPin size={12} />
              {event.location}
            </span>
          )}
        </div>

        {/* Countdown */}
        {event.status === 'upcoming' && !compact && (
          <EventCountdown target={event.event_date} />
        )}
      </div>
    </Link>
  )
}
