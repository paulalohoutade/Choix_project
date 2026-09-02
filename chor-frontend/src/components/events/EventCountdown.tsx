import { useEffect, useState } from 'react'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function diff(target: Date): TimeLeft {
  const now = new Date()

  const hours = 23 - now.getHours()
  const minutes = 59 - now.getMinutes()
  const seconds = 59 - now.getSeconds()

  const targetStart = new Date(target.getFullYear(), target.getMonth(), target.getDate())
  const tomorrowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
  const days = Math.max(0, Math.round((targetStart.getTime() - tomorrowStart.getTime()) / 86400000))

  return { days, hours, minutes, seconds }
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

  if (left.days <= 0 && left.hours <= 0 && left.minutes <= 0 && left.seconds <= 0) {
    return null
  }

  const units: { label: string; value: number; color: string }[] = [
    { label: 'Jours', value: left.days, color: 'text-green-600' },
    { label: 'Heures', value: left.hours, color: 'text-gray-600' },
    { label: 'Min', value: left.minutes, color: 'text-gray-600' },
    { label: 'Sec', value: left.seconds, color: 'text-red-600' },
  ]

  return (
    <div className="mt-4">
      <div className="grid grid-cols-4 gap-1.5 text-center">
        {units.map((u) => (
          <div key={u.label} className="bg-stone-100 py-2 rounded-lg">
            <p className={`font-display font-bold text-lg leading-none ${u.color}`}>{pad(u.value)}</p>
            <p className="text-[10px] uppercase tracking-wide text-stone-400 mt-0.5">{u.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
