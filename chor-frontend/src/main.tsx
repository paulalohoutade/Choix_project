import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
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
            borderRadius: '16px',
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
              background: '#16a34a',
              color: '#ffffff',
              border: 'none',
            },
          },
          error: {
            style: {
              background: '#dc2626',
              color: '#ffffff',
              border: 'none',
            },
          },
        }}
      />
    </QueryClientProvider>
  </React.StrictMode>
)
