import type { ReactNode, ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

// ── Loading skeleton ───────────────────────────────────────────────────────
export function Loading({ rows = 3, className = '' }: { rows?: number; className?: string }) {
  return (
    <div className={clsx('space-y-3', className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton h-8 rounded" style={{ width: `${70 + (i % 3) * 10}%` }} />
      ))}
    </div>
  )
}

export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-4 space-y-3">
          <div className="skeleton h-48 rounded-lg" />
          <div className="skeleton h-5 rounded w-3/4" />
          <div className="skeleton h-4 rounded w-1/2" />
        </div>
      ))}
    </div>
  )
}

// ── Page hero ──────────────────────────────────────────────────────────────
export function PageHero({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children?: ReactNode
}) {
  return (
    <div className="bg-cec-blue text-white py-14 px-4 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-cec-gold/5 pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative">
        <h1 className="text-4xl sm:text-5xl font-display font-bold mb-3 leading-tight">{title}</h1>
        {subtitle && <p className="text-white/70 text-lg">{subtitle}</p>}
        {children}
      </div>
    </div>
  )
}

// ── Button ─────────────────────────────────────────────────────────────────
type BtnVariant = 'primary' | 'gold' | 'outline' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants: Record<BtnVariant, string> = {
    primary: 'bg-cec-blue text-white hover:bg-cec-blue-mid',
    gold:    'bg-cec-gold text-cec-blue hover:bg-cec-gold-light',
    outline: 'border border-cec-blue text-cec-blue hover:bg-cec-blue hover:text-white',
    ghost:   'text-cec-blue hover:bg-cec-blue/5',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  }

  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}

// ── Empty state ────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, message }: { icon?: ReactNode; title: string; message?: string }) {
  return (
    <div className="text-center py-20 px-4">
      {icon && <div className="flex justify-center mb-4 text-cec-blue/30">{icon}</div>}
      <h3 className="text-xl font-display font-bold text-cec-blue mb-2">{title}</h3>
      {message && <p className="text-gray-500">{message}</p>}
    </div>
  )
}

// ── Badge ──────────────────────────────────────────────────────────────────
export function Badge({
  children,
  color = 'blue',
}: {
  children: ReactNode
  color?: 'blue' | 'gold' | 'green' | 'red' | 'gray'
}) {
  const colors = {
    blue:  'bg-cec-blue text-white',
    gold:  'bg-cec-gold text-cec-blue',
    green: 'bg-emerald-100 text-emerald-800',
    red:   'bg-red-100 text-red-800',
    gray:  'bg-stone-100 text-stone-600',
  }
  return (
    <span className={clsx('badge', colors[color])}>
      {children}
    </span>
  )
}
