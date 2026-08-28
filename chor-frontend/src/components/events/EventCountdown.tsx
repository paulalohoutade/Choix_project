import { useEffect, useState } from 'react'

interface TimeLeft {
  months: number
  days: number
  hours: number
  minutes: number
  seconds: number
}

function diff(target: Date): TimeLeft {
  const total = Math.max(0, target.getTime() - Date.now())
  const seconds = Math.floor(total / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)

  return {
    months,
    days: days % 30,
    hours: hours % 24,
    minutes: minutes % 60,
    seconds: seconds % 60,
  }
}

function pad(n: number): string {
  return n.toString().padStart(2, '0')
}

export default function EventCountdown({ target }: { target: string | Date }) {
  const date = target instanceof Date ? target : new Date(target)
  const [left, setLeft] = useState<TimeLeft>(() => diff(date))

  useEffect(() => {
    const timer = setInterval(() => setLeft(diff(date)), 1000)
    return () => clearInterval(timer)
  }, [date])

  if (left.months <= 0 && left.days <= 0 && left.hours <= 0 && left.minutes <= 0 && left.seconds <= 0) {
    return null
  }

  const units: { label: string; value: number }[] = [
    { label: 'Mois', value: left.months },
    { label: 'Jours', value: left.days },
    { label: 'Heures', value: left.hours },
    { label: 'Min', value: left.minutes },
    { label: 'Sec', value: left.seconds },
  ]

  return (
    <div className="mt-4">
      <div className="grid grid-cols-5 gap-1.5 text-center">
        {units.map((u) => (
          <div key={u.label} className="bg-cec-blue text-white py-2 rounded-lg">
            <p className="font-display font-bold text-lg leading-none">{pad(u.value)}</p>
            <p className="text-[10px] uppercase tracking-wide text-cec-gold mt-0.5">{u.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
