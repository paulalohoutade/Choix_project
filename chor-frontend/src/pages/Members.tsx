import { useMembers } from '@/hooks'
import { PageHero, EmptyState } from '@/components/ui'
import { Users, Crown } from 'lucide-react'
import type { Member } from '@/types'

export default function Members() {
  const { data, isLoading } = useMembers()
  const members: Member[] = Array.isArray(data) ? data : []
  const leaders = members.filter((m) => m.is_leader)
  const regular = members.filter((m) => !m.is_leader)

  return (
    <div>
      <PageHero title="Nos Membres" subtitle="L'équipe qui fait vivre la Chorale Hefzibah" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="skeleton w-full aspect-square rounded-full" />
                <div className="skeleton h-4 rounded w-3/4 mx-auto" />
              </div>
            ))}
          </div>
        ) : members.length === 0 ? (
          <EmptyState icon={<Users size={48} />} title="Aucun membre" />
        ) : (
          <>
            {leaders.length > 0 && (
              <section className="mb-14">
                <div className="flex items-center gap-2 mb-6">
                  <Crown size={18} className="text-cec-gold" />
                  <h2 className="text-xl font-display font-bold text-cec-blue">Direction & Responsables</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  {leaders.map((m) => <MemberCard key={m.id} member={m} />)}
                </div>
              </section>
            )}

            {regular.length > 0 && (
              <section>
                <h2 className="text-xl font-display font-bold text-cec-blue mb-6">Membres de la chorale</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {regular.map((m) => <MemberCard key={m.id} member={m} compact />)}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function MemberCard({ member, compact = false }: { member: Member; compact?: boolean }) {
  return (
    <div className="text-center group">
      <div className={`relative mx-auto rounded-full overflow-hidden bg-cec-blue/10 mb-3
                       ${compact ? 'w-20 h-20' : 'w-28 h-28'}`}>
        {member.photo_url ? (
          <img
            src={member.photo_url}
            alt={member.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-cec-blue/40 font-bold text-2xl">
              {member.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      <p className={`font-semibold text-cec-blue ${compact ? 'text-sm' : 'text-base'}`}>
        {member.name}
      </p>
      {member.role && (
        <p className="text-cec-gold text-xs mt-0.5">{member.role}</p>
      )}
      {!compact && member.bio && (
        <p className="text-xs text-gray-500 mt-2 line-clamp-2">{member.bio}</p>
      )}
    </div>
  )
}
