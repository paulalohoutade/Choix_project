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

  const units: { label: string; value: number }[] = [
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
