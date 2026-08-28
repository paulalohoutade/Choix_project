import { useState } from 'react'
import { useEvents } from '@/hooks'
import EventCard from '@/components/events/EventCard'
import { PageHero, EmptyState } from '@/components/ui'
import { CalendarDays } from 'lucide-react'
import type { Event } from '@/types'
import clsx from 'clsx'

const statuses = [
  { value: '', label: 'Tous' },
  { value: 'ongoing', label: 'En cours' },
  { value: 'upcoming', label: 'À venir' },
  { value: 'past', label: 'Passés' },
]

export default function Events() {
  const [status, setStatus] = useState('')
  const params = status ? { status } : {}
  const { data, isLoading } = useEvents(params)
  const events: Event[] = data?.data ?? (Array.isArray(data) ? data : [])

  return (
    <div>
      <PageHero title="Événements" subtitle="Concerts, messes et rendez-vous de la chorale" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Filters */}
        <div className="flex gap-2 mb-8">
          {statuses.map((s) => (
            <button
              key={s.value}
              onClick={() => setStatus(s.value)}
              className={clsx(
                'px-4 py-2 rounded-full text-sm font-semibold transition-colors',
                status === s.value
                  ? 'bg-cec-blue text-white'
                  : 'bg-white text-cec-blue border border-cec-blue/30 hover:border-cec-blue'
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 skeleton rounded-xl" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <EmptyState
            icon={<CalendarDays size={48} />}
            title="Aucun événement"
            message="Revenez bientôt pour découvrir les prochains événements."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {events.map((ev) => (
              <EventCard key={ev.id} event={ev} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
