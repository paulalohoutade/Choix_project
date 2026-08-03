import { useAdminDonations } from '@/hooks'
import { AdminPageHeader, AdminTable } from './Dashboard'
import { Badge } from '@/components/ui'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Donation } from '@/types'

export default function DonationsManager() {
  const { data, isLoading } = useAdminDonations()
  const donations: Donation[] = data?.data ?? (Array.isArray(data) ? data : [])

  const total = donations
    .filter(d => d.status === 'completed')
    .reduce((s, d) => s + d.amount, 0)

  return (
    <div>
      <AdminPageHeader
        title="Dons"
        subtitle={`Total collecté : ${total.toLocaleString()} XOF`}
      />

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total dons', value: donations.length, color: 'text-cec-blue' },
          { label: 'Complétés', value: donations.filter(d => d.status === 'completed').length, color: 'text-green-600' },
          { label: 'En attente', value: donations.filter(d => d.status === 'pending').length, color: 'text-orange-500' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl p-4 shadow-cec text-center">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-14 rounded-lg" />)}</div>
      ) : (
        <AdminTable headers={['Nom', 'Email', 'Montant', 'Référence', 'Statut', 'Date']} empty="Aucun don.">
          {donations.map(d => (
            <tr key={d.id} className="hover:bg-stone-50">
              <td className="px-4 py-3 font-semibold text-cec-blue">{d.name}</td>
              <td className="px-4 py-3 text-gray-500 text-sm">{d.email}</td>
              <td className="px-4 py-3 font-bold text-cec-blue">{d.amount.toLocaleString()} {d.currency}</td>
              <td className="px-4 py-3 text-gray-400 text-xs font-mono">{d.reference}</td>
              <td className="px-4 py-3">
                <Badge color={d.status === 'completed' ? 'green' : d.status === 'failed' ? 'red' : 'gray'}>
                  {d.status === 'completed' ? 'Complété' : d.status === 'failed' ? 'Échoué' : 'En attente'}
                </Badge>
              </td>
              <td className="px-4 py-3 text-gray-500 text-sm">
                {format(new Date(d.created_at), 'PP', { locale: fr })}
              </td>
            </tr>
          ))}
        </AdminTable>
      )}
    </div>
  )
}
