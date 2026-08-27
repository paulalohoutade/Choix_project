import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import { queryClient } from './lib/queryClient'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster
        position="top-center"
        containerStyle={{ top: '50%', transform: 'translateY(-50%)' }}
        gutter={12}
        toastOptions={{
          style: {
            borderRadius: '0',
            fontSize: '22px',
            fontWeight: '700',
            padding: '28px 32px',
            fontFamily: 'Montserrat, sans-serif',
            boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
            minWidth: '220px',
            maxWidth: 'min(90vw, 340px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            textAlign: 'center',
            lineHeight: 1.3,
          },
          success: {
            style: {
              background: '#15803d',
              color: '#ffffff',
              border: 'none',
            },
            icon: <CheckCircle2 size={44} color="#ffffff" strokeWidth={2.5} />,
          },
          error: {
            style: {
              background: '#b91c1c',
              color: '#ffffff',
              border: 'none',
            },
            icon: <AlertCircle size={44} color="#ffffff" strokeWidth={2.5} />,
          },
        }}
      />
    </QueryClientProvider>
  </React.StrictMode>
)
