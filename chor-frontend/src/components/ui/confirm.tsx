import { useCallback, useRef, useState } from 'react'
import { AlertTriangle, Trash2 } from 'lucide-react'
import { Button } from './index'

export interface ConfirmOptions {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
}

export function useConfirm() {
  const [options, setOptions] = useState<ConfirmOptions | null>(null)
  const resolver = useRef<((value: boolean) => void) | null>(null)

  const confirm = useCallback((opts: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve
      setOptions(opts)
    })
  }, [])

  const close = (result: boolean) => {
    resolver.current?.(result)
    resolver.current = null
    setOptions(null)
  }

  const dialog = options ? (
    <ConfirmDialog
      options={options}
      onConfirm={() => close(true)}
      onCancel={() => close(false)}
    />
  ) : null

  return { confirm, dialog }
}

export function ConfirmDialog({
  options,
  onConfirm,
  onCancel,
}: {
  options: ConfirmOptions
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onCancel}>
      <div
        className="bg-white rounded-none w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-6 py-4 border-b">
          <span className="flex h-11 w-11 items-center justify-center bg-red-100 text-red-600">
            <AlertTriangle size={22} />
          </span>
          <div>
            <h2 className="font-display font-bold text-cec-blue">{options.title}</h2>
            <p className="text-sm text-gray-500">Cette action est irréversible.</p>
          </div>
        </div>
        <div className="px-6 py-5">
          <p className="text-gray-700">{options.message}</p>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t bg-stone-50">
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            {options.cancelLabel ?? 'Annuler'}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className="flex-1 bg-red-600 text-white hover:bg-red-700"
          >
            <Trash2 size={16} /> {options.confirmLabel ?? 'Supprimer'}
          </Button>
        </div>
      </div>
    </div>
  )
}
