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
        gutter={12}
        toastOptions={{
          style: {
            borderRadius: '12px',
            fontSize: '17px',
            fontWeight: '600',
            padding: '16px 24px',
            fontFamily: 'Montserrat, sans-serif',
            boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
            maxWidth: '90vw',
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
